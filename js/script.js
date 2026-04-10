// ========================================
// Loading cover
// ========================================
const loadingCover = document.getElementById('loading-cover');

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingCover.classList.add('hidden');
  }, 1000);
});

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
// Scroll reveal animations
// ========================================
const revealElements = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// Hashtag ↔ Hero Image Interaction
// ========================================
const sidebarTags = document.querySelectorAll('.sidebar-tags .hashtag');
const mobileTags = document.querySelectorAll('.mobile-tags .hashtag');
const hashtags = sidebarTags.length > 0 ? sidebarTags : mobileTags;
const heroMainImage = document.getElementById('hero-main-image');
const heroNextImage = document.getElementById('hero-next-image');
let isTransitioning = false;
let autoSlideInterval;
let currentTagIndex = 0;

// ========================================
// Hero catchphrase brightness detection
// ========================================
const heroCatchphrase = document.getElementById('hero-catchphrase');
const brightnessCanvas = document.createElement('canvas');
const brightnessCtx = brightnessCanvas.getContext('2d', { willReadFrequently: true });

function updateCatchphraseColor(imgElement) {
  if (!heroCatchphrase || !imgElement || !imgElement.naturalWidth) return;

  try {
    // Sample the bottom-right quadrant of the image
    const sw = Math.floor(imgElement.naturalWidth * 0.4);
    const sh = Math.floor(imgElement.naturalHeight * 0.2);
    const sx = imgElement.naturalWidth - sw;
    const sy = imgElement.naturalHeight - sh;

    brightnessCanvas.width = 80;
    brightnessCanvas.height = 20;
    brightnessCtx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, 80, 20);

    const data = brightnessCtx.getImageData(0, 0, 80, 20).data;
    let totalBrightness = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      // Perceived brightness formula
      totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    }

    const avgBrightness = totalBrightness / pixelCount;

    // If the area is bright (> 160), use dark text
    if (avgBrightness > 160) {
      heroCatchphrase.classList.add('dark');
    } else {
      heroCatchphrase.classList.remove('dark');
    }
  } catch (e) {
    // Cross-origin or other error — default to white
    heroCatchphrase.classList.remove('dark');
  }
}

// Detect initial image brightness
if (heroMainImage) {
  if (heroMainImage.complete && heroMainImage.naturalWidth) {
    updateCatchphraseColor(heroMainImage);
  } else {
    heroMainImage.addEventListener('load', () => updateCatchphraseColor(heroMainImage));
  }
}

// Change hero image with crossfade (returns Promise)
function changeHeroImage(newSrc) {
  return new Promise((resolve) => {
    if (!heroMainImage || !heroNextImage) { resolve(); return; }
    if (heroMainImage.src.endsWith(newSrc) || isTransitioning) { resolve(); return; }

    isTransitioning = true;

    const preload = new Image();
    preload.onload = () => {
      heroNextImage.src = newSrc;
      heroNextImage.classList.add('visible');
      updateCatchphraseColor(preload);

      setTimeout(() => {
        heroMainImage.src = newSrc;
        heroNextImage.classList.remove('visible');
        isTransitioning = false;
        resolve();
      }, 500);
    };
    preload.onerror = () => { isTransitioning = false; resolve(); };
    preload.src = newSrc;
  });
}

// Set active hashtag (sync both sidebar and mobile tags)
function setActiveTag(index) {
  sidebarTags.forEach(t => t.classList.remove('active'));
  mobileTags.forEach(t => t.classList.remove('active'));
  if (sidebarTags[index]) sidebarTags[index].classList.add('active');
  if (mobileTags[index]) mobileTags[index].classList.add('active');
  currentTagIndex = index;
}

// Hashtag hover → change image, click → navigate to page
function attachTagEvents(tags) {
  tags.forEach((tag, index) => {
    tag.addEventListener('mouseenter', () => {
      stopAutoSlide();
      setActiveTag(index);
      const imageSrc = tag.getAttribute('data-image');
      if (imageSrc) {
        changeHeroImage(imageSrc);
      }
    });

    tag.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  });
}

attachTagEvents(sidebarTags);
attachTagEvents(mobileTags);

// Auto-slide through hashtags
let autoSlideTimeout;
let autoSliding = false;

async function autoSlide() {
  if (autoSliding) return;
  autoSliding = true;

  const nextIndex = (currentTagIndex + 1) % hashtags.length;
  setActiveTag(nextIndex);
  const imageSrc = hashtags[nextIndex].getAttribute('data-image');
  if (imageSrc) {
    await changeHeroImage(imageSrc);
  }

  autoSliding = false;
  if (autoSlideTimeout !== null) {
    autoSlideTimeout = setTimeout(autoSlide, 4000);
  }
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimeout = setTimeout(autoSlide, 4000);
}

function stopAutoSlide() {
  clearTimeout(autoSlideTimeout);
  autoSlideTimeout = null;
}

// Start auto-slide
if (hashtags.length > 1) {
  startAutoSlide();
}

// ========================================
// Smooth anchor scroll
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const targetPos = target.getBoundingClientRect().top + window.scrollY - 20;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});
