import type { ContributionCalendar } from '@/lib/github';

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

export function formatNumber(value: number): string {
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

function contributionLabel(count: number): string {
  return count === 1 ? '1 contribution' : `${formatNumber(count)} contributions`;
}

export default function ContributionGraph({
  calendar,
  className = '',
}: {
  calendar: ContributionCalendar;
  className?: string;
}) {
  const monthPositions = getMonthPositions(calendar);
  const weekCount = calendar.weeks.length;
  const graphColumns = `repeat(${weekCount}, ${CONTRIBUTION_CELL_SIZE}px)`;
  const graphRows = `repeat(7, ${CONTRIBUTION_CELL_SIZE}px)`;
  const graphGap = `${CONTRIBUTION_CELL_GAP}px`;
  const graphWidth = weekCount * CONTRIBUTION_CELL_SIZE + (weekCount - 1) * CONTRIBUTION_CELL_GAP;
  const minGraphWidth = graphWidth + CONTRIBUTION_LABEL_WIDTH + 12;
  const summary = `${contributionLabel(calendar.totalContributions)} in ${calendar.year}`;

  return (
    <section className={`w-full ${className}`}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="contribution-graph-heading text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">
          {calendar.year}
        </h2>
        <p className="text-sm text-muted">
          <span className="contribution-graph-count text-base font-semibold tabular-nums">
            {formatNumber(calendar.totalContributions)}
          </span>{' '}
          {calendar.totalContributions === 1 ? 'contribution' : 'contributions'}
          <span className="hidden sm:inline">
            {' · '}
            <span className="tabular-nums">{formatNumber(calendar.activeDays)}</span> active days
          </span>
        </p>
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
                aria-label={summary}
              >
                {calendar.weeks.flatMap((week, weekIndex) => (
                  week.days.map((day, dayIndex) => {
                    const label = contributionLabel(day.count);
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
