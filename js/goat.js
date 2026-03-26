// ========================================
// Goat Gallery - Tap to reveal (mobile)
// ========================================
const goatCards = document.querySelectorAll('.goat-card');

goatCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // On touch devices, toggle the overlay
    const isActive = card.classList.contains('is-active');

    // Close all other cards
    goatCards.forEach(c => c.classList.remove('is-active'));

    // Toggle current card
    if (!isActive) {
      card.classList.add('is-active');
    }
  });
});

// Close overlay when tapping outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.goat-card')) {
    goatCards.forEach(c => c.classList.remove('is-active'));
  }
});
