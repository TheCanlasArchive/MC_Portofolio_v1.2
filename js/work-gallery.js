/* Lightweight category filtering and six-at-a-time pagination.
   Works on both the featured section and projects archive. */
(() => {
  'use strict';
  const gallery = document.querySelector('.work-gallery');
  if (!gallery) return;
  const cards = Array.from(gallery.querySelectorAll('.work-card'));
  const filters = Array.from(document.querySelectorAll('[data-project-filter]'));
  const previous = document.querySelector('[data-page-direction="prev"]');
  const next = document.querySelector('[data-page-direction="next"]');
  const info = document.querySelector('[data-page-info]');
  const pageCount = document.querySelector('[data-page-count]');
  const archiveCount = document.getElementById('projectCount');
  const empty = document.getElementById('emptyState');
  const pageSize = 6;
  let category = 'all';
  let page = 0;

  const format = (n) => String(n).padStart(2, '0');

  function render() {
    const matched = cards.filter(card => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      return category === 'all' || tags.includes(category);
    });
    const pages = Math.max(1, Math.ceil(matched.length / pageSize));
    page = Math.max(0, Math.min(page, pages - 1));
    const start = page * pageSize;
    const shown = new Set(matched.slice(start, start + pageSize));
    cards.forEach(card => { card.hidden = !shown.has(card); });

    filters.forEach(button => {
      const active = button.dataset.projectFilter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (previous) previous.disabled = page === 0;
    if (next) next.disabled = page >= pages - 1;
    if (pageCount) pageCount.textContent = `${format(page + 1)} / ${format(pages)}`;
    if (info) info.textContent = matched.length
      ? `Showing ${start + 1}–${Math.min(start + pageSize, matched.length)} of ${matched.length} projects`
      : 'No projects in this category';
    if (archiveCount) archiveCount.textContent = String(matched.length);
    if (empty) empty.style.display = matched.length ? 'none' : 'flex';
  }

  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.projectFilter || 'all';
    page = 0;
    render();
  }));

  const changePage = (increment) => {
    page += increment;
    render();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gallery.scrollIntoView({block:'start',behavior:'auto'});
    } else {
      gallery.scrollIntoView({block:'start',behavior:'smooth'});
    }
  };
  if (previous) previous.addEventListener('click', () => { if (!previous.disabled) changePage(-1); });
  if (next) next.addEventListener('click', () => { if (!next.disabled) changePage(1); });
  render();
})();
