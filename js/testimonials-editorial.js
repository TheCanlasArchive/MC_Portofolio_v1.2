/* Accessible, responsive testimonial pagination: 3 desktop / 2 tablet / 1 mobile. */
(function () {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.endorsement-card'));
  const previous = document.getElementById('testimonials-prev');
  const next = document.getElementById('testimonials-next');
  const indicator = document.getElementById('testimonials-page');
  let page = 0;
  let pageSize = 0;

  function cardsPerPage() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function update() {
    const pages = Math.max(1, Math.ceil(cards.length / pageSize));
    page = Math.max(0, Math.min(page, pages - 1));
    cards.forEach((card, i) => { card.hidden = Math.floor(i / pageSize) !== page; });
    indicator.textContent = `${String(page + 1).padStart(2,'0')} / ${String(pages).padStart(2,'0')}`;
    indicator.setAttribute('aria-label', `Page ${page + 1} of ${pages}`);
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;
  }

  function adapt() {
    const newSize = cardsPerPage();
    if (newSize !== pageSize) {
      const firstVisibleIndex = page * (pageSize || newSize);
      pageSize = newSize;
      page = Math.floor(firstVisibleIndex / pageSize);
      update();
    }
  }

  previous.addEventListener('click', () => { page--; update(); });
  next.addEventListener('click', () => { page++; update(); });
  window.addEventListener('resize', adapt, { passive: true });
  adapt();
})();
