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
let fadeTimeout = null;
let currentResolve = null;

function cancelTransition() {
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
    fadeTimeout = null;
  }
  if (currentResolve) {
    currentResolve();
    currentResolve = null;
  }
  heroNextImage.classList.remove('visible');
  isTransitioning = false;
}

function changeHeroImage(newSrc) {
  return new Promise((resolve) => {
    if (!heroMainImage || !heroNextImage) { resolve(); return; }
    if (heroMainImage.src.endsWith(newSrc)) { resolve(); return; }

    // Cancel any in-progress transition
    if (isTransitioning) {
      cancelTransition();
    }

    isTransitioning = true;
    currentResolve = resolve;

    const preload = new Image();
    preload.onload = () => {
      heroNextImage.src = newSrc;
      heroNextImage.classList.add('visible');
      updateCatchphraseColor(preload);

      fadeTimeout = setTimeout(() => {
        heroMainImage.src = newSrc;
        heroNextImage.classList.remove('visible');
        isTransitioning = false;
        fadeTimeout = null;
        currentResolve = null;
        resolve();
      }, 500);
    };
    preload.onerror = () => { isTransitioning = false; currentResolve = null; resolve(); };
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
  const imageSrc = hashtags[nextIndex].getAttribute('data-image');
  if (imageSrc) {
    // Preload first, then sync active tag + fade together
    const preloaded = new Image();
    await new Promise(resolve => {
      preloaded.onload = resolve;
      preloaded.onerror = resolve;
      preloaded.src = imageSrc;
    });
    setActiveTag(nextIndex);
    await changeHeroImage(imageSrc);
  } else {
    setActiveTag(nextIndex);
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
// ヒーロー画像を microCMS の heroImage で上書き
//   ハッシュタグの data-image（ローカル画像）はフォールバックとして残す
//   ※ news.js の後に呼ぶこと（MICROCMS_SERVICE_ID / MICROCMS_API_KEY を利用）
// ========================================
async function hydrateHeroImagesFromCMS() {
  const tags = document.querySelectorAll('.hashtag[data-slug]');
  if (!tags.length || typeof MICROCMS_SERVICE_ID === 'undefined') return;

  let contents;
  try {
    const res = await fetch(
      `https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/contents?fields=slug,heroImage&limit=100`,
      { headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY } }
    );
    if (!res.ok) return;
    contents = (await res.json()).contents || [];
  } catch (e) {
    return; // 取得失敗時はローカル画像のまま
  }

  const heroBySlug = {};
  contents.forEach(c => {
    if (c.heroImage && c.heroImage.url) {
      const u = c.heroImage.url;
      const sep = u.indexOf('?') === -1 ? '?' : '&';
      heroBySlug[c.slug] = `${u}${sep}w=1600&q=80&auto=format,compress`;
    }
  });

  let activeSrc = null;
  tags.forEach(tag => {
    const src = heroBySlug[tag.getAttribute('data-slug')];
    if (!src) return;
    tag.setAttribute('data-image', src);
    if (tag.classList.contains('active')) activeSrc = src;
  });

  // 初期表示のローカル画像がまだ出ているうちに CMS 画像へ差し替え
  // （オートスライドが既に進んでいたら邪魔しない）
  if (activeSrc && heroMainImage && !isTransitioning &&
      heroMainImage.src.indexOf('images.microcms-assets.io') === -1) {
    const pre = new Image();
    pre.onload = () => {
      if (isTransitioning) return;
      heroMainImage.src = activeSrc;
      updateCatchphraseColor(pre);
    };
    pre.src = activeSrc;
  }
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
