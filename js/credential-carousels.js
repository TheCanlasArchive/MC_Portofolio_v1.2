/* Independent, responsive recognition and certification carousels.
   Add another .pf-proof link inside either .pf-proof-grid; the controls update automatically. */
(() => {
  'use strict';
  const galleries = document.querySelectorAll('.pf-credential-gallery');
  const padded = (n) => String(n).padStart(2, '0');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  galleries.forEach((gallery) => {
    const viewport = gallery.querySelector('.pf-proof-window');
    const track = gallery.querySelector('.pf-proof-grid');
    const prev = gallery.querySelector('[data-credential-prev]');
    const next = gallery.querySelector('[data-credential-next]');
    const range = gallery.querySelector('[data-credential-page]');
    const total = gallery.querySelector('[data-credential-total]');
    if (!viewport || !track || !prev || !next || !range || !total) return;
    let items = [...track.querySelectorAll(':scope > .pf-proof')];
    let index = 0;
    let visible = 2;

    function update(instant = false) {
      items = [...track.querySelectorAll(':scope > .pf-proof')];
      const count = items.length;
      visible = Math.max(1, Math.floor(parseFloat(getComputedStyle(gallery).getPropertyValue('--credential-visible')) || 2));
      const maxIndex = Math.max(0, count - visible);
      index = Math.min(index, maxIndex);
      const x = items[index] ? items[index].offsetLeft - items[0].offsetLeft : 0;
      if (instant || reduceMotion.matches) track.style.transition = 'none';
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      if (instant && !reduceMotion.matches) {
        requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ''; }));
      } else if (reduceMotion.matches) {
        track.style.transition = 'none';
      }
      prev.disabled = index <= 0;
      next.disabled = index >= maxIndex;
      total.textContent = `${padded(count)} ${gallery.querySelector('#pf-awards-heading') ? 'AWARDS' : 'CREDENTIALS'}`;
      range.textContent = count ? `${padded(index + 1)}–${padded(Math.min(index + visible, count))} / ${padded(count)}` : '00 / 00';
      for (let i = 0; i < count; i++) {
        const inView = i >= index && i < index + visible;
        items[i].tabIndex = inView ? 0 : -1;
        if (inView) items[i].removeAttribute('aria-hidden');
        else items[i].setAttribute('aria-hidden', 'true');
      }
    }
    gallery.classList.add('pf-gallery-ready');
    prev.addEventListener('click', () => { index -= 1; update(); });
    next.addEventListener('click', () => { index += 1; update(); });
    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' && !prev.disabled) { event.preventDefault(); prev.click(); }
      if (event.key === 'ArrowRight' && !next.disabled) { event.preventDefault(); next.click(); }
    });
    // Optional touch gestures, with natural vertical page scrolling left intact.
    let touchStart = null;
    viewport.addEventListener('touchstart', (event) => {
      const t = event.touches[0];
      touchStart = t ? { x: t.clientX, y: t.clientY } : null;
    }, { passive: true });
    viewport.addEventListener('touchend', (event) => {
      if (!touchStart) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0 && !next.disabled) next.click();
        if (dx > 0 && !prev.disabled) prev.click();
      }
    }, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => update(true)) : null;
    if (observer) observer.observe(viewport);
    else window.addEventListener('resize', () => update(true));
    update(true);
  });
})();
