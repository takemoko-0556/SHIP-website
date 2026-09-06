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
  const headers = { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY };
  try {
    const res = await fetch(
      `${CONTENT_API_URL}?filters=slug[equals]${encodeURIComponent(slug)}`,
      { headers }
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (data.contents.length > 0) return data.contents[0];

    // フォールバック: CMS 側 slug の前後空白ゆれを吸収して再検索
    const list = await fetch(`${CONTENT_API_URL}?fields=id,slug&limit=100`, { headers }).then(r => r.json());
    const hit = (list.contents || []).find(c => String(c.slug).trim() === slug.trim());
    if (hit) {
      return await fetch(`${CONTENT_API_URL}/${hit.id}`, { headers }).then(r => r.json());
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch content:', err);
    return null;
  }
}

// ========================================
// microCMS（imgix）画像 URL に最適化パラメータを付与
//   auto=format,compress で対応ブラウザには WebP を自動配信
//   CMS 側で w / h が指定済みならそれを尊重し、品質と形式だけ足す
// ========================================
function optimizeImage(url, width) {
  if (!url || url.indexOf('images.microcms-assets.io') === -1) return url;
  const [base, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  if (!params.has('w') && !params.has('h')) params.set('w', String(width));
  params.set('q', '80');
  params.set('auto', 'format,compress');
  return `${base}?${params.toString()}`;
}

// ========================================
// 本文（.cms-body）で figure が 2 枚以上並ぶとき（メニュー画像など）を
// PC で横並びの列レイアウトにする。見出し（直前の p/h）も一緒に列へ。
// ========================================
function layoutBodyColumns(bodyEl) {
  const figures = Array.from(bodyEl.children).filter(el => el.tagName === 'FIGURE');
  if (figures.length < 2) return;

  // 先に「figure ＋ 直前の見出し」のペアを確定させる（DOM を動かす前に）
  const pairs = figures.map(fig => {
    const prev = fig.previousElementSibling;
    const heading =
      prev && /^(P|H[1-6])$/.test(prev.tagName) && prev.textContent.trim() ? prev : null;
    return { heading, fig };
  });

  const row = document.createElement('div');
  row.className = 'cms-columns';
  bodyEl.insertBefore(row, pairs[0].heading || pairs[0].fig);

  pairs.forEach(({ heading, fig }) => {
    const col = document.createElement('div');
    col.className = 'cms-column';
    if (heading) {
      // 見出し冒頭の余分な <br>（CMS で改行された分）を除去して高さを揃える
      while (heading.firstChild &&
             (heading.firstChild.nodeName === 'BR' ||
              (heading.firstChild.nodeType === 3 && !heading.firstChild.textContent.trim()))) {
        heading.firstChild.remove();
      }
      col.appendChild(heading);
    }
    col.appendChild(fig);
    row.appendChild(col);
  });

  // 移動で取り残された空の <p> を掃除
  Array.from(bodyEl.children).forEach(el => {
    if (el !== row && el.tagName === 'P' && !el.textContent.trim() && !el.querySelector('img')) {
      el.remove();
    }
  });
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

  const isHidden = content && content.title && content.title.startsWith('【非公開】');

  if (!content || isHidden) {
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div class="content-coming-soon">
          <img src="../images/common/logo-symbol.png" alt="SHIP" class="coming-soon-logo">
          <p class="coming-soon-text">準備中です</p>
          <p class="coming-soon-sub">コンテンツは近日公開予定です。<br>お楽しみに！</p>
        </div>`;
    }
    if (isHidden) {
      document.title = `${content.title} | SHIP`;
    }
    return;
  }

  // Hide loading
  if (loadingEl) loadingEl.style.display = 'none';

  // Fill in content
  if (titleEl) titleEl.textContent = content.title;
  if (tagEl) tagEl.textContent = `#${content.title}`;
  if (heroEl && content.heroImage) {
    heroEl.src = optimizeImage(content.heroImage.url, 1600);
    heroEl.alt = content.title;
    heroEl.decoding = 'async';
    heroEl.parentElement.style.display = '';
  }
  if (descEl && content.description) {
    // リッチエディタの装飾（改行・太字・リンク等）をそのまま表示
    descEl.innerHTML = content.description;
    descEl.querySelectorAll('img').forEach(im => {
      im.src = optimizeImage(im.getAttribute('src'), 1200);
      im.loading = 'lazy';
      im.decoding = 'async';
    });
  }
  if (bodyEl && content.body) {
    bodyEl.innerHTML = content.body;
    // 本文（リッチエディタ）内の microCMS 画像も最適化＋遅延読み込み
    bodyEl.querySelectorAll('img').forEach(im => {
      im.src = optimizeImage(im.getAttribute('src'), 1200);
      im.loading = 'lazy';
      im.decoding = 'async';
    });
    // figure が複数並ぶ場合は PC で横並びに
    layoutBodyColumns(bodyEl);
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
            <img src="${optimizeImage(img.url, 1000)}" alt="" loading="lazy" decoding="async">
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
          <img src="${optimizeImage(img.url, 1000)}" alt="${alt}" loading="lazy" decoding="async">
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
