import type { Metadata } from 'next';
import Link from 'next/link';
import { getContributionHistory, GITHUB_PROFILE_URL } from '@/lib/github';
import ContributionGraph, { formatNumber } from '@/app/components/ContributionGraph';
import ScrollReveal from '@/app/components/ScrollReveal';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Commit Log — David Chien',
  description: 'Every contribution I have made on GitHub, private repositories included.',
};

export const revalidate = 3600;

function pluralizeDays(count: number): string {
  return count === 1 ? 'day' : 'days';
}

export default async function GitHubPage() {
  const history = await getContributionHistory();
  const stats = [
    { label: 'Longest streak', value: formatNumber(history.longestStreak), unit: pluralizeDays(history.longestStreak) },
    { label: 'Current streak', value: formatNumber(history.currentStreak), unit: pluralizeDays(history.currentStreak) },
  ];

  return (
    <div className="min-h-[100dvh] bg-background px-6 pt-16 pb-12 md:px-12 md:pt-24 md:pb-16 lg:px-20 lg:pb-20">
      <ScrollReveal />

      <div className="mx-auto max-w-5xl">
        <nav className="animate-in delay-1 mb-16 text-sm md:mb-20">
          <Link href="/" className="text-muted hover:text-foreground transition-colors">
            ← Home
          </Link>
        </nav>

        <header className="mb-16 md:mb-20">
          <p className="animate-in delay-1 text-xs font-bold tracking-[0.3em] uppercase text-accent mb-8">
            David Chien · @{history.login}
          </p>

          <h1 className="animate-in delay-2 font-nabla text-[4.5rem] md:text-[8rem] lg:text-[10rem] tracking-tight leading-[0.82]">
            Commit<br />Log
          </h1>

          <div className="animate-in delay-3 mt-10 flex flex-col items-start gap-8 md:mt-14">
            <p className="max-w-xl text-lg md:text-xl font-light text-muted">
              Most of what I ship lives in private repositories. This is the whole picture, pulled
              straight from GitHub with my own token.
            </p>

            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contribution-github-link px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border-2 bg-accent border-accent text-white hover:opacity-85 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Visit my GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </header>

        {history.calendars.length === 0 ? (
          <p className="animate-in delay-4 text-muted">
            GitHub is not answering right now. The full history is one click away above.
          </p>
        ) : (
          <>
            <dl className="animate-in delay-4 mb-20 grid grid-cols-1 border-y border-border sm:grid-cols-2">
              {stats.map(stat => (
                <div
                  key={stat.label}
                  className="py-6 border-b border-border last:border-b-0 sm:border-b-0 sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-xs uppercase tracking-[0.25em] text-muted mb-3">
                    {stat.label}
                  </dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="contribution-graph-count text-3xl md:text-4xl font-semibold tracking-tight tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted">{stat.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-16 md:gap-20">
              {history.calendars.map((calendar, index) => (
                <ContributionGraph
                  key={calendar.year}
                  calendar={calendar}
                  className={index === 0 ? 'animate-in delay-5' : 'scroll-reveal'}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
}
