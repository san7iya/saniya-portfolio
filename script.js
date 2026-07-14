/* ========================================
   PORTFOLIO — Interactions & Pixel Craft
   Saniya Goyal · Software Engineer
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Initialize Lucide icons ----------
    if (window.lucide) {
        lucide.createIcons();
    }

    // ---------- Pixel Cursor Generation ----------
    function generatePixelCursors() {
        // Default cursor — pixel arrow
        const defaultCanvas = document.createElement('canvas');
        defaultCanvas.width = 16;
        defaultCanvas.height = 16;
        const dCtx = defaultCanvas.getContext('2d');

        const arrowPixels = [
            [0,0],
            [0,1],[1,1],
            [0,2],[1,2],[2,2],
            [0,3],[1,3],[2,3],[3,3],
            [0,4],[1,4],[2,4],[3,4],[4,4],
            [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],
            [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
            [0,7],[1,7],[2,7],[3,7],
            [0,8],[1,8],[3,8],[4,8],
            [0,9],[4,9],[5,9],
            [5,10],[6,10],
            [6,11]
        ];

        // Green outline pixels on the right edge
        const outlinePixels = [
            [1,0],
            [2,1],
            [3,2],
            [4,3],
            [5,4],
            [6,5],
            [7,6],
            [4,7],[5,7],
            [2,8],[5,8],
            [1,9],[2,9],[3,9],[6,9],
            [4,10],[7,10],
            [5,11],[7,11]
        ];

        // Draw main arrow
        dCtx.fillStyle = '#1a1a2e';
        arrowPixels.forEach(([x, y]) => {
            dCtx.fillRect(x, y, 1, 1);
        });

        // Draw green outline
        dCtx.fillStyle = '#3d6b4f';
        outlinePixels.forEach(([x, y]) => {
            dCtx.fillRect(x, y, 1, 1);
        });

        const defaultUrl = defaultCanvas.toDataURL('image/png');

        // Pointer cursor — pixel hand
        const pointerCanvas = document.createElement('canvas');
        pointerCanvas.width = 16;
        pointerCanvas.height = 16;
        const pCtx = pointerCanvas.getContext('2d');

        const handPixels = [
            [5,0],
            [4,1],[6,1],
            [4,2],[6,2],
            [4,3],[6,3],[7,3],
            [3,4],[4,4],[6,4],[7,4],
            [3,5],[5,5],[6,5],[7,5],[8,5],
            [2,6],[3,6],[5,6],[6,6],[7,6],[8,6],
            [2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
            [2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],
            [3,9],[4,9],[5,9],[6,9],[7,9],[8,9],
            [3,10],[4,10],[5,10],[6,10],[7,10],
            [3,11],[4,11],[5,11],[6,11],[7,11],
            [4,12],[5,12],[6,12],[7,12]
        ];

        pCtx.fillStyle = '#1a1a2e';
        handPixels.forEach(([x, y]) => {
            pCtx.fillRect(x, y, 1, 1);
        });

        const pointerUrl = pointerCanvas.toDataURL('image/png');

        // Apply cursors via CSS custom properties
        document.documentElement.style.setProperty(
            '--cursor-default',
            `url('${defaultUrl}') 0 0, auto`
        );
        document.documentElement.style.setProperty(
            '--cursor-pointer',
            `url('${pointerUrl}') 6 0, pointer`
        );
        document.body.classList.add('cursors-ready');
    }

    try {
        generatePixelCursors();
    } catch (e) {
        // Cursors are a progressive enhancement — fail silently
    }


    // ---------- Nav scroll state ----------
    const nav = document.getElementById('nav');

    const handleNavScroll = () => {
        if (window.scrollY > 30) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // ---------- Mobile menu ----------
    const menuBtn = document.getElementById('menuBtn');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    const openMenu = () => {
        mobileMenu.classList.add('mobile-menu--open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
            closeMenu();
        }
    });


    // ---------- Scroll Reveal (IntersectionObserver) ----------
    const revealElements = document.querySelectorAll('.reveal-up');

    let staggerQueue = [];
    let staggerTimeout = null;

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    staggerQueue.push(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });

            if (staggerQueue.length > 0) {
                clearTimeout(staggerTimeout);
                staggerTimeout = setTimeout(() => {
                    staggerQueue.forEach((el, i) => {
                        el.style.setProperty('--delay', `${i * 120}ms`);
                        requestAnimationFrame(() => {
                            el.classList.add('is-visible');
                        });
                    });
                    staggerQueue = [];
                }, 16);
            }
        },
        {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        }
    );

    revealElements.forEach(el => revealObserver.observe(el));


    // ---------- Hero immediate reveal ----------
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero .reveal-up').forEach(el => {
            el.classList.add('is-visible');
        });
    });


    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ---------- Expandable project details ----------
    document.querySelectorAll('.project-card__expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const expandable = btn.nextElementSibling;

            btn.setAttribute('aria-expanded', !isExpanded);
            expandable.classList.toggle('is-open');
        });
    });


    // ---------- Active nav link highlight ----------
    const sections = document.querySelectorAll('.section, .footer');
    const navLinks = document.querySelectorAll('.nav__link');

    const highlightNav = () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('nav__link--active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });


    // ---------- Subtle card hover tracking ----------
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ---------- Subtle Magnetic Buttons ----------
    const magneticBtns = document.querySelectorAll('.social-btn, .hero__resume-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });


    // ---------- Copy Email to Clipboard ----------
    const emailBtns = document.querySelectorAll('.copy-email-btn');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Email copied to clipboard!';
    document.body.appendChild(toast);
    let toastTimeout;

    emailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('saniya7goyal@gmail.com').then(() => {
                toast.classList.add('is-visible');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('is-visible');
                }, 2000);
            });
        });
    });


    // ---------- Console Easter Egg ----------
    console.log(
        '%c☘ Hey! Curious about the code? Check the source on GitHub.',
        'font-size: 13px; color: #3d6b4f; font-family: "JetBrains Mono", monospace;'
    );
});
