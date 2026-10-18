// Keep the academic recognition summary in sync when new awards are added.
(() => {
  const countLabel = document.querySelector('[data-edu-awards-count]');
  const awardLink = document.querySelector('[data-edu-awards-link]');
  if (!countLabel || !awardLink) return;
  const count = document.querySelectorAll('.pf-award-grid .pf-proof').length;
  if (!count) return;
  countLabel.textContent = String(count).padStart(2, '0');
  awardLink.setAttribute('aria-label', `View my ${count} Dean's List awards below`);
})();
