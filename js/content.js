// ========================================
// microCMS Contents API
// ========================================
const MICROCMS_SERVICE_ID = 'ship';
const MICROCMS_API_KEY = 'B96Crh5EWIuGsTdd6VU9TWQCfsqqVAXGOTCf';
const MICROCMS_ENDPOINT = 'contents';

const CONTENT_API_URL = `https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`;

// ========================================
// Fetch content by slug
// ========================================
async function fetchContentBySlug(slug) {
  try {
    const res = await fetch(`${CONTENT_API_URL}?filters=slug[equals]${slug}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (data.contents.length === 0) return null;
    return data.contents[0];
  } catch (err) {
    console.error('Failed to fetch content:', err);
    return null;
  }
}

// ========================================
// Render content page
// ========================================
async function renderContent() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;

  const content = await fetchContentBySlug(slug);

  // Elements
  const titleEl = document.getElementById('content-title');
  const tagEl = document.getElementById('content-tag');
  const descEl = document.getElementById('content-description');
  const heroEl = document.getElementById('content-hero');
  const bodyEl = document.getElementById('content-body');
  const bodySectionEl = document.getElementById('content-body-section');
  const loadingEl = document.getElementById('content-loading');

  if (!content) {
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div class="content-coming-soon">
          <img src="../images/common/logo-symbol.png" alt="SHIP" class="coming-soon-logo">
          <p class="coming-soon-text">準備中です</p>
          <p class="coming-soon-sub">コンテンツは近日公開予定です。<br>お楽しみに！</p>
        </div>`;
    }
    return;
  }

  // Hide loading
  if (loadingEl) loadingEl.style.display = 'none';

  // Fill in content
  if (titleEl) titleEl.textContent = content.title;
  if (tagEl) tagEl.textContent = `#${content.title}`;
  if (heroEl && content.heroImage) {
    heroEl.src = content.heroImage.url;
    heroEl.alt = content.title;
    heroEl.parentElement.style.display = '';
  }
  if (descEl && content.description) {
    descEl.textContent = content.description;
  }
  if (bodyEl && content.body) {
    bodyEl.innerHTML = content.body;
    if (bodySectionEl) bodySectionEl.style.display = '';
  }

  // Render gallery if images exist
  const galleryEl = document.getElementById('content-gallery');
  if (galleryEl && content.gallery && content.gallery.length > 0) {
    galleryEl.style.display = '';
    const gridEl = galleryEl.querySelector('.gallery-grid');
    if (gridEl) {
      gridEl.innerHTML = content.gallery.map(img => {
        const alt = img.alt || '';
        if (!alt) {
          return `<div class="gallery-item">
            <img src="${img.url}" alt="" loading="lazy">
          </div>`;
        }
        // 「タイトル」本文 のパターンを解析
        const match = alt.match(/^「(.+?)」(.*)$/s);
        let captionHtml = '';
        if (match) {
          captionHtml = `<span class="gallery-caption-title">${match[1]}</span>`;
          if (match[2].trim()) {
            captionHtml += `<span class="gallery-caption-desc">${match[2].trim()}</span>`;
          }
        } else {
          captionHtml = `<span class="gallery-caption-title">${alt}</span>`;
        }
        return `<div class="gallery-item">
          <img src="${img.url}" alt="${alt}" loading="lazy">
          <div class="gallery-caption">${captionHtml}</div>
        </div>`;
      }).join('');
    }
  }

  // Update page title
  document.title = `${content.title} | SHIP`;

  // Update active hashtag in sidebar
  document.querySelectorAll('.hashtag').forEach(tag => {
    if (tag.getAttribute('data-slug') === slug) {
      tag.classList.add('active');
    }
  });
}

// Run on page load
renderContent();
