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

  // Title
  const titleEl = document.getElementById('content-title');
  const tagEl = document.getElementById('content-tag');
  const heroEl = document.getElementById('content-hero');
  const bodyEl = document.getElementById('content-body');
  const loadingEl = document.getElementById('content-loading');

  if (!content) {
    if (loadingEl) loadingEl.textContent = 'コンテンツが見つかりませんでした';
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
  if (bodyEl) bodyEl.innerHTML = content.body;

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
