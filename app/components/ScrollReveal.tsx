'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    // If page loaded scrolled, CSS handles it via .no-intro — nothing to observe
    if (document.documentElement.classList.contains('no-intro')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.documentElement.classList.add('scroll-reveal-ready');

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
