// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
    link.classList.add('active');
  } else if (href === '/' && currentPath === '/') {
    link.classList.add('active');
  }
});

// Typing effect for hero (optional, subtle)
const greetingEl = document.querySelector('.hero-greeting');
if (greetingEl) {
  greetingEl.style.opacity = '0';
  greetingEl.style.transform = 'translateY(8px)';
  greetingEl.style.transition = 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      greetingEl.style.opacity = '1';
      greetingEl.style.transform = 'none';
    });
  });
}
