// ========================================
// Hamburger menu (mobile)
// ========================================
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
    });
  });
}

// ========================================
// Gallery - Tap to reveal caption (mobile)
// ========================================
document.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  const items = document.querySelectorAll('.gallery-item');

  if (!item) {
    items.forEach(i => i.classList.remove('is-active'));
    return;
  }

  if (!item.querySelector('.gallery-caption')) return;

  const wasActive = item.classList.contains('is-active');
  items.forEach(i => i.classList.remove('is-active'));
  if (!wasActive) item.classList.add('is-active');
});
