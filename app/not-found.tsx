import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-background flex items-center justify-center">
      <main className="max-w-3xl mx-auto text-center">

        {/* 404 display — Nabla font, staggered entrance */}
        <div className="animate-in delay-1 mb-6 flex justify-center" aria-hidden="true">
          {'404'.split('').map((digit, i) => (
            <span
              key={i}
              className="error-digit font-nabla text-[clamp(8rem,25vw,14rem)] leading-none tracking-tight dark:text-accent/30 text-accent select-none inline-block animate-[error-drift_3s_cubic-bezier(0.45,0,0.55,1)_infinite]"
              style={{ animationDelay: `${i * -0.6}s` }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="animate-in delay-2 text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
          This page wandered off
        </h1>

        {/* Body text */}
        <p className="animate-in delay-3 text-base md:text-lg text-muted font-light max-w-md mx-auto mb-10">
          Might be on a beach in Bali, might have never existed. Either way, nothing to see here.
        </p>

        {/* Back to home — primary button style */}
        <div className="animate-in delay-4">
          <Link
            href="/"
            className="inline-block px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border-2 bg-accent border-accent text-white hover:opacity-85 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 outline-none"
          >
            Back to Home
          </Link>
        </div>

      </main>
    </div>
  );
}
