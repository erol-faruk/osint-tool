# OSINT Tool Onboarding

## 1) Projenin amacı
Bu repo, tek sayfalık (SPA değil, sade HTML + JS) bir **OSINT link paneli** üretir.
Kullanıcıdan metin (domain, kullanıcı adı, anahtar kelime vb.) ve isteğe bağlı görsel URL alır; ardından farklı servisler için hızlı arama butonları üretir.

## 2) Mimari (yüksek seviye)
- `index.html`: arayüz iskeleti, stiller, temel güvenlik başlıkları (CSP meta), giriş alanları ve butonlar.
- `script.js`: panel üretme mantığı, URL encode, bağlantı açma, alan temizleme gibi davranışlar.
- `index.html.bak`: eski sürüm (inline `onclick`) referansı.

Bu nedenle proje **framework bağımsız** ve tamamen tarayıcı üzerinde çalışır (backend yok).

## 3) Çalışma akışı
1. Kullanıcı `q` (metin) ve/veya `img` (görsel URL) girer.
2. `buildPanel()` çalışır.
3. Girilen değerlerden kategori bazlı butonlar üretilir.
4. Butona tıklanınca `openLink()` ilgili URL'yi yeni sekmede açar.

## 4) Önemli güvenlik notları
- `encodeURIComponent` ile kullanıcı girdileri URL içinde güvenli biçimde taşınır.
- `openLink()` yalnızca `http/https` ve `data:` şemalarını açar; diğerleri engellenir.
- `index.html` içinde başlangıç seviyesinde CSP tanımlıdır.

## 5) Bilinmesi gereken kritik nokta (ilk katkıda dikkat)
`index.html` dosyasında butonlar artık `id` ile tanımlı (`buildBtn`, `clearBtn`) ve inline `onclick` kullanılmıyor.
Buna karşılık `script.js` içinde şu an bu butonlara `addEventListener` bağlayan kod bulunmuyor.

Yani güvenliğe geçiş yapılırken (inline JS kaldırılırken) olay bağlama adımı eksik kalmış görünüyor.
Yeni gelen biri için ilk işlerden biri bunu tamamlamak olmalı.

## 6) Bir sonraki aşamada öğrenilmesi/iyileştirilmesi gerekenler
- Event binding: `DOMContentLoaded` sonrası `buildBtn`/`clearBtn` listener'larını ekleme.
- Kod organizasyonu: kategori listesini data-driven (array/object) yapıya çekme.
- Test yaklaşımı: temel smoke test (DOM'da bölüm/buton üretildi mi?) için küçük bir test setup.
- Güvenlik sertleştirme:
  - CSP'nin header seviyesine taşınması
  - Harici URL whitelist mantığının merkezi hale getirilmesi
- UX iyileştirmeleri:
  - Bozuk görsel URL durumunda kullanıcı uyarısı
  - Üretilen linklerde kopyalama butonu veya favoriler

## 7) Lokal geliştirme
Bu repo statik dosyalardan oluşur; basit bir static server ile çalıştırılabilir:

```bash
python3 -m http.server 8000
```

Ardından tarayıcıda `http://localhost:8000` açılır.
