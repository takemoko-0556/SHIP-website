// ========================================
// Room Tab Switching
// ========================================
const roomTabs = document.querySelectorAll('.room-tab');
const roomDetails = document.querySelectorAll('.room-detail');

roomTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-room');

    // Update tabs
    roomTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update room panels
    roomDetails.forEach(detail => {
      detail.classList.remove('active');
      if (detail.id === `room-${target}`) {
        detail.classList.add('active');
      }
    });
  });
});

// ========================================
// Room Image Slider
// ========================================
roomDetails.forEach(room => {
  const slides = room.querySelectorAll('.room-slide');
  const dots = room.querySelectorAll('.room-dot');
  const prevBtn = room.querySelector('.room-slider-btn.prev');
  const nextBtn = room.querySelector('.room-slider-btn.next');
  let currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
    });
  });
});
