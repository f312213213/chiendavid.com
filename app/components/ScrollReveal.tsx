'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
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

    function setup() {
      const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');

      // Mark elements already in viewport as revealed before enabling animations
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });

      // Enable animation class after pre-revealing visible elements
      document.documentElement.classList.add('scroll-reveal-ready');

      // Observe remaining elements
      elements.forEach((el) => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el);
        }
      });
    }

    // Run after next frame to ensure all client components have rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(setup);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
