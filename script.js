/* ============================================================
   Maksym Gorzelski — Portfolio interactions
   ============================================================ */

document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  const animated = Array.from(
    document.querySelectorAll('.reveal, .reveal-scale, .load-rise')
  );

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    animated.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Hero load-in. Uses setTimeout (not requestAnimationFrame) so it still
  // fires when the page loads in a background/inactive tab — rAF is paused
  // while a tab is hidden, which would otherwise leave the hero invisible.
  document.querySelectorAll('.load-rise').forEach((el, i) => {
    setTimeout(() => el.classList.add('is-visible'), 120 + i * 130);
  });

  // Scroll reveals — trigger as soon as any part enters, so fast
  // scrolling can never leave content stuck invisible.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.01 }
  );

  const scrollReveal = animated.filter(
    (el) => !el.classList.contains('load-rise')
  );
  scrollReveal.forEach((el) => observer.observe(el));

  // Failsafe: reveal anything already on-screen at load. Runs on the next
  // frame (instant when the tab is visible), again via setTimeout (which
  // fires even in a background tab, where rAF is paused), and once more
  // whenever the tab becomes visible — so above-the-fold content such as the
  // case-study title can never get stuck at opacity 0.
  const revealInView = () => {
    scrollReveal.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  };

  requestAnimationFrame(revealInView);
  setTimeout(revealInView, 300);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') revealInView();
  });
});
