// script.js — güvenli, inline JS olmadan çalışacak versiyon
'use strict';

function encode(v) {
  return encodeURIComponent(String(v));
}

function openLink(url) {
  // sadece http/https veya data URL'lerini izin ver
  if (!/^https?:\/\//i.test(url) && !/^data:/i.test(url)) {
    console.warn('Blocked non-HTTP(S) URL:', url);
    return;
  }
  window.open(url, '_blank');
}

function createBtn(label, icon, url) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.innerHTML = icon + ' ' + label;
  b.onclick = () => openLink(url);
  return b;
}

function buildPanel() {
  const q = document.getElementById('q').value.trim();
  const img = document.getElementById('img').value.trim();
  const panel = document.getElementById('panel');
  panel.innerHTML = '';

  if (!q && !img) {
    panel.innerHTML = '<div>Lütfen metin veya görsel URL gir.</div>';
    return;
  }

  if (q) {
    // GENEL
    let sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = '<h3>🌍 Genel Web Arama</h3>';
    sec.appendChild(createBtn('Google','🔎','https://www.google.com/search?q='+encode(q)));
    sec.appendChild(createBtn('DuckDuckGo','🦆','https://duckduckgo.com/?q='+encode(q)));
    sec.appendChild(createBtn('Wikipedia','📚','https://en.wikipedia.org/wiki/Special:Search?search='+encode(q)));
    panel.appendChild(sec);

    // SOSYAL
    sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = '<h3>👥 Sosyal Medya</h3>';
    sec.appendChild(createBtn('Twitter (X)','🐦','https://x.com/search?q='+encode(q)));
    sec.appendChild(createBtn('Facebook','📘','https://www.facebook.com/search/top/?q='+encode(q)));
    sec.appendChild(createBtn('Reddit','👽','https://www.reddit.com/search/?q='+encode(q)));
    sec.appendChild(createBtn('YouTube','▶️','https://www.youtube.com/results?search_query='+encode(q)));
    sec.appendChild(createBtn('TikTok','🎵','https://www.tiktok.com/search?q='+encode(q)));
    sec.appendChild(createBtn('Instagram #','📸','https://www.instagram.com/explore/tags/'+encode(q)+'/'));
    sec.appendChild(createBtn('Instagram User','🙋','https://www.instagram.com/'+encode(q)+'/'));
    panel.appendChild(sec);

    // EKSTRA OSINT
    sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = '<h3>🛠️ Ekstra OSINT</h3>';
    sec.appendChild(createBtn('WHOIS','🌐','https://whois.domaintools.com/'+encode(q)));
    sec.appendChild(createBtn('IP Info','📡','https://ipinfo.io/'+encode(q)));
    sec.appendChild(createBtn('Shodan','🔭','https://www.shodan.io/search?query='+encode(q)));
    sec.appendChild(createBtn('VirusTotal','🧬','https://www.virustotal.com/gui/search/'+encode(q)));
    sec.appendChild(createBtn('Google News','📰','https://news.google.com/search?q='+encode(q)));
    panel.appendChild(sec);

    // DARK WEB
    sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = '<h3>🧅 Dark Web / Onion</h3>';
    sec.appendChild(createBtn('Ahmia','🧅','https://ahmia.fi/search/?q='+encode(q)));
    sec.appendChild(createBtn('DarkSearch.io','🌑','https://darksearch.io/search?query='+encode(q)));
    sec.appendChild(createBtn('Onion.link','🪢','https://onion.link/search?q='+encode(q)));
    panel.appendChild(sec);
  }

  if (img) {
    // GÖRSEL
    let sec = document.createElement('div'); sec.className = 'section';
    sec.innerHTML = '<h3>🖼️ Görsel Arama</h3>';
    sec.appendChild(createBtn('Google Görsel','🔎','https://www.google.com/searchbyimage?&image_url='+img));
    sec.appendChild(createBtn('Yandex','🟠','https://yandex.com/images/search?url='+img));
    sec.appendChild(createBtn('Bing','🟢','https://www.bing.com/images/searc?q=imgurl:'+img+'&view=detailv2&iss=sbi'));
    sec.appendChild(createBtn('TinEye','👁️','https://tineye.com/search/?url='+img));
    sec.appendChild(createBtn('Baidu','🐼','https://graph.baidu.com/details?image='+img));
    sec.appendChild(createBtn('EXIF','📑','http://exif.regex.info/exif.cgi?url='+img));
    panel.appendChild(sec);
  }
}

function clearPanel() {
  document.getElementById('q').value = '';
  document.getElementById('img').value = '';
  document.getElementById('panel').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const buildBtn = document.getElementById('buildBtn');
  const clearBtn = document.getElementById('clearBtn');
  const qInput = document.getElementById('q');

  if (!buildBtn) {
    console.error("Element bulunamadı: #buildBtn");
  } else {
    buildBtn.addEventListener('click', buildPanel);
  }

  if (!clearBtn) {
    console.error("Element bulunamadı: #clearBtn");
  } else {
    clearBtn.addEventListener('click', clearPanel);
  }

  if (qInput) {
    qInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        buildPanel();
      }
    });
  }
});
