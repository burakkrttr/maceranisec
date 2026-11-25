# Macera Kütüphanesi

Kendi Maceranı Seç kitaplarının yayınlandığı site. Tamamen statik: HTML, CSS ve JavaScript. Sunucu, veritabanı ya da derleme adımı yok.

## Klasör yapısı

```
index.html              Kütüphane (ana sayfa)
katalog.js              Kitap listesi: raflar, vitrin ve sayılar buradan oluşur
begeni.js               Raftaki beğeni sayaçları
hareket/                Ana sayfanın hareket katmanı: GSAP (gsap.min.js, ScrollTrigger.min.js),
                        hareket.js ve hareket.css. Silinirse site hareketsiz ama eksiksiz çalışır
.nojekyll               GitHub Pages'in dosyaları işlemeden yayınlaması için
kitaplar/
  fener/
    index.html          Fener (oyunun tamamı tek dosyada)
    img/                Kapak ve sahne görselleri
```

## GitHub Pages'te yayınlama

1. GitHub'da yeni bir depo oluştur (örneğin `macera-kutuphanesi`), herkese açık olsun.
2. Bu klasörün **içindekileri** deponun köküne yükle (`index.html` en üstte olmalı). `.nojekyll` dosyasının da yüklendiğinden emin ol.
3. Depoda **Settings → Pages** bölümüne git. "Build and deployment" altında **Source: Deploy from a branch**, **Branch: main**, klasör **/ (root)** seç ve kaydet.
4. Bir iki dakika sonra site `https://<kullanıcı-adın>.github.io/macera-kutuphanesi/` adresinde yayında olur. Bu linki Instagram bio'na koyabilirsin.

Komut satırından yüklemek istersen (CMD, klasörün içindeyken, tek satır):

```
git init && git add . && git commit -m "Macera Kütüphanesi" && git branch -M main && git remote add origin https://github.com/<kullanıcı-adın>/macera-kutuphanesi.git && git push -u origin main
```

## Yeni kitap ekleme

1. Kitabın klasörünü `kitaplar/<kitap-id>/` altına koy. İçinde `index.html` ve `img/kapak.jpg` olmalı.
2. Kitabın `index.html` dosyasındaki künye bloğuna (`book-meta`) şu satırı ekle, böylece kitabın üst menüsünde "Kütüphane" bağlantısı çıkar:
   `"kutuphane": "../../index.html"`
3. `katalog.js` içindeki `kitaplar` listesine bir kayıt ekle. En kolayı Fener'in kaydını kopyalayıp değiştirmek. Önemli alanlar:
   - `durum`: `"yayinda"` ya da `"yakinda"` (yakında olanlar rafta bağcıklı, açılmayan kitap olarak durur)
   - `eklenme`: tarih. Vitrinde en yeni yayındaki kitap gösterilir
   - `adres`: `"kitaplar/<kitap-id>/index.html"`
   - `sonAnahtari`: kitabın bulunan sonları sakladığı anahtar (Fener için `"fener-sonlar"`). Kütüphane okuyucunun ilerlemesini buradan okur
   - `sirt`: raftaki sırtın rengi, yazı rengi, yüksekliği ve kalınlığı
4. Değişiklikleri GitHub'a yükle. Raf, vitrin, filtreler ve sayılar kendiliğinden güncellenir.

## Bilgisayarda deneme

`index.html` dosyasını çift tıklayıp tarayıcıda açman yeterli. İstersen klasörde küçük bir sunucu da çalıştırabilirsin (CMD, tek satır):

```
python -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç.

## Beğeniler

- Okuyucular kitapları **kütüphane rafında** beğenir: her yayındaki kitabın altında, rafın kenarında pirinç bir ♥ plakası var. Kitapların içinde beğeni yoktur.
- Kütüphanenin girişindeki "Beğeni" sayısı, raftaki kitapların toplamıdır.
- Sayaçlar ücretsiz Abacus servisinde tutulur (`abacus.jasoncameron.dev`), ayrıca hesap ya da kurulum gerekmez.
- Her tarayıcı bir kitabı bir kez beğenebilir, beğeni geri alınamaz. Bu kural tarayıcıda tutulur, yani isteyen biri sayıyı şişirebilir. Bilerek kabul ettiğimiz bir sınır.
- Servise ulaşılamazsa plakalar sessizce gizlenir, kütüphane ve kitaplar normal çalışır.
- Sayaçlar 6 ay boyunca hiç okunmazsa servis tarafından silinir. Kütüphane her açıldığında sayılar okunduğu için, site ziyaret edildiği sürece bu olmaz.
- Yeni bir kitap için ek bir şey yapman gerekmez: sayaç, katalogdaki `id` ile ilk beğenide kendiliğinden oluşur.
- Beğeniler Claude'daki önizlemede görünmez, çünkü orada dış servislere bağlanılamıyor. Sadece GitHub Pages'te çalışır.

## Notlar

- Okuyucunun bulduğu sonlar yalnızca kendi tarayıcısında (`localStorage`) saklanır. Hesap ya da sunucu gerekmez.
- Yazı tipleri Google Fonts'tan yüklenir (Cormorant Garamond, EB Garamond, Caveat).
- Hareketi azaltma ayarı açık olan cihazlarda animasyonlar kapanır.
- **Özel vitrin (Yedinci Kat):** Ana sayfada girişin hemen altındaki `#vitrin` bölümü. Camlı kutuda dönen 3B kitap: Three.js ile çizilir, cam `MeshPhysicalMaterial` (vitrin3b/vitrin.js derlenmiş dosya, vitrin3b/kaynak.js okunur kaynak). WebGL yoksa kapak görseli kalır; hareket azaltma açıksa kitap dönmez. Kitap zarla oynanan ayrı bir tür olduğu için katalogda (`katalog.js`) değil; raflara, aramaya ve sayaçlara girmez. Oyun `yedinci-kat/` adresinde; eski adres `emiriniyolu/` buraya yönlendirir.
