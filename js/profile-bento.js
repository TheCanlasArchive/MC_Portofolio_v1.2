// The page remains fully readable when JavaScript is disabled.
(() => {
  const cards = [...document.querySelectorAll('.pf-card:not(.journey-panel)')];
  if (!cards.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('pf-entered');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });
  for (const card of cards) observer.observe(card);
})();
