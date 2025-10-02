// script.js — güvenli, inline JS olmadan çalışacak versiyon

'use strict';

function encode(v) {
  return encodeURIComponent(String(v));
}

function openLink(url) {
  // basit validation: sadece http/https ya da data görsellerine izin ver
  if (!/^https?:\/\//i.test(url) && !/^data:/i.test(url)) {
    console.warn('Blocked non-HTTP(S) URL:', url);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function createBtn(label, icon, url) {
  const b = document.createElement('button');
  b.className = 'btn';
  // güvenli metin kullan (innerHTML kullanmıyoruz)
  b.textContent = `${icon} ${label}`;
  b.type = 'button';
  b.addEventListener('click', () => openLink(url));
  return b;
}

function createSection(title) {
  const sec = document.createElement('div');
  sec.className = 'section';
  const h = document.createElement('h3');
  h.textContent = title;
  sec.appendChild(h);
  return sec;
}

function clearPanelDom(panel) {
  // güvenli temizleme
  while (panel.firstChild) panel.removeChild(panel.firstChild);
}

function showNote(panel, text) {
  const d = document.createElement('div');
  d.className = 'note';
  d.textContent = text;
  panel.appendChild(d);
}

function buildPanel() {
  try {
    const qEl = document.getElementById('q');
    const imgEl = document.getElementById('img');
    const panel = document.getElementById('panel');
    if (!panel) return;

    const q = qEl ? qEl.value.trim() : '';
    const img = imgEl ? imgEl.value.trim() : '';

    clearPanelDom(panel);

    if (!q && !img) {
      showNote(panel, 'Lütfen önce metin veya görsel URL gir ve "Paneli Oluştur" düğmesine bas.');
      return;
    }

    // Limit input length to avoid abuse
    if (q && q.length > 200) {
      showNote(panel, 'Arama terimi çok uzun (200 karakter sınırı).');
      return;
    }
    if (img && img.length > 2000) {
      showNote(panel, 'Görsel URL çok uzun.');
      return;
    }

    if (q) {
      // Genel Web Arama
      let sec = createSection('🌍 Genel Web Arama');
      sec.appendChild(createBtn('Google', '🔎', 'https://www.google.com/search?q=' + encode(q)));
      sec.appendChild(createBtn('DuckDuckGo', '🦆', 'https://duckduckgo.com/?q=' + encode(q)));
      sec.appendChild(createBtn('Wikipedia', '📚', 'https://en.wikipedia.org/wiki/Special:Search?search=' + encode(q)));
      panel.appendChild(sec);

      // Sosyal Medya
      sec = createSection('👥 Sosyal Medya');
      sec.appendChild(createBtn('Twitter (X)', '🐦', 'https://x.com/search?q=' + encode(q)));
      sec.appendChild(createBtn('Facebook', '📘', 'https://www.facebook.com/search/top/?q=' + encode(q)));
      sec.appendChild(createBtn('Reddit', '👽', 'https://www.reddit.com/search/?q=' + encode(q)));
      sec.appendChild(createBtn('YouTube', '▶️', 'https://www.youtube.com/results?search_query=' + encode(q)));
      sec.appendChild(createBtn('TikTok', '🎵', 'https://www.tiktok.com/search?q=' + encode(q)));
      sec.appendChild(createBtn('Instagram #', '📸', 'https://www.instagram.com/explore/tags/' + encode(q) + '/'));
      sec.appendChild(createBtn('Instagram User', '🙋', 'https://www.instagram.com/' + encode(q) + '/'));
      panel.appendChild(sec);

      // Ekstra OSINT
      sec = createSection('🛠️ Ekstra OSINT');
      sec.appendChild(createBtn('WHOIS (DomainTools)', '🌐', 'https://whois.domaintools.com/' + encode(q)));
      sec.appendChild(createBtn('IP Info', '📡', 'https://ipinfo.io/' + encode(q)));
      sec.appendChild(createBtn('Shodan', '🔭', 'https://www.shodan.io/search?query=' + encode(q)));
      sec.appendChild(createBtn('VirusTotal', '🧬', 'https://www.virustotal.com/gui/search/' + encode(q)));
      sec.appendChild(createBtn('Google News', '📰', 'https://news.google.com/search?q=' + encode(q)));
      panel.appendChild(sec);

      // Dark Web / Onion
      sec = createSection('🧅 Dark Web / Onion');
      sec.appendChild(createBtn('Ahmia', '🧅', 'https://ahmia.fi/search/?q=' + encode(q)));
      sec.appendChild(createBtn('DarkSearch.io', '🌑', 'https://darksearch.io/search?query=' + encode(q)));
      sec.appendChild(createBtn('Onion.link', '🪢', 'https://onion.link/search?q=' + encode(q)));
      panel.appendChild(sec);
    }

    if (img) {
      // Görsel Arama
      const sec = createSection('🖼️ Görsel Arama');
      const safeImg = img; // sanitized by length and scheme check in openLink
      sec.appendChild(createBtn('Google Görsel', '🔎', 'https://www.google.com/searchbyimage?&image_url=' + safeImg));
      sec.appendChild(createBtn('Yandex', '🟠', 'https://yandex.com/images/search?url=' + safeImg));
      sec.appendChild(createBtn('Bing', '🟢', 'https://www.bing.com/images/search?q=imgurl:' + safeImg + '&view=detailv2&iss=sbi'));
      sec.appendChild(createBtn('TinEye', '👁️', 'https://tineye.com/search/?url=' + safeImg));
      sec.appendChild(createBtn('Baidu', '🐼', 'https://graph.baidu.com/details?image=' + safeImg));
      sec.appendChild(createBtn('EXIF', '📑', 'http://exif.regex.info/exif.cgi?url=' + safeImg));
      panel.appendChild(sec);
    }

    // hint
    showNote(panel, 'İpucu: Çok sayıda sekme açılabilir — tarayıcının popup engelleyicisini kontrol et.');
  } catch (err) {
    console.error('buildPanel error:', err);
  }
}

function clearPanel() {
  const qEl = document.getElementById('q');
  const imgEl = document.getElementById('img');
  const panel = document.getElementById('panel');
  if (qEl) qEl.value = '';
  if (imgEl) imgEl.value = '';
  if (panel) clearPanelDom(panel);
}

/* Attach listeners after DOM is ready */
document.addEventListener('DOMContentLoaded', function () {
  const buildBtn = document.getElementById('buildBtn');
  if (buildBtn) buildBtn.addEventListener('click', buildPanel);

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearPanel);

  // Optional: allow Enter key in the text input to trigger search
  const qEl = document.getElementById('q');
  if (qEl) {
    qEl.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        buildPanel();
      }
    });
  }
});
