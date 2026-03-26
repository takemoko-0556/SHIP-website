// ========================================
// microCMS News API
// ========================================
const MICROCMS_SERVICE_ID = 'ship';
const MICROCMS_API_KEY = 'B96Crh5EWIuGsTdd6VU9TWQCfsqqVAXGOTCf';
const MICROCMS_ENDPOINT = 'news';

const NEWS_API_URL = `https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`;

// ========================================
// Fetch news list
// ========================================
async function fetchNewsList(limit = 10) {
  try {
    const res = await fetch(`${NEWS_API_URL}?limit=${limit}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.contents;
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return null;
  }
}

// ========================================
// Fetch single news article
// ========================================
async function fetchNewsDetail(id) {
  try {
    const res = await fetch(`${NEWS_API_URL}/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch news detail:', err);
    return null;
  }
}

// ========================================
// Format date (2026-02-17T09:42:25.375Z → 2026.02.17)
// ========================================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// ========================================
// Get category badge class
// ========================================
function getBadgeClass(categoryName) {
  const map = {
    '更新情報': 'update',
    'お知らせ': 'update',
    '重要': 'coming-soon',
    'イベント': 'coming-soon',
  };
  return map[categoryName] || 'update';
}

// ========================================
// Render news list on top page
// ========================================
async function renderNewsList() {
  const container = document.getElementById('news-list');
  if (!container) return;

  const articles = await fetchNewsList(10);

  // If API fails, keep the static fallback (noscript content)
  if (!articles) return;

  // Build HTML
  const html = articles.map((article, index) => {
    const date = formatDate(article.publishedAt);
    const categoryName = article.category ? article.category.name : 'お知らせ';
    const badgeClass = getBadgeClass(categoryName);
    const delay = index > 0 ? ` data-delay="${index * 100}"` : '';

    return `
      <a href="pages/news.html?id=${article.id}" class="news-item reveal"${delay}>
        <span class="news-date">${date}</span>
        <div class="news-content">
          <p><span class="news-badge ${badgeClass}">${categoryName}</span></p>
          <p class="news-title">${article.title}</p>
        </div>
      </a>`;
  }).join('');

  container.innerHTML = html;

  // Re-observe for scroll animations
  if (typeof revealObserver !== 'undefined') {
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
}

// ========================================
// Render news detail page
// ========================================
async function renderNewsDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const article = await fetchNewsDetail(id);
  if (!article) {
    const titleEl = document.getElementById('news-detail-title');
    if (titleEl) titleEl.textContent = '記事が見つかりませんでした';
    return;
  }

  // Fill in the page
  const titleEl = document.getElementById('news-detail-title');
  const dateEl = document.getElementById('news-detail-date');
  const badgeEl = document.getElementById('news-detail-badge');
  const bodyEl = document.getElementById('news-detail-body');

  if (titleEl) titleEl.textContent = article.title;
  if (dateEl) dateEl.textContent = formatDate(article.publishedAt);
  if (badgeEl && article.category) {
    badgeEl.textContent = article.category.name;
    badgeEl.className = `news-badge ${getBadgeClass(article.category.name)}`;
  }
  if (bodyEl) bodyEl.innerHTML = article.content;

  // Update page title
  document.title = `${article.title} | SHIP`;
}
