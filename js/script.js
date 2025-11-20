const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroButtons = document.querySelectorAll('.hero-buttons a');
const sections = document.querySelectorAll('section');
const statsCounters = document.querySelectorAll('[data-target]');
const tabButtons = document.querySelectorAll('.tab-btn');
const skillTabs = document.querySelectorAll('.skills-tab');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const backToTop = document.getElementById('backToTop');
const contactForm = document.querySelector('.contact-form');
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const loadingScreen = document.querySelector('.loading-screen');
const heroContainer = document.querySelector('.hero-container');

const SCROLL_OFFSET = 90;

const smoothScroll = (targetId) => {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
};

const closeMobileMenu = () => {
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
};

navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href?.startsWith('#')) return;
        event.preventDefault();
        smoothScroll(href.replace('#', ''));
        closeMobileMenu();
    });
});

heroButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const href = button.getAttribute('href');
        if (!href?.startsWith('#')) return;
        event.preventDefault();
        smoothScroll(href.replace('#', ''));
    });
});

const setActiveNavLink = () => {
    let current = '';
    sections.forEach(section => {
        const offset = section.offsetTop - 150;
        if (window.scrollY >= offset) {
            current = section.id;
        }
    });
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', linkTarget === current);
    });
};

const handleScroll = () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }
    if (heroContainer) {
        const scrolled = window.scrollY;
        heroContainer.style.transform = `translateY(${scrolled * 0.04}px)`;
        heroContainer.style.opacity = `${Math.max(0.25, 1 - scrolled / 900)}`;
    }
    setActiveNavLink();
};

window.addEventListener('scroll', handleScroll);
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Counter animations
const animateCounter = (element) => {
    const target = parseInt(element.dataset.target || '0', 10);
    const duration = 1600;
    const startTime = performance.now();

    const updateCounter = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        element.textContent = Math.floor(progress * target).toString();
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = `${target}+`;
        }
    };

    requestAnimationFrame(updateCounter);
};

if (statsCounters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statsCounters.forEach(counter => counterObserver.observe(counter));
}

// Reveal animations
const revealTargets = document.querySelectorAll(`
    .about-text, .about-visual, .skill-card, .project-card,
    .service-card, .timeline-item, .contact-info-section,
    .contact-form-section, .testimonial-card, .hero-content, .hero-image-wrapper
`);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(target => {
    target.classList.add('will-reveal');
    revealObserver.observe(target);
});

// Skills tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        skillTabs.forEach(tab => {
            tab.classList.toggle('active', tab.id === targetTab);
        });
    });
});

// Project filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        projectCards.forEach(card => {
            const isMatch = category === 'all' || card.dataset.category === category;
            card.classList.toggle('hidden', !isMatch);
            card.style.display = isMatch ? 'flex' : 'none';
        });
    });
});

// Contact form
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showNotification = (message, type = 'info') => {
    const existing = document.querySelector('.notification');
    existing?.remove();
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4800);
};

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('Message sent! I will get back to you shortly.', 'success');
    }, 1800);
});

// Custom cursor
const initCursor = () => {
    if (!cursorDot || !cursorOutline) return;
    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const outline = { ...position };

    const moveCursor = (event) => {
        position.x = event.clientX;
        position.y = event.clientY;
        cursorDot.style.top = `${position.y}px`;
        cursorDot.style.left = `${position.x}px`;
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    };

    const animateOutline = () => {
        outline.x += (position.x - outline.x) * 0.15;
        outline.y += (position.y - outline.y) * 0.15;
        cursorOutline.style.top = `${outline.y}px`;
        cursorOutline.style.left = `${outline.x}px`;
        requestAnimationFrame(animateOutline);
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', moveCursor);

    animateOutline();
};

initCursor();

// Project tilt interaction
const initTiltEffect = () => {
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 15;
            const rotateY = (rect.width / 2 - x) / 15;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
};

initTiltEffect();

// Particles background
const initParticles = () => {
    if (typeof particlesJS === 'undefined') return;
    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 900 } },
            color: { value: ['#4f46e5', '#06b6d4', '#ffffff'] },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.25, width: 1 },
            move: { enable: true, speed: 1.2, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                repulse: { distance: 120, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
};

// Loading screen + init
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            setTimeout(() => loadingScreen.remove(), 600);
        }
        handleScroll();
    }, 300);
    initParticles();
});

// Console easter egg
console.log('%c Crafted by Daksh Verma', 'background: linear-gradient(45deg, #4f46e5, #06b6d4); color: #fff; padding: 6px 12px; border-radius: 6px;');