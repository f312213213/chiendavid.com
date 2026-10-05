import 'server-only';

const GITHUB_LOGIN = process.env.GITHUB_LOGIN ?? 'f312213213';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_LOGIN}`;

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
  inYear: boolean;
};

export type ContributionWeek = {
  firstDay: string;
  days: ContributionDay[];
};

export type ContributionCalendar = {
  year: number;
  totalContributions: number;
  activeDays: number;
  weeks: ContributionWeek[];
};

export type ContributionHistory = {
  login: string;
  /** Newest year first. Empty when GitHub could not be reached. */
  calendars: ContributionCalendar[];
  longestStreak: number;
  currentStreak: number;
};

type DayActivity = {
  count: number;
  level: ContributionLevel;
};

type ActivityByYear = Map<number, Map<string, DayActivity>>;

type GraphQLContributionCollection = {
  contributionCalendar: {
    weeks: Array<{
      contributionDays: Array<{
        date: string;
        contributionCount: number;
        contributionLevel: string;
      }>;
    }>;
  };
};

const CONTRIBUTION_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  ));
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toContributionLevel(level: string | undefined): ContributionLevel {
  const value = Number(level);
  if (value >= 4) return 4;
  if (value >= 3) return 3;
  if (value >= 2) return 2;
  if (value >= 1) return 1;
  return 0;
}

/** Lays a year out as Sunday-first weeks, padded with out-of-year days like GitHub's graph. */
function buildCalendar(
  year: number,
  activityByDate: Map<string, DayActivity>,
  today: Date,
): ContributionCalendar {
  const from = new Date(Date.UTC(year, 0, 1));
  const to = new Date(Date.UTC(year, 11, 31));
  const graphFrom = addUtcDays(from, -from.getUTCDay());
  const graphTo = addUtcDays(to, 6 - to.getUTCDay());
  const weeks: ContributionWeek[] = [];
  let totalContributions = 0;
  let activeDays = 0;

  for (let weekStart = graphFrom; weekStart <= graphTo; weekStart = addUtcDays(weekStart, 7)) {
    const days = Array.from({ length: 7 }, (_, weekday): ContributionDay => {
      const date = addUtcDays(weekStart, weekday);
      const key = toDateKey(date);
      const inYear = date >= from && date <= to;
      const activity = inYear && date <= today ? activityByDate.get(key) : undefined;
      const count = activity?.count ?? 0;

      if (count > 0) {
        totalContributions += count;
        activeDays += 1;
      }

      return { date: key, count, level: activity?.level ?? 0, inYear };
    });

    weeks.push({ firstDay: days[0].date, days });
  }

  return { year, totalContributions, activeDays, weeks };
}

function computeStreaks(calendars: ContributionCalendar[], today: Date) {
  if (calendars.length === 0) return { longestStreak: 0, currentStreak: 0 };

  const countByDate = new Map(
    calendars
      .flatMap(calendar => calendar.weeks.flatMap(week => week.days))
      .filter(day => day.inYear)
      .map(day => [day.date, day.count]),
  );
  const firstYear = Math.min(...calendars.map(calendar => calendar.year));
  let longestStreak = 0;
  let streak = 0;
  let streakBeforeToday = 0;

  // Walk every calendar day so gaps between fetched years still break a streak.
  for (let date = new Date(Date.UTC(firstYear, 0, 1)); date <= today; date = addUtcDays(date, 1)) {
    streakBeforeToday = streak;
    streak = (countByDate.get(toDateKey(date)) ?? 0) > 0 ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
  }

  // Like GitHub, a streak stays alive until today is over.
  return { longestStreak, currentStreak: streak || streakBeforeToday };
}

async function githubGraphQL<T>(query: string): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'chiendavid.com',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed (${response.status})`);
  }

  const payload = await response.json() as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map(error => error.message).join('; '));
  }
  if (!payload.data) {
    throw new Error('GitHub GraphQL returned no data');
  }

  return payload.data;
}

