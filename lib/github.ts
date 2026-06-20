import 'server-only';
import { unstable_cache } from 'next/cache';

const GITHUB_LOGIN = process.env.GITHUB_LOGIN ?? 'f312213213';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const GITHUB_API_VERSION = '2026-03-10';
let warnedCommitPermission = false;

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
  weekday: number;
  inYear: boolean;
};

export type ContributionWeek = {
  firstDay: string;
  days: ContributionDay[];
};

export type ContributionCalendar = {
  source: 'github' | 'commits' | 'unavailable';
  year: number;
  totalContributions: number;
  activeDays: number;
  from: string;
  to: string;
  weeks: ContributionWeek[];
};

type GitHubRepository = {
  full_name: string;
  fork: boolean;
  archived: boolean;
  disabled?: boolean;
  default_branch?: string | null;
};

type GitHubCommit = {
  sha: string;
  commit: {
    author?: {
      date?: string;
    } | null;
  };
};

type CalendarDayInput = {
  count: number;
  level?: ContributionLevel;
};

type GitHubContributionCalendarDay = {
  contributionCount: number;
  contributionLevel: string;
  date: string;
  weekday: number;
};

type GitHubContributionCalendarWeek = {
  firstDay: string;
  contributionDays: GitHubContributionCalendarDay[];
};

type GitHubContributionResponse = {
  data?: {
    viewer?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubContributionCalendarWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

type ParsedContributionCell = {
  date: string;
  level: ContributionLevel;
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

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function contributionRange() {
  const today = startOfUtcDay(new Date());
  const year = today.getUTCFullYear();
  const from = new Date(Date.UTC(year, 0, 1));
  const to = new Date(Date.UTC(year, 11, 31));
  const graphFrom = addUtcDays(from, -from.getUTCDay());
  const graphTo = addUtcDays(to, 6 - to.getUTCDay());

  return { year, today, from, to, graphFrom, graphTo };
}

function levelForCount(count: number): ContributionLevel {
  if (count >= 12) return 4;
  if (count >= 7) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function normalizeCalendar(
  source: ContributionCalendar['source'],
  activityByDate: Map<string, CalendarDayInput>,
  fetchedTotal?: number,
): ContributionCalendar {
  const { year, today, from, to, graphFrom, graphTo } = contributionRange();
  const days: ContributionDay[] = [];
  const totalGraphDays = Math.round((graphTo.getTime() - graphFrom.getTime()) / 86_400_000) + 1;

  for (let index = 0; index < totalGraphDays; index++) {
    const date = addUtcDays(graphFrom, index);
    const key = toDateInput(date);
    const inYear = date >= from && date <= to;
    const activity = activityByDate.get(key);
    const count = date <= today ? (activity?.count ?? 0) : 0;

    days.push({
      date: key,
      count,
      level: activity?.level ?? levelForCount(count),
      weekday: date.getUTCDay(),
      inYear,
    });
  }

  const weeks: ContributionWeek[] = [];
  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);
    weeks.push({
      firstDay: weekDays[0]?.date ?? toDateInput(addUtcDays(from, index)),
      days: weekDays,
    });
  }

  const yearDays = days.filter(day => day.inYear);
  const totalContributions = fetchedTotal ?? yearDays.reduce((sum, day) => sum + day.count, 0);
  const activeDays = yearDays.filter(day => day.count > 0).length;

  return {
    source,
    year,
    totalContributions,
    activeDays,
    from: toDateInput(from),
    to: toDateInput(to),
    weeks,
  };
}

function fallbackCalendar(): ContributionCalendar {
  return normalizeCalendar('unavailable', new Map());
}

function toContributionLevel(level: string | undefined): ContributionLevel {
  const value = Number(level);
  if (value >= 4) return 4;
  if (value >= 3) return 3;
  if (value >= 2) return 2;
  if (value >= 1) return 1;
  return 0;
}

function parsePublicContributionHtml(html: string): Map<string, CalendarDayInput> {
  const cellsById = new Map<string, ParsedContributionCell>();
  const activityByDate = new Map<string, CalendarDayInput>();

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

    const tooltip = match[2];
    const countMatch = tooltip.match(/^([\d,]+) contributions? on /);
    const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0;

    activityByDate.set(cell.date, {
      count,
      level: cell.level,
    });
  }

  return activityByDate;
}

async function fetchPublicContributionCalendar(): Promise<ContributionCalendar | null> {
  const { from, to } = contributionRange();
  const params = new URLSearchParams({
    from: toDateInput(from),
    to: toDateInput(to),
  });
  const response = await fetch(
    `https://github.com/users/${GITHUB_LOGIN}/contributions?${params}`,
    {
      headers: {
        'User-Agent': 'chiendavid.com',
      },
    },
  );

  if (!response.ok) {
    console.warn(`[github] public contribution endpoint failed: ${response.status}`);
    return null;
  }

  const activityByDate = parsePublicContributionHtml(await response.text());
  if (activityByDate.size === 0) return null;

  return normalizeCalendar('github', activityByDate);
}

async function fetchOfficialContributionCalendar(): Promise<ContributionCalendar | null> {
  if (!GITHUB_TOKEN) return null;

  const { from, to } = contributionRange();
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'chiendavid.com',
    },
    body: JSON.stringify({
      query: `
        query ContributionCalendar($from: DateTime!, $to: DateTime!) {
          viewer {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  firstDay
                  contributionDays {
                    contributionCount
                    contributionLevel
                    date
                    weekday
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        from: from.toISOString(),
        to: addUtcDays(to, 1).toISOString(),
      },
    }),
  });

  if (!response.ok) {
    console.warn(`[github] official contribution calendar request failed: ${response.status}`);
    return null;
  }

  const payload = await response.json() as GitHubContributionResponse;
  if (payload.errors?.length) {
    console.warn('[github] official contribution calendar errors:', payload.errors.map(error => error.message).join('; '));
    return null;
  }

  const calendar = payload.data?.viewer?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  const activityByDate = new Map<string, CalendarDayInput>();
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      activityByDate.set(day.date, {
        count: day.contributionCount,
        level: CONTRIBUTION_LEVELS[day.contributionLevel] ?? 0,
      });
    }
  }

  return normalizeCalendar('github', activityByDate, calendar.totalContributions);
}

function hasNextPage(linkHeader: string | null): boolean {
  return linkHeader?.split(',').some(link => link.includes('rel="next"')) ?? false;
}

async function mapWithConcurrency<T, U>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<U>,
): Promise<U[]> {
  const results: U[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(limit, items.length) },
      () => worker(),
    ),
  );

  return results;
}

async function githubRequest<T>(path: string): Promise<{ data: T; next: boolean }> {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set');
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
      'User-Agent': 'chiendavid.com',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}) for ${path}`);
  }

  return {
    data: await response.json() as T,
    next: hasNextPage(response.headers.get('link')),
  };
}

