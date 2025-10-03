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