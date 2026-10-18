// Progressive enhancement only. The timeline remains readable without JavaScript.
(() => {
  const timeline = document.querySelector('.journey-panel');
  if (!timeline) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      timeline.classList.add('journey-visible');
      observer.unobserve(timeline);
    }
  }, { threshold: 0.16 });
  timeline.classList.add('journey-enhanced');
  observer.observe(timeline);
})();
