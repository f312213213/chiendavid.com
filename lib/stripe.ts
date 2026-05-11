import 'server-only';
import Stripe from 'stripe';
import { unstable_cache } from 'next/cache';

const stripeKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })
  : null;

// Fill these in with your Stripe account IDs. Each entry shows up as a row on /projects.
const ACCOUNTS: Array<{ id: string; name: string; url?: string }> = [
  // { id: 'acct_xxx', name: 'My Project', url: 'https://example.com' },
  { id: 'acct_1TG5j8RVqXcKPMLg', name: 'JobBeacon', url: 'https://jobbeacon.app' },
  { id: 'acct_1T9O0SEzPqGqEGFX', name: 'Demo Done', url: 'https://demodone.app' },
  { id: 'acct_1TIHpTGZjIzQLRBu', name: 'Ryven', url: 'https://ryven.dev' },
  { id: 'acct_1TUpN7Gvh0moignF', name: 'Replier', url: 'https://usereplier.com' },
];

export type ProjectStats = {
  project: string;
  accountId: string;
  url?: string;
  mrr: number;
  currency: string;
  activeSubscriptions: number;
  payingSubscriptions: number;
};

function intervalToMonthlyFactor(interval: Stripe.Price.Recurring.Interval, count: number): number {
  switch (interval) {
    case 'month':
      return 1 / count;
    case 'year':
      return 1 / (12 * count);
    case 'week':
      return 52 / 12 / count;
    case 'day':
      return 30 / count;
    default:
      return 0;
  }
}

async function fetchAccountStats(
  accountId: string,
  displayName: string,
  url: string | undefined,
): Promise<ProjectStats[]> {
  if (!stripe) return [];

  const buckets = new Map<string, ProjectStats>();
  // Seed an empty bucket so every configured account appears even with no subs.
  buckets.set(displayName, {
    project: displayName,
    accountId,
    url,
    mrr: 0,
    currency: 'usd',
    activeSubscriptions: 0,
    payingSubscriptions: 0,
  });
  let starting_after: string | undefined;

  const couponCache = new Map<string, Stripe.Coupon | null>();
  const fetchCoupon = async (id: string): Promise<Stripe.Coupon | null> => {
    if (couponCache.has(id)) return couponCache.get(id)!;
    try {
      const coupon = await stripe!.coupons.retrieve(id, undefined, { stripeContext: accountId });
      couponCache.set(id, coupon);
      return coupon;
    } catch {
      couponCache.set(id, null);
      return null;
    }
  };

  do {
    const page: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list(
      {
        status: 'active',
        limit: 100,
        starting_after,
        expand: ['data.discounts.source.coupon', 'data.customer'],
      },
      { stripeContext: accountId },
    );

    for (const sub of page.data) {
      // "Forward-committed MRR" — exclude subs scheduled to cancel or paused.
      // These are still active right now but won't recur, so we don't count them.
      // Doesn't match Stripe's "Active Subscription MRR" exactly; matches "Net New MRR".
      const countsTowardMrr =
        !sub.cancel_at_period_end && !sub.cancel_at && !sub.pause_collection;

      // Compute the per-period subtotal first, apply coupons there, then normalize.
      // Critical for amount_off coupons on yearly plans: $120/yr - $10 must become
      // $110/yr → $9.17/mo, not $10/mo - $10 = $0.
      let subPerPeriodCents = 0;
      let factor = 0;
      let currency = 'usd';

      for (const item of sub.items.data) {
        const price = item.price;
        if (!price.recurring || !price.unit_amount) continue;
        // Metered: actual usage requires invoice access we don't have.
        // Treat as $0; the sub still counts as a customer.
        if (price.recurring.usage_type === 'metered') continue;

        factor = intervalToMonthlyFactor(price.recurring.interval, price.recurring.interval_count || 1);
        subPerPeriodCents += price.unit_amount * (item.quantity ?? 1);
        currency = price.currency;
      }

      if (countsTowardMrr && subPerPeriodCents > 0) {
        const coupons: Stripe.Coupon[] = [];

        for (const d of sub.discounts) {
          if (typeof d === 'string') continue;
          const c = d.source?.coupon;
          if (c && typeof c !== 'string') coupons.push(c);
          else if (typeof c === 'string') {
            const fetched = await fetchCoupon(c);
            if (fetched) coupons.push(fetched);
          }
        }

        if (typeof sub.customer === 'object' && !sub.customer.deleted) {
          const c = sub.customer.discount?.source?.coupon;
          if (c && typeof c !== 'string') coupons.push(c);
          else if (typeof c === 'string') {
            const fetched = await fetchCoupon(c);
            if (fetched) coupons.push(fetched);
          }
        }

        for (const coupon of coupons) {
          if (coupon.percent_off) {
            subPerPeriodCents *= 1 - coupon.percent_off / 100;
          } else if (coupon.amount_off) {
            subPerPeriodCents = Math.max(0, subPerPeriodCents - coupon.amount_off);
          }
        }
      }

      const subMrrCents = countsTowardMrr ? subPerPeriodCents * factor : 0;


      const bucket = buckets.get(displayName) ?? {
        project: displayName,
        accountId,
        url,
        mrr: 0,
        currency,
        activeSubscriptions: 0,
        payingSubscriptions: 0,
      };

      bucket.mrr += subMrrCents;
      bucket.activeSubscriptions += 1;
      if (subMrrCents > 0) bucket.payingSubscriptions += 1;

      buckets.set(displayName, bucket);
    }

    starting_after = page.has_more ? page.data[page.data.length - 1]?.id : undefined;
  } while (starting_after);

  return Array.from(buckets.values()).map(b => ({ ...b, mrr: Math.round(b.mrr) }));
}

async function fetchProjectStats(): Promise<ProjectStats[]> {
  if (!stripe) {
    console.warn('[stripe] STRIPE_SECRET_KEY not set');
    return [];
  }

  if (ACCOUNTS.length === 0) {
    console.warn('[stripe] no accounts configured in lib/stripe.ts ACCOUNTS');
    return [];
  }

  const results = await Promise.all(
    ACCOUNTS.map(({ id, name, url }) => fetchAccountStats(id, name, url)),
  );

  return results.flat().sort(
    (a, b) => b.mrr - a.mrr || b.activeSubscriptions - a.activeSubscriptions,
  );
}

export const getProjectStats = unstable_cache(fetchProjectStats, ['stripe-project-stats'], {
  revalidate: 900,
  tags: ['stripe-mrr'],
});

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
