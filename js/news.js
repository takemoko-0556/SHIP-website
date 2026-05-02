// ========================================
// microCMS News API
// ========================================
const MICROCMS_SERVICE_ID = 'ship';
const MICROCMS_API_KEY = 'B96Crh5EWIuGsTdd6VU9TWQCfsqqVAXGOTCf';
const MICROCMS_ENDPOINT = 'news';

const NEWS_API_URL = `https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/${MICROCMS_ENDPOINT}`;

// ========================================
// Fetch news list (returns full microCMS response: contents, totalCount, ...)
// ========================================
async function fetchNewsList(limit = 10) {
  try {
    const res = await fetch(`${NEWS_API_URL}?limit=${limit}`, {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
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
// Build single news item HTML
// ========================================
function buildNewsItemHtml(article, index, detailHrefPrefix) {
  const date = formatDate(article.publishedAt);
  const categoryName = article.category ? article.category.name : 'お知らせ';
  const badgeClass = getBadgeClass(categoryName);
  const delay = index > 0 ? ` data-delay="${index * 100}"` : '';

  return `
      <a href="${detailHrefPrefix}?id=${article.id}" class="news-item reveal"${delay}>
        <span class="news-date">${date}</span>
        <div class="news-content">
          <p><span class="news-badge ${badgeClass}">${categoryName}</span></p>
          <p class="news-title">${article.title}</p>
        </div>
      </a>`;
}

// ========================================
// Render news list on top page (latest 3 + "もっとみる" button)
// ========================================
const TOP_NEWS_LIMIT = 3;

async function renderNewsList() {
  const container = document.getElementById('news-list');
  if (!container) return;

  const data = await fetchNewsList(TOP_NEWS_LIMIT);

  // If API fails, keep the static fallback (noscript content)
  if (!data || !data.contents) return;

  const html = data.contents
    .map((article, index) => buildNewsItemHtml(article, index, 'pages/news.html'))
    .join('');

  let moreBtnHtml = '';
  if (data.totalCount > TOP_NEWS_LIMIT) {
    moreBtnHtml = `
      <div class="news-more reveal">
        <a href="pages/news-list.html" class="news-more-btn">もっとみる</a>
      </div>`;
  }

  container.innerHTML = html + moreBtnHtml;

  // Re-observe for scroll animations
  if (typeof revealObserver !== 'undefined') {
    container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
}

// ========================================
// Render full news list page
// ========================================
async function renderNewsListPage() {
  const container = document.getElementById('news-list-all');
  if (!container) return;

  const data = await fetchNewsList(100);

  if (!data || !data.contents) {
    container.innerHTML = '<div class="news-loading">お知らせを取得できませんでした。</div>';
    return;
  }

  if (data.contents.length === 0) {
    container.innerHTML = '<div class="news-loading">現在お知らせはありません。</div>';
    return;
  }

  const html = data.contents
    .map((article, index) => buildNewsItemHtml(article, index, 'news.html'))
    .join('');

  container.innerHTML = html;
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
