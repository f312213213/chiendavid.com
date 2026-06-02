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
  { id: 'acct_1TYOq6KI2y3VrCZ5', name: 'TinyInbox', url: 'https://tinyinbox.co' },
];

export type ProjectStats = {
  project: string;
  accountId: string;
  url?: string;
  mrr: number;
  currency: string;
  totalCustomers: number;
  activeSubscriptions: number;
  payingSubscriptions: number;
  payingCustomers: Array<{
    id: string;
    name?: string;
    email?: string;
    amount: number;
    currency: string;
  }>;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

type SubscriptionTotal = {
  amount: number;
  currency: string;
};

const MRR_SUBSCRIPTION_STATUSES: Stripe.SubscriptionListParams.Status[] = [
  'active',
  'past_due',
];

async function listAccountCustomers(
  accountId: string,
  displayName: string,
): Promise<Stripe.Customer[]> {
  if (!stripe) return [];

  const customers: Stripe.Customer[] = [];
  let starting_after: string | undefined;

  try {
    do {
      const page: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list(
        {
          limit: 100,
          starting_after,
        },
        { stripeContext: accountId },
      );

      for (const customer of page.data) {
        customers.push(customer);
      }

      starting_after = page.has_more ? page.data[page.data.length - 1]?.id : undefined;
    } while (starting_after);

    return customers;
  } catch (error) {
    console.warn(
      `[stripe] ${displayName}: could not list customers`,
      errorMessage(error),
    );
    return [];
  }
}

async function listAccountSubscriptions(
  accountId: string,
  displayName: string,
): Promise<Stripe.Subscription[]> {
  if (!stripe) return [];

  const subscriptions: Stripe.Subscription[] = [];

  for (const status of MRR_SUBSCRIPTION_STATUSES) {
    let starting_after: string | undefined;

    try {
      do {
        const page: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list(
          {
            status,
            limit: 100,
            starting_after,
          },
          { stripeContext: accountId },
        );

        subscriptions.push(...page.data);

        starting_after = page.has_more ? page.data[page.data.length - 1]?.id : undefined;
      } while (starting_after);
    } catch (error) {
      console.warn(
        `[stripe] ${displayName}: could not list ${status} subscriptions`,
        errorMessage(error),
      );
    }
  }

  return subscriptions;
}

function decimalCentsToNumber(value: unknown): number | null {
  if (value == null) return null;

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function normalizeToMonthlyCents(
  amount: number,
  recurring: Stripe.Price.Recurring,
): number {
  const intervalCount = Math.max(recurring.interval_count, 1);

  switch (recurring.interval) {
    case 'day':
      return amount * (365 / 12) / intervalCount;
    case 'week':
      return amount * (52 / 12) / intervalCount;
    case 'month':
      return amount / intervalCount;
    case 'year':
      return amount / (12 * intervalCount);
  }
}

function itemMrrCents(item: Stripe.SubscriptionItem): number {
  const { price } = item;
  const { recurring } = price;

  if (!recurring || recurring.usage_type === 'metered') {
    return 0;
  }

  if (price.billing_scheme !== 'per_unit') {
    return 0;
  }

  const unitAmount = price.unit_amount ?? decimalCentsToNumber(price.unit_amount_decimal);

  if (unitAmount == null) {
    return 0;
  }

  return normalizeToMonthlyCents(unitAmount * (item.quantity ?? 1), recurring);
}

function subscriptionMrrCents(subscription: Stripe.Subscription): number {
  return subscription.items.data.reduce((sum, item) => sum + itemMrrCents(item), 0);
}

function subscriptionCustomerId(subscription: Stripe.Subscription): string {
  return typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;
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
    totalCustomers: 0,
    activeSubscriptions: 0,
    payingSubscriptions: 0,
    payingCustomers: [],
  });

  const bucket = buckets.get(displayName)!;
  const customers = await listAccountCustomers(accountId, displayName);
  const subscriptions = await listAccountSubscriptions(accountId, displayName);
  const customerById = new Map(customers.map(customer => [customer.id, customer]));
  const mrrByCustomer = new Map<string, SubscriptionTotal>();

  for (const subscription of subscriptions) {
    const amount = subscriptionMrrCents(subscription);

    if (amount <= 0) continue;

    const customerId = subscriptionCustomerId(subscription);
    const existing = mrrByCustomer.get(customerId) ?? {
      amount: 0,
      currency: subscription.currency,
    };

    existing.amount += amount;
    existing.currency = subscription.currency;
    mrrByCustomer.set(customerId, existing);
  }

  bucket.totalCustomers = customers.length;
  // Kept for the existing UI copy: this now means total Stripe customers/users.
  bucket.activeSubscriptions = customers.length;

  for (const [customerId, subscriptionTotal] of mrrByCustomer) {
    const customer = customerById.get(customerId);

    bucket.mrr += subscriptionTotal.amount;
    bucket.currency = subscriptionTotal.currency;
    bucket.payingCustomers.push({
      id: customerId,
      name: customer?.name ?? undefined,
      email: customer?.email ?? undefined,
      amount: subscriptionTotal.amount,
      currency: subscriptionTotal.currency,
    });
  }

  bucket.payingSubscriptions = bucket.payingCustomers.length;

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

export const getProjectStats =
  process.env.NODE_ENV === 'development'
    ? fetchProjectStats
    : unstable_cache(fetchProjectStats, ['stripe-project-stats'], {
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