/** Every year of the token owner's contributions — private ones included — in two requests. */
async function fetchTokenActivity(currentYear: number): Promise<ActivityByYear> {
  const { viewer } = await githubGraphQL<{
    viewer: { contributionsCollection: { contributionYears: number[] } };
  }>('query { viewer { contributionsCollection { contributionYears } } }');

  const years = [...new Set([currentYear, ...viewer.contributionsCollection.contributionYears])];
  const fields = years.map(year => `
    y${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
      contributionCalendar {
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  `).join('');
  const data = await githubGraphQL<{
    viewer: Record<string, GraphQLContributionCollection>;
  }>(`query { viewer { ${fields} } }`);

  return new Map(years.map(year => {
    const activityByDate = new Map<string, DayActivity>();

    for (const week of data.viewer[`y${year}`].contributionCalendar.weeks) {
      for (const day of week.contributionDays) {
        activityByDate.set(day.date, {
          count: day.contributionCount,
          level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
        });
      }
    }

    return [year, activityByDate];
  }));
}

function parsePublicContributionHtml(html: string): Map<string, DayActivity> {
  const cellsById = new Map<string, { date: string; level: ContributionLevel }>();
  const activityByDate = new Map<string, DayActivity>();

  for (const match of html.matchAll(/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = match[0];
    const date = tag.match(/\bdata-date="([^"]+)"/)?.[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const level = toContributionLevel(tag.match(/\bdata-level="([^"]+)"/)?.[1]);

    if (!date || !id) continue;

    cellsById.set(id, { date, level });
    activityByDate.set(date, { count: 0, level });
  }

  for (const match of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)) {
    const cell = cellsById.get(match[1]);
    if (!cell) continue;

    const countMatch = match[2].match(/^([\d,]+) contributions? on /);
    const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0;

    activityByDate.set(cell.date, { count, level: cell.level });
  }

  return activityByDate;
}

/** Scrapes one year of the public profile graph, which includes private contribution counts. */
async function fetchPublicActivity(year: number): Promise<Map<string, DayActivity>> {
  const params = new URLSearchParams({ from: `${year}-01-01`, to: `${year}-12-31` });
  const response = await fetch(
    `https://github.com/users/${GITHUB_LOGIN}/contributions?${params}`,
    { headers: { 'User-Agent': 'chiendavid.com' } },
  );

  if (!response.ok) {
    throw new Error(`GitHub public contribution request failed (${response.status})`);
  }

  const activityByDate = parsePublicContributionHtml(await response.text());
  if (activityByDate.size === 0) {
    throw new Error('GitHub public contribution graph could not be parsed');
  }

  return activityByDate;
}

function sumActivity(activityByDate: Map<string, DayActivity> | undefined): number {
  let total = 0;
  for (const { count } of activityByDate?.values() ?? []) total += count;
  return total;
}

/**
 * The token is the only way to discover every contribution year, but the GraphQL calendar
 * has been observed to drop hundreds of private contributions that the profile graph still
 * counts (and vice versa). Both only ever undercount, so each year keeps the richer source.
 */
async function fetchActivity(currentYear: number): Promise<ActivityByYear> {
  let tokenActivity: ActivityByYear = new Map();

  if (GITHUB_TOKEN) {
    try {
      tokenActivity = await fetchTokenActivity(currentYear);
    } catch (error) {
      console.warn('[github] token request failed, using the public profile only:', error);
    }
  } else {
    console.warn('[github] GITHUB_TOKEN is not set, using the public profile only');
  }

  const years = tokenActivity.size > 0 ? [...tokenActivity.keys()] : [currentYear];
  const publicActivity = await Promise.all(years.map(year => (
    fetchPublicActivity(year).catch(error => {
      console.warn(`[github] public contribution graph for ${year} failed:`, error);
      return undefined;
    })
  )));
  const activityByYear: ActivityByYear = new Map();

  years.forEach((year, index) => {
    const fromToken = tokenActivity.get(year);
    const fromProfile = publicActivity[index];
    const richer = sumActivity(fromProfile) > sumActivity(fromToken) ? fromProfile : fromToken;

    if (richer) activityByYear.set(year, richer);
  });

  return activityByYear;
}

export async function getContributionHistory(): Promise<ContributionHistory> {
  const today = startOfUtcDay(new Date());
  const activityByYear = await fetchActivity(today.getUTCFullYear());
  const calendars = [...activityByYear]
    .sort(([a], [b]) => b - a)
    .map(([year, activityByDate]) => buildCalendar(year, activityByDate, today));

  return {
    login: GITHUB_LOGIN,
    calendars,
    ...computeStreaks(calendars, today),
  };
}
