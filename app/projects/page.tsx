import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectStats, formatMoney } from '@/lib/stripe';
import { getContributionCalendar, type ContributionCalendar } from '@/lib/github';

export const metadata: Metadata = {
  title: 'Projects — David Chien',
  description: 'Payments from the things I build.',
};

export const revalidate = 900;

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAY_LABELS = [
  { label: 'Mon', row: 2 },
  { label: 'Wed', row: 4 },
  { label: 'Fri', row: 6 },
];

const CONTRIBUTION_CELL_SIZE = 12;
const CONTRIBUTION_CELL_GAP = 4;
const CONTRIBUTION_LABEL_WIDTH = 38;

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatContributionDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function formatContributionTooltipDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function getMonthPositions(calendar: ContributionCalendar) {
  return calendar.weeks.flatMap((week, weekIndex) => {
    const firstOfMonth = week.days.find(day => day.inYear && day.date.endsWith('-01'));
    if (!firstOfMonth) return [];

    return [{
      month: Number(firstOfMonth.date.slice(5, 7)) - 1,
      weekIndex,
    }];
  });
}

function ContributionGraph({ calendar }: { calendar: ContributionCalendar }) {
  const monthPositions = getMonthPositions(calendar);
  const weekCount = calendar.weeks.length;
  const graphColumns = `repeat(${weekCount}, ${CONTRIBUTION_CELL_SIZE}px)`;
  const graphRows = `repeat(7, ${CONTRIBUTION_CELL_SIZE}px)`;
  const graphGap = `${CONTRIBUTION_CELL_GAP}px`;
  const graphWidth = weekCount * CONTRIBUTION_CELL_SIZE + (weekCount - 1) * CONTRIBUTION_CELL_GAP;
  const minGraphWidth = graphWidth + CONTRIBUTION_LABEL_WIDTH + 12;
  const usesOfficialContributions = calendar.source === 'github';
  const hasActivityData = calendar.source !== 'unavailable';
  const activityNoun = usesOfficialContributions ? 'contributions' : 'commits';

  return (
    <section className="animate-in delay-4 mb-28 w-full">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="contribution-graph-heading text-2xl md:text-3xl font-semibold tracking-tight">
          {hasActivityData ? (
            <>
              <span className="contribution-graph-count tabular-nums">
                {formatNumber(calendar.totalContributions)}
              </span>{' '}
              <span>{activityNoun} in {calendar.year}</span>
            </>
          ) : `Contributions in ${calendar.year}`}
        </h2>
        <a
          href="https://github.com/f312213213"
          target="_blank"
          rel="noopener noreferrer"
          className="contribution-github-link text-sm font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors"
        >
          GitHub <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="contribution-graph-card relative isolate box-border w-full overflow-hidden rounded-lg border border-border bg-[color-mix(in_srgb,var(--foreground)_2%,var(--background))] px-4 py-5 sm:px-6 sm:py-7">
        <div className="relative z-10 overflow-x-auto pb-2">
          <div className="mx-auto" style={{ width: minGraphWidth }}>
            <div className="grid grid-cols-[38px_1fr] gap-x-3">
              <div aria-hidden />
              <div
                className="grid h-7 items-end text-sm font-semibold text-foreground/85"
                style={{
                  columnGap: graphGap,
                  gridTemplateColumns: graphColumns,
                }}
              >
                {monthPositions.map(({ month, weekIndex }) => (
                  <span
                    key={month}
                    className="contribution-month-label leading-none"
                    style={{ gridColumn: `${weekIndex + 1} / span 4` }}
                  >
                    {MONTH_LABELS[month]}
                  </span>
                ))}
              </div>

              <div
                className="grid gap-1 pt-1 text-sm font-semibold leading-3 text-foreground"
                style={{
                  rowGap: graphGap,
                  gridTemplateRows: graphRows,
                }}
                aria-hidden
              >
                {WEEKDAY_LABELS.map(day => (
                  <span
                    key={day.label}
                    className="contribution-weekday-label leading-3"
                    style={{ gridRow: String(day.row) }}
                  >
                    {day.label}
                  </span>
                ))}
              </div>

              <div
                className="grid grid-flow-col pt-1"
                style={{
                  gap: graphGap,
                  gridTemplateColumns: graphColumns,
                  gridTemplateRows: graphRows,
                }}
                aria-label={hasActivityData
                  ? `${formatNumber(calendar.totalContributions)} ${activityNoun} in ${calendar.year}`
                  : `Contribution graph for ${calendar.year}`}
              >
                {calendar.weeks.flatMap((week, weekIndex) => (
                  week.days.map((day, dayIndex) => {
                    const label = day.count === 1
                      ? `1 ${activityNoun.slice(0, -1)}`
                      : `${formatNumber(day.count)} ${activityNoun}`;
                    const fullLabel = `${label} on ${formatContributionDate(day.date)}`;
                    const tooltipLabel = `${formatContributionTooltipDate(day.date)} · ${label}`;
                    const revealDelay = weekIndex * 8 + dayIndex * 14;
                    const cellClassName = day.inYear
                      ? `contribution-cell contribution-cell--day block rounded-[3px] ${day.count > 0 ? 'contribution-cell--active' : ''}`
                      : 'contribution-cell block rounded-[3px] opacity-0';

                    return (
                      <time
                        key={day.date}
                        className={cellClassName}
                        dateTime={day.date}
                        data-count={day.inYear ? day.count : undefined}
                        data-level={day.inYear ? day.level : 0}
                        data-tooltip={day.inYear ? tooltipLabel : undefined}
                        style={{
                          animationDelay: day.inYear ? `${revealDelay}ms` : undefined,
                          height: CONTRIBUTION_CELL_SIZE,
                          width: CONTRIBUTION_CELL_SIZE,
                        }}
                        aria-label={fullLabel}
                        aria-hidden={day.inYear ? undefined : true}
                      >
                        {day.inYear && <span className="sr-only">{fullLabel}</span>}
                      </time>
                    );
                  })
                ))}
              </div>
            </div>

            <div className="contribution-legend mt-5 flex justify-end pl-[50px] text-sm text-muted">
              <div className="flex items-center gap-2">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map(level => (
                  <span
                    key={level}
                    className="contribution-cell contribution-cell--legend block rounded-[3px]"
                    data-level={level}
                    style={{
                      height: CONTRIBUTION_CELL_SIZE,
                      width: CONTRIBUTION_CELL_SIZE,
                    }}
                    aria-hidden
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ProjectsPage() {
  const [stats, contributionCalendar] = await Promise.all([
    getProjectStats(),
    getContributionCalendar(),
  ]);

  // Only sum projects that share the dominant currency — prevents mixing
  // e.g. cents of USD and EUR into a meaningless total.
  const dominantCurrency = stats[0]?.currency ?? 'usd';
  const sameCurrency = stats.filter(s => s.currency === dominantCurrency);
  const totalPaid = sameCurrency.reduce((sum, s) => sum + s.mrr, 0);
  const totalCustomers = stats.reduce((sum, s) => sum + (s.totalCustomers ?? s.activeSubscriptions), 0);
  const totalPaying = stats.reduce((sum, s) => sum + s.payingSubscriptions, 0);
  const unpaidUsers = totalCustomers - totalPaying;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-24 pb-32">
      <nav className="animate-in delay-1 mb-20 max-w-3xl text-sm">
        <Link href="/" className="text-muted hover:text-foreground transition-colors">
          ← Home
        </Link>
      </nav>

      <section className="mb-20 max-w-3xl">
        <p className="animate-in delay-1 text-xs uppercase tracking-[0.25em] text-muted mb-8">
          Paid last 30 days
        </p>
        <h1 className="animate-in delay-2 text-[clamp(4.5rem,18vw,11rem)] font-bold tracking-tight tabular-nums leading-[0.85] text-accent">
          {formatMoney(totalPaid, dominantCurrency)}
        </h1>
        {totalCustomers > 0 && (
          <p className="animate-in delay-3 text-lg text-foreground/70 mt-10 max-w-prose">
            From{' '}
            <span className="text-foreground font-medium">{totalPaying}</span>{' '}
            {totalPaying === 1 ? 'customer' : 'customers'} with payments
            {unpaidUsers > 0 && (
              <>
                {' '}
                (plus{' '}
                <span className="text-foreground font-medium">{unpaidUsers}</span>{' '}
                without payments in the window)
              </>
            )}{' '}
            across{' '}
            <span className="text-foreground font-medium">{stats.length}</span>{' '}
            {stats.length === 1 ? 'project' : 'projects'}.
          </p>
        )}
      </section>

      <ContributionGraph calendar={contributionCalendar} />

      {stats.length === 0 ? (
        <p className="max-w-3xl text-muted">No payments yet — still building.</p>
      ) : (
        <section className="max-w-5xl">
          <h2 className="animate-in delay-5 text-xs uppercase tracking-[0.25em] text-muted mb-8">
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
                        const unpaid = (s.totalCustomers ?? s.activeSubscriptions) - s.payingSubscriptions;
                        const parts: string[] = [];
                        if (s.payingSubscriptions > 0) {
                          parts.push(`${s.payingSubscriptions} paid`);
                        }
                        if (unpaid > 0) {
                          parts.push(`${unpaid} no payment`);
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
                    30D paid
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
