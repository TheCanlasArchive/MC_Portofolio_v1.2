/* =========================================
   GLOBAL SETTINGS
========================================= */
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    // If the URL has a hash, scroll to that section instead of the top
    if (window.location.hash) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return;
        }
    }
    window.scrollTo(0, 0);
});

// Initialize Lucide icons
if (window.lucide) {
    lucide.createIcons();
}


/* =========================================
   DOM READY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    pageFadeIn();
    navbarSwitch();
    mobileMenu();
    modalControl();
    typingEffect();
    scrollParallax();
    setupForms();

});


/* =========================================
   UI EFFECTS
========================================= */

function pageFadeIn() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1s ease-in";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
}

function navbarSwitch() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

function mobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const overlay = document.getElementById("mobile-overlay");

    if (!hamburger || !navLinks || !overlay) return;

    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        overlay.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", String(navLinks.classList.contains("active")));
    };

    hamburger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
}

function modalControl() {
    const overlay = document.getElementById("modal");
    const openButton = document.getElementById("openModal");
    const closeButton = document.getElementById("closeModal");
    const dialog = overlay?.querySelector('[role="dialog"]');
    if (!overlay || !openButton || !closeButton || !dialog) return;

    let previousFocus = null;

    const close = () => {
        if (!overlay.classList.contains("active")) return;
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        overlay.setAttribute("inert", "");
        document.body.classList.remove("modal-is-open");
        if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    };

    openButton.setAttribute("aria-haspopup", "dialog");
    openButton.setAttribute("aria-controls", "modal");
    openButton.addEventListener("click", () => {
        previousFocus = document.activeElement;
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        overlay.removeAttribute("inert");
        document.body.classList.add("modal-is-open");
        overlay.querySelector('input:not([type="hidden"]):not([name="_gotcha"])')?.focus();
    });
    closeButton.addEventListener("click", close);
    overlay.addEventListener("mousedown", e => {
        if (e.target === overlay) close();
    });

    document.addEventListener("keydown", e => {
        if (!overlay.classList.contains("active")) return;
        if (e.key === "Escape") {
            e.preventDefault();
            close();
            return;
        }
        if (e.key !== "Tab") return;
        const candidates = Array.from(dialog.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), a[href]'));
        const focusable = candidates.filter(el => !el.closest('.spam-trap') && !el.hidden && el.getClientRects().length);
        if (!focusable.length) { e.preventDefault(); dialog.focus(); return; }
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
}


/* =========================================
   Smooth Animation Through Section
========================================= */
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only intercept pure hash links that point to an element on THIS page
        // e.g. "#portfolio" — not "index.html#portfolio", not "#" alone
        if (!href || !href.startsWith('#') || href === '#') return;

        const targetID = href.slice(1);
        const targetSection = document.getElementById(targetID);

        // If the element doesn't exist on this page, let the browser navigate normally
        if (!targetSection) return;

        e.preventDefault();

        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const mobileOverlay = document.getElementById('mobile-overlay');
        const hamburger = document.getElementById('hamburger');
        if (mobileOverlay && mobileOverlay.classList.contains('active')) {
            mobileOverlay.classList.remove('active');
            if (hamburger) { hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); }
            const links = document.getElementById('nav-links');
            if (links) links.classList.remove('active');
        }
    });
});


/* =========================================
   Footer Scroll Up Animation
========================================= */
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const scrollDuration = 600; 
        const start = window.scrollY;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / scrollDuration, 1);

            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        }

        requestAnimationFrame(scrollStep);
    });
}


/* =========================================
   FORMS — Formspree + clear delivery feedback
   Forms use their own existing Formspree endpoints.
   Formspree acceptance ≠ confirmation of inbox delivery.
========================================= */
function setupForms() {
    setupDeliveryForm('contactFormMain', 'formStatus', 'contactEmailFallback');
    setupDeliveryForm('projectInquiryForm', 'modalStatus', 'modalEmailFallback');
}

function setupDeliveryForm(formId, statusId, fallbackId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    const fallback = document.getElementById(fallbackId);
    if (!form || !status || !fallback) return;

    const button = form.querySelector('button[type="submit"]');
    const defaultHTML = button?.innerHTML || 'Send';
    let submitting = false;

    function setStatus(message, type) {
        status.textContent = message;
        status.dataset.state = type;
    }

    // A mailto link is a user-initiated backup, not a claim of delivery.
    function updateEmailFallback() {
        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());
        const details = [
            `Name: ${values.name || ''}`,
            `Email: ${values.email || ''}`,
            values.company ? `Company: ${values.company}` : null,
            values.service ? `Interested in: ${values.service}` : null,
            '',
            values.message || ''
        ].filter(x => x !== null).join('\n');
        fallback.href = `mailto:m4canlas@gmail.com?subject=${encodeURIComponent('Portfolio inquiry')}&body=${encodeURIComponent(details)}`;
        fallback.hidden = false;
    }

    form.addEventListener('input', () => {
        if (status.dataset.state === 'error') {
            status.dataset.state = 'idle';
            status.textContent = '';
            fallback.hidden = true;
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (submitting || !form.reportValidity()) return;
        if (!form.action.startsWith('https://formspree.io/f/')) {
            setStatus('The contact form needs a valid Formspree endpoint. Please email me directly.', 'error');
            updateEmailFallback();
            return;
        }
        const trap = form.elements.namedItem('_gotcha');
        if (trap && trap.value.trim() !== '') return; // spam honeypot

        submitting = true;
        if (button) {
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.textContent = 'Sending…';
        }
        fallback.hidden = true;
        setStatus('Sending your request securely…', 'loading');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });
            let result = {};
            try { result = await response.json(); } catch (_) { /* some responses have no JSON */ }
            if (!response.ok) {
                const errors = Array.isArray(result.errors) ? result.errors.map(item => item.message).filter(Boolean) : [];
                const explanation = errors.length ? errors.join(' ') : (response.status === 429 ? 'Too many attempts. Please wait a little.' : 'The message was not accepted.');
                throw new Error(explanation);
            }
            form.reset();
            setStatus('Request received! Thank you for reaching out. I’ll get back to you as soon as I can.', 'success');
        } catch (error) {
            const reason = error.name === 'AbortError'
                ? 'The request timed out.'
                : (error instanceof TypeError ? 'Unable to connect to the form service.' : error.message);
            setStatus(`${reason} Your message was not confirmed sent. Please try again or use email instead.`, 'error');
            updateEmailFallback();
        } finally {
            clearTimeout(timeout);
            submitting = false;
            if (button) {
                button.disabled = false;
                button.removeAttribute('aria-busy');
                button.innerHTML = defaultHTML;
            }
        }
    });
}

/* =========================================
   COPY EMAIL
========================================= */

function copyEmail() {
    const email = "m4canlas@gmail.com";

    navigator.clipboard.writeText(email).then(() => {
        alert("Email copied to clipboard!");
    }).catch(() => {
        alert("Failed to copy email.");
    });
}


/* =========================================
   HERO EFFECTS
========================================= */

function scrollParallax() {
    const hero = document.querySelector("#home");
    if (!hero) return;

    window.addEventListener("scroll", () => {
        const progress = Math.min(1, window.scrollY / hero.offsetHeight);

        document.documentElement.style.setProperty(
            "--orange-strong",
            0.40 * (1 - progress)
        );

        document.documentElement.style.setProperty(
            "--orange-soft",
            0.30 * (1 - progress)
        );
    });
}

function typingEffect() {
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    const words = [
        "Junior Frontend Developer",
        "UI/UX Designer",
        "Creative Web Designer",
        "Interface Developer"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            typingElement.textContent = currentWord.slice(0, ++charIndex);
            if (charIndex === currentWord.length) {
                setTimeout(() => (isDeleting = true), 1500);
            }
        } else {
            typingElement.textContent = currentWord.slice(0, --charIndex);
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(type, isDeleting ? 50 : 80);
    }

    type();
}


/* =========================================
   GLOBAL FUNCTIONS
========================================= */

function toggleBento(element) {
    element.classList.toggle("active");
}


/* =========================================
   CURSOR INTERACTION
========================================= */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('follower');

if (cursor && follower) {
    window.addEventListener('mousemove', e => {
        const {clientX:x, clientY:y} = e;
        cursor.style.left = x+'px';
        cursor.style.top = y+'px';
        follower.style.transform = `translate(${x-20}px, ${y-20}px)`;
        const xPct = (x/window.innerWidth)*100;
        const yPct = (y/window.innerHeight)*100;
        document.documentElement.style.setProperty('--mouse-x', xPct+'%');
        document.documentElement.style.setProperty('--mouse-y', yPct+'%');
    });

    // HOVER SCALE
    document.querySelectorAll('.btn, .back-btn, .btn-cv, .btn-projects, .stat-arrow, .nav-item, #openModal, .btn-modern, .editorial-btn, .manifest-anchor, .m-ctrl-btn, .p-titles, .nav-btn, .footer-socials, .footer-nav').forEach(el=>{
        el.addEventListener('mouseenter', ()=>{ cursor.style.transform='scale(4)'; cursor.style.opacity='0.2'; });
        el.addEventListener('mouseleave', ()=>{ cursor.style.transform='scale(1)'; cursor.style.opacity='1'; });
    });
}