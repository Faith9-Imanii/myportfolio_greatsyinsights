// Simple fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    // Add hidden class to all cards
    document.querySelectorAll('.project-card, .service-card').forEach(card => {
        card.classList.add('hidden');
    });
    
    // Show elements when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Add dark mode toggle
const themeToggle = document.createElement('button');
themeToggle.innerHTML = '🌙';
themeToggle.style.position = 'fixed';
themeToggle.style.bottom = '20px';
themeToggle.style.right = '20px';
themeToggle.style.zIndex = '1000';
themeToggle.addEventListener('click', toggleTheme);
document.body.appendChild(themeToggle);

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// static/js/animations.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initSmoothScrolling();
    initPageTransitions();
    initScrollAnimations();
    initInteractiveElements();
    initTypewriterEffect();
    initLoadingAnimations();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Smooth scroll for internal navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('/') || href.startsWith('{{')) {
                return; // Allow normal navigation for non-anchor links
            }
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Handle page load
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
        
        // Animate in main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        }
    });

    // Add loading state for page navigation
    document.querySelectorAll('a').forEach(link => {
        if (link.href && link.href.includes(window.location.origin) && !link.href.includes('#')) {
            link.addEventListener('click', function(e) {
                // Only apply to internal links that aren't anchors
                if (!this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const href = this.href;
                    
                    // Add exit animation
                    document.body.classList.add('page-exit');
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger children animations
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('project-grid') ||
                    entry.target.classList.contains('skills-grid')) {
                    animateStaggerChildren(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .skill-category, .stat, .faq-item, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });

    // Navbar background on scroll
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        // Add background when scrolled
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });
}

function animateStaggerChildren(parentElement) {
    const children = parentElement.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate-in');
        }, index * 100);
    });
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Hover effects for cards
    initCardInteractions();
    
    // Button hover effects
    initButtonInteractions();
    
    // Form interactions
    initFormInteractions();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Back to top button
    initBackToTop();
}

function initCardInteractions() {
    document.querySelectorAll('.service-card, .project-card, .skill-category').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(219, 39, 119, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
            this.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.12)';
        });
    });
}

function initButtonInteractions() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .project-link').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
    });
}

function initFormInteractions() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add floating label effect
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger icon
            this.style.transform = this.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.style.transform = 'rotate(0)';
            });
        });
    }
}

function initBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriterEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--primary)';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    heroSubtitle.style.borderRightColor = heroSubtitle.style.borderRightColor === 'transparent' ? 'var(--primary)' : 'transparent';
                }, 500);
            }
        }
        
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
    }
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Pulse animation for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        setInterval(() => {
            button.classList.toggle('pulse');
        }, 2000);
    });
    
    // Floating animation for service icons
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
}

// ===== UTILITY FUNCTIONS =====
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

// Export functions for global access (if needed)
window.portfolioAnimations = {
    initSmoothScrolling,
    initScrollAnimations,
    initInteractiveElements
};