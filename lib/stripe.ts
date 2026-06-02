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

type PaidTotal = {
  amount: number;
  currency: string;
  paymentCount: number;
};

const PAYMENT_WINDOW_DAYS = 30;

function recentPaymentRange() {
  const now = Math.floor(Date.now() / 1000);

  return {
    gte: now - PAYMENT_WINDOW_DAYS * 24 * 60 * 60,
    lt: now,
  };
}

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

async function listAccountPaymentIntents(
  accountId: string,
  displayName: string,
): Promise<Stripe.PaymentIntent[]> {
  if (!stripe) return [];

  const paymentIntents: Stripe.PaymentIntent[] = [];
  const created = recentPaymentRange();
  let starting_after: string | undefined;

  try {
    do {
      const page: Stripe.ApiList<Stripe.PaymentIntent> = await stripe.paymentIntents.list(
        {
          created,
          limit: 100,
          starting_after,
        },
        { stripeContext: accountId },
      );

      paymentIntents.push(...page.data);

      starting_after = page.has_more ? page.data[page.data.length - 1]?.id : undefined;
    } while (starting_after);
  } catch (error) {
    console.warn(
      `[stripe] ${displayName}: could not list payment intents`,
      errorMessage(error),
    );
  }

  return paymentIntents;
}

async function fetchAccountStats(
  accountId: string,
  displayName: string,
  url: string | undefined,
): Promise<ProjectStats[]> {
  if (!stripe) return [];

  const buckets = new Map<string, ProjectStats>();
  // Seed an empty bucket so every configured account appears even with no payments.
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
  const paymentIntents = await listAccountPaymentIntents(accountId, displayName);
  const customerById = new Map(customers.map(customer => [customer.id, customer]));
  const paidByCustomer = new Map<string, PaidTotal>();

  for (const paymentIntent of paymentIntents) {
    if (paymentIntent.status !== 'succeeded') continue;

    const customerId =
      typeof paymentIntent.customer === 'string'
        ? paymentIntent.customer
        : paymentIntent.customer?.id;
    const amountReceived = paymentIntent.amount_received;

    if (!customerId || amountReceived <= 0) continue;

    const existing = paidByCustomer.get(customerId) ?? {
      amount: 0,
      currency: paymentIntent.currency,
      paymentCount: 0,
    };

    existing.amount += amountReceived;
    existing.currency = paymentIntent.currency;
    existing.paymentCount += 1;
    paidByCustomer.set(customerId, existing);
  }

  bucket.totalCustomers = customers.length;
  // Kept for the existing UI copy: this now means total Stripe customers/users.
  bucket.activeSubscriptions = customers.length;

  for (const [customerId, paid] of paidByCustomer) {
    const customer = customerById.get(customerId);

    bucket.mrr += paid.amount;
    bucket.currency = paid.currency;
    bucket.payingCustomers.push({
      id: customerId,
      name: customer?.name ?? undefined,
      email: customer?.email ?? undefined,
      amount: paid.amount,
      currency: paid.currency,
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
    : unstable_cache(fetchProjectStats, ['stripe-project-paid-last-30-days'], {
      revalidate: 900,
      tags: ['stripe-paid-last-30-days'],
    });

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
