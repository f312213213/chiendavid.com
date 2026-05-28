import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectStats, formatMoney } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Projects — David Chien',
  description: 'Live MRR from the things I build.',
};

export const revalidate = 900;

export default async function ProjectsPage() {
  const stats = await getProjectStats();

  // Only sum projects that share the dominant currency — prevents mixing
  // e.g. cents of USD and EUR into a meaningless total.
  const dominantCurrency = stats[0]?.currency ?? 'usd';
  const sameCurrency = stats.filter(s => s.currency === dominantCurrency);
  const totalMrr = sameCurrency.reduce((sum, s) => sum + s.mrr, 0);
  const totalCustomers = stats.reduce((sum, s) => sum + (s.totalCustomers ?? s.activeSubscriptions), 0);
  const totalPaying = stats.reduce((sum, s) => sum + s.payingSubscriptions, 0);
  const freeUsers = totalCustomers - totalPaying;

  return (
    <main className="mx-auto max-w-3xl px-6 pt-24 pb-32">
      <nav className="animate-in delay-1 mb-20 text-sm">
        <Link href="/" className="text-muted hover:text-foreground transition-colors">
          ← Home
        </Link>
      </nav>

      <section className="mb-28">
        <p className="animate-in delay-1 text-xs uppercase tracking-[0.25em] text-muted mb-8">
          MRR
        </p>
        <h1 className="animate-in delay-2 text-[clamp(4.5rem,18vw,11rem)] font-bold tracking-tight tabular-nums leading-[0.85] text-accent">
          {formatMoney(totalMrr, dominantCurrency)}
        </h1>
        {totalCustomers > 0 && (
          <p className="animate-in delay-3 text-lg text-foreground/70 mt-10 max-w-prose">
            From{' '}
            <span className="text-foreground font-medium">{totalPaying}</span>{' '}
            paying {totalPaying === 1 ? 'customer' : 'customers'}
            {freeUsers > 0 && (
              <>
                {' '}
                (plus{' '}
                <span className="text-foreground font-medium">{freeUsers}</span>{' '}
                on free plans)
              </>
            )}{' '}
            across{' '}
            <span className="text-foreground font-medium">{stats.length}</span>{' '}
            {stats.length === 1 ? 'project' : 'projects'}.
          </p>
        )}
      </section>

      {stats.length === 0 ? (
        <p className="text-muted">No paying customers yet — still building.</p>
      ) : (
        <section>
          <h2 className="animate-in delay-4 text-xs uppercase tracking-[0.25em] text-muted mb-8">
            The lineup
          </h2>
          <ol>
            {stats.map((s, i) => (
              <li
                key={s.project}
                style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                className="animate-in flex items-baseline justify-between gap-8 py-6 border-b border-border first:border-t group"
              >
                <div className="flex items-baseline gap-6 min-w-0">
                  <span className="text-xs tabular-nums text-muted w-5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-medium truncate inline-flex items-baseline gap-1.5 hover:text-accent transition-colors"
                      >
                        {s.project}
                        <span aria-hidden className="text-sm text-muted group-hover:text-accent transition-colors">↗</span>
                      </a>
                    ) : (
                      <div className="text-xl font-medium truncate">
                        {s.project}
                      </div>
                    )}
                    <div className="text-sm text-muted mt-1">
                      {(() => {
                        const free = (s.totalCustomers ?? s.activeSubscriptions) - s.payingSubscriptions;
                        const parts: string[] = [];
                        if (s.payingSubscriptions > 0) {
                          parts.push(`${s.payingSubscriptions} paying`);
                        }
                        if (free > 0) {
                          parts.push(`${free} free`);
                        }
                        return parts.length === 0 ? 'No users yet' : parts.join(' · ');
                      })()}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-medium tabular-nums">
                    {formatMoney(s.mrr, s.currency)}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted mt-1">
                    MRR
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
