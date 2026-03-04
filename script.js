document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // PAGE LOADER
    // ========================================
    const loader = document.getElementById('page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1200);
    });
    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    const faders = document.querySelectorAll('.fade-in');
    const sliders = document.querySelectorAll('.slide-up');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));
    sliders.forEach(slider => appearOnScroll.observe(slider));

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar compact on scroll
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 2rem';
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        } else {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.03)';
            navbar.style.padding = '1.5rem 2rem';
            navbar.style.background = 'rgba(255, 255, 255, 0.75)';
        }

        // Back to top visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // HAMBURGER MENU
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // STRENGTH BUBBLES SEQUENTIAL ANIMATION
    // ========================================
    const bubbles = document.querySelectorAll('.strength-bubble');
    bubbles.forEach((bubble, index) => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.8)';
        bubble.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        bubble.style.transitionDelay = `${index * 0.15}s`;
    });

    const strengthsSection = document.querySelector('#strengths');
    if (strengthsSection) {
        const strengthObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bubbles.forEach(bubble => {
                        bubble.style.opacity = '1';
                        bubble.style.transform = 'scale(1)';
                    });
                    strengthObserver.unobserve(entry.target);
                }
            });
        }, appearOptions);
        strengthObserver.observe(strengthsSection);
    }

    // ========================================
    // CURSOR SPARKLE TRAIL (Canvas)
    // ========================================
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    let sparkles = [];
    const sparkleColors = ['#ff8da1', '#9b8cff', '#ffb6c1', '#b0e0e6', '#e6e6fa'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Throttle mousemove for performance
    let lastSparkleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkleTime < 50) return; // Max 20 sparkles/sec
        lastSparkleTime = now;

        for (let i = 0; i < 2; i++) {
            sparkles.push({
                x: e.clientX + (Math.random() - 0.5) * 20,
                y: e.clientY + (Math.random() - 0.5) * 20,
                size: Math.random() * 4 + 2,
                color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
                alpha: 1,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 1,
                life: 0
            });
        }
    });

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparkles = sparkles.filter(s => s.alpha > 0.01);

        sparkles.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= 0.025;
            s.size *= 0.98;
            s.life++;

            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = s.color;
            ctx.beginPath();

            // Draw a small star shape
            const spikes = 4;
            const outerRadius = s.size;
            const innerRadius = s.size * 0.4;
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const x = s.x + Math.cos(angle) * radius;
                const y = s.y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    // ========================================
    // SMOOTH ANCHOR LINK BEHAVIOR
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
