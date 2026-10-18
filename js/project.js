// Initialize Lucide Icons
lucide.createIcons();

// GSAP Animations
window.onload = () => {
    // Hero Entrance
    gsap.to("#hero", {
        opacity: 1,
        y: -20,
        duration: 1,
        ease: "power3.out"
    });

    // Scroll Reveal Logic
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        observer.observe(el);
    });
};

/* =========================================
CURSOR INTERACTION
========================================= */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('follower');
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
document.querySelectorAll('.back-btn, .button-group').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ cursor.style.transform='scale(4)'; cursor.style.opacity='0.2'; });
    el.addEventListener('mouseleave', ()=>{ cursor.style.transform='scale(1)'; cursor.style.opacity='1'; });
});