/* Hero project showcase — local case studies, no dependencies. */
(() => {
  'use strict';
  const root = document.getElementById('heroSpotlight');
  if (!root) return;

  // Screenshots and internal case study links are from this portfolio.
  const projects = [
    {title: 'Aning Kabalen', category: 'FULL-STACK WEB · 2026', summary: 'A digital marketplace connecting Pampanga farmers with local buyers.', image: 'img/aningkabalen_img/home.png', link: 'projects/project-aningkabalen.html', position: 'left center'},
    {title: 'Aurumelle Pastries', category: 'E-COMMERCE · 2025', summary: 'An online pastry shop with a carefully designed shopping experience.', image: 'img/aurumelle_img/header.png', link: 'projects/project-aurumelle.html', position: 'center top'},
    {title: 'Singku Inspired', category: 'FRONTEND · 2025', summary: 'A café website built around atmosphere, menu discovery, and brand identity.', image: 'img/singku_img/singku_inspired_website.png', link: 'projects/project-singku.html', position: 'center center'},
    {title: 'Bossrich Photography', category: 'WORDPRESS · 2025', summary: 'A photography portfolio with an approachable content and gallery structure.', image: 'img/bossrich_img/bossrich.png', link: 'projects/project-bossrich.html', position: 'center center'},
    {title: 'EarthHaven Organics', category: 'WEB APPLICATION · 2025', summary: 'A product catalog interface for discovering organic goods.', image: 'img/earthhaven_img/earthhaven_organics.png', link: 'projects/project-earthhaven.html', position: 'center center'},
    {title: 'PanlasaTrip', category: 'WORDPRESS · 2025', summary: 'A food and culture journal designed for easy browsing and storytelling.', image: 'img/panlasa_trip/panlasatrip_website.png', link: 'projects/project-panlasa.html', position: 'center top'},
    {title: 'PayaStreet', category: 'WEB PLATFORM · 2025', summary: 'A welcoming café experience with clear navigation and branded visuals.', image: 'img/payastreet_img/payastreet.png', link: 'projects/project-payastreet.html', position: 'center center'}
  ];
  const image = document.getElementById('heroSlideImage');
  const blur = document.getElementById('heroSlideBlur');
  const imageLink = document.getElementById('heroSlideVisual');
  const counter = document.getElementById('heroSlideCounter');
  const title = document.getElementById('heroSlideTitle');
  const category = document.getElementById('heroSlideCategory');
  const summary = document.getElementById('heroSlideSummary');
  const link = document.getElementById('heroSlideLink');
  const details = document.getElementById('heroSlideDetails');
  const steps = [...root.querySelectorAll('[data-hero-slide]')];
  const prev = document.getElementById('heroSlidePrev');
  const next = document.getElementById('heroSlideNext');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timer;
  let held = false;
  let request = 0;

  // Preload only the next slide to keep the homepage lightweight.
  const preloaded = new Set();
  function preload(index) {
    const url = projects[(index + projects.length) % projects.length].image;
    if (preloaded.has(url)) return;
    preloaded.add(url);
    const picture = new Image();
    picture.src = url;
  }
  preload(1);

  const format = n => String(n).padStart(2, '0');
  function render(index, userInitiated = false) {
    const newIndex = (index + projects.length) % projects.length;
    if (newIndex === active && !userInitiated) return;
    active = newIndex;
    const project = projects[active];
    const id = ++request;
    root.classList.add('is-changing');
    const swap = () => {
      if (id !== request) return;
      image.src = project.image;
      image.alt = `Screenshot of ${project.title} website`;
      image.style.objectPosition = project.position;
      blur.style.backgroundImage = `url("${project.image}")`;
      title.textContent = project.title;
      category.textContent = project.category;
      summary.textContent = project.summary;
      link.href = project.link;
      imageLink.href = project.link;
      imageLink.setAttribute('aria-label', `View ${project.title} case study`);
      preload(active + 1);
      link.setAttribute('aria-label', `View ${project.title} case study`);
      counter.textContent = `${format(active + 1)} / ${format(projects.length)}`;
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === active);
        if (i === active) step.setAttribute('aria-current', 'true');
        else step.removeAttribute('aria-current');
      });
      root.classList.remove('is-changing');
      if (userInitiated) {
        details.setAttribute('aria-live', 'polite');
        clearTimeout(details.liveTimer);
        details.liveTimer = setTimeout(() => details.setAttribute('aria-live', 'off'), 800);
      }
    };
    if (reducedMotion.matches) swap(); else setTimeout(swap, 190);
  }

  function start() {
    stop();
    if (held || reducedMotion.matches || document.hidden) return;
    timer = setInterval(() => render(active + 1), 6500);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function choose(index) { render(index, true); start(); }

  prev.addEventListener('click', () => choose(active - 1));
  next.addEventListener('click', () => choose(active + 1));
  steps.forEach((step, i) => step.addEventListener('click', () => choose(i)));
  root.addEventListener('mouseenter', () => { held = true; stop(); });
  root.addEventListener('mouseleave', () => { held = root.contains(document.activeElement); start(); });
  root.addEventListener('focusin', () => { held = true; stop(); });
  root.addEventListener('focusout', e => {
    if (!root.contains(e.relatedTarget)) { held = root.matches(':hover'); start(); }
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); choose(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); choose(active - 1); }
  });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  start();
})();