async function listAccessibleRepositories(): Promise<GitHubRepository[]> {
  const repositories: GitHubRepository[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      affiliation: 'owner,collaborator,organization_member',
      direction: 'desc',
      per_page: '100',
      page: String(page),
      sort: 'pushed',
      visibility: 'all',
    });
    const { data, next } = await githubRequest<GitHubRepository[]>(`/user/repos?${params}`);

    repositories.push(...data);
    hasMore = next;
    page += 1;
  }

  return repositories.filter(repo => (
    !repo.fork &&
    !repo.disabled &&
    Boolean(repo.default_branch)
  ));
}

async function listRepositoryCommits(
  repository: GitHubRepository,
  since: string,
  until: string,
): Promise<GitHubCommit[]> {
  const commits: GitHubCommit[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      author: GITHUB_LOGIN,
      per_page: '100',
      page: String(page),
      sha: repository.default_branch!,
      since,
      until,
    });

    try {
      const { data, next } = await githubRequest<GitHubCommit[]>(
        `/repos/${repository.full_name}/commits?${params}`,
      );

      commits.push(...data);
      hasMore = next;
      page += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('(403)')) {
        if (!warnedCommitPermission) {
          console.warn('[github] commit history access denied; set Contents repository permissions (read) on GITHUB_TOKEN');
          warnedCommitPermission = true;
        }
        return commits;
      }

      if (message.includes('(404)') || message.includes('(409)')) {
        return commits;
      }

      console.warn(`[github] ${repository.full_name}: could not list commits`, error);
      return commits;
    }
  }

  return commits;
}

async function fetchContributionCalendar(): Promise<ContributionCalendar> {
  const publicCalendar = await fetchPublicContributionCalendar();
  if (publicCalendar) return publicCalendar;

  if (!GITHUB_TOKEN) return fallbackCalendar();

  const officialCalendar = await fetchOfficialContributionCalendar();
  if (officialCalendar) return officialCalendar;

  const { from, to } = contributionRange();
  const until = addUtcDays(to, 1).toISOString();
  const countByDate = new Map<string, CalendarDayInput>();

  try {
    const repositories = await listAccessibleRepositories();
    const commitGroups = await mapWithConcurrency(
      repositories,
      4,
      repository => listRepositoryCommits(
        repository,
        from.toISOString(),
        until,
      ),
    );

    for (const commit of commitGroups.flat()) {
      const committedDate = commit.commit.author?.date;
      if (!committedDate) continue;

      const key = committedDate.slice(0, 10);
      const existing = countByDate.get(key)?.count ?? 0;
      countByDate.set(key, { count: existing + 1 });
    }

    return normalizeCalendar('commits', countByDate);
  } catch (error) {
    console.warn('[github] could not build private commit calendar', error);
    return fallbackCalendar();
  }
}

export const getContributionCalendar =
  process.env.NODE_ENV === 'development'
    ? fetchContributionCalendar
    : unstable_cache(fetchContributionCalendar, ['github-contribution-calendar'], {
      revalidate: 3600,
      tags: ['github-contribution-calendar'],
    });
