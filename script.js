// ===============================================
// SMOOTH SCROLLING & NAVIGATION
// ===============================================

document.addEventListener('DOMContentLoaded', function () {
    // ===============================================
    // THEME TOGGLE
    // ===============================================

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to 'default'
    const currentTheme = localStorage.getItem('theme') || 'default';
    if (currentTheme === 'dubai') {
        body.classList.add('dubai-theme');
        themeToggle.textContent = '🌆'; // City icon for when Dubai theme is active
    } else {
        themeToggle.textContent = '🏜️'; // Desert icon for when default theme is active
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dubai-theme');

        // Update icon and save preference
        if (body.classList.contains('dubai-theme')) {
            themeToggle.textContent = '🌆'; // City icon
            localStorage.setItem('theme', 'dubai');
        } else {
            themeToggle.textContent = '🏜️'; // Desert icon
            localStorage.setItem('theme', 'default');
        }
    });


    // Mobile menu toggle
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only handle smooth scrolling for same-page hash links
            if (targetId.startsWith('#')) {
                e.preventDefault();

                // Close mobile menu if open
                navbarMenu.classList.remove('active');

                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For links to other pages (like index.html#section), let them navigate normally
        });
    });

    // ===============================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ===============================================

    function updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===============================================
    // SCROLL ANIMATIONS
    // ===============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));

    // ===============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ===============================================

    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = ''; // Ensure no inline style overrides CSS
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = ''; // Ensure no inline style overrides CSS
        }
    });

    // ===============================================
    // TYPING ANIMATION
    // ===============================================

    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const roles = ["Robotics Researcher", "Computer Vision Engineer", "Deep Learning Enthusiast"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing animation
        setTimeout(type, 1000);
    }

    // ===============================================
    // 3D TILT EFFECT
    // ===============================================

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Add perspective to parent for 3D effect
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';

        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            // Max rotation: 3 degrees (reduced for subtlety)
            const xRotation = -((y - rect.height / 2) / rect.height * 3);
            const yRotation = (x - rect.width / 2) / rect.width * 3;

            // Apply transform
            this.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

            // Move content slightly for depth effect if needed
            // const content = this.querySelector('.card-body');
            // if (content) content.style.transform = 'translateZ(20px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
            this.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.1s ease';
        });
    });

    // ===============================================
    // PERFORMANCE OPTIMIZATION
    // ===============================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handler
    const debouncedUpdateNav = debounce(updateActiveNav, 50);
    window.addEventListener('scroll', debouncedUpdateNav);

    // ===============================================
    // CLOSE MOBILE MENU ON OUTSIDE CLICK
    // ===============================================

    document.addEventListener('click', function (event) {
        const isClickInsideNav = navbarMenu.contains(event.target) || navbarToggle.contains(event.target);

        if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
        }
    });

    // ===============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===============================================

    // Keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            navbarToggle.focus();
        }
    });

    // ===============================================
    // LOADING ANIMATION
    // ===============================================

    window.addEventListener('load', function () {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

});

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
