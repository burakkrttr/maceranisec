/*
  MACERA KÜTÜPHANESİ · KATALOG
  Yeni kitap eklemek için:
    1. Kitabın klasörünü kitaplar/<kitap-id>/ altına koy (içinde index.html ve img/kapak.jpg).
    2. Aşağıdaki "kitaplar" listesine bir kayıt ekle. "durum": "yayinda" ya da "yakinda".
  Kütüphane rafları, vitrin ve sayılar bu listeden otomatik oluşur.
*/
window.KATALOG = {
  kutuphane: {
    ad: "Macera Kütüphanesi",
    slogan: "Okumadığın, yaşadığın kitaplar.",
    instagram: "https://www.instagram.com/burakkrttr/",
    instagramKullanici: "burakkrttr"
  },
  kitaplar: [
    {
      id: "fener",
      durum: "yayinda",
      eklenme: "2026-11-18",
      seri: "Kendi Maceranı Seç",
      kitapNo: 1,
      baslik: "Fener",
      altBaslik: "Akça Ada, Ekim 1962",
      yazar: "Burak Karatatar",
      tur: ["Gizem", "Gerilim"],
      okumaSuresi: "25 dk",
      sonSayisi: 8,
      slogan: "Bir fırtına gecesi. Üç yabancı. Tek bir ışık.",
      tanitim: "Akça Ada Feneri'nin yeni bekçisisin. Eski bekçi iki ay önce bir fırtına gecesi kayboldu. Bu gece yine fırtına var, gece yarısı bir gemi geçecek ve kapına üç yabancı gelecek. Işığı yakmak da söndürmek de senin elinde.",
      kapak: "kitaplar/fener/img/kapak.jpg",
      adres: "kitaplar/fener/index.html",
      sonAnahtari: "fener-sonlar",
      sirt: { renk: "#1d3338", yazi: "#e9b34f", yukseklik: 300, kalinlik: 50 }
    },
    {
      id: "amazon",
      durum: "yakinda",
      cikis: "20 Kasım'da",
      seri: "Kendi Maceranı Seç",
      kitapNo: 2,
      baslik: "Amazon",
      altBaslik: "Yeşil Sessizlik",
      yazar: "Burak Karatatar",
      tur: ["Macera", "Hayatta kalma"],
      slogan: "Uçak düştü. Orman seni bekliyor.",
      tanitim: "Küçük bir kargo uçağı ormanın derinliklerine düştü. Pilot yaralı, enkazda mühürlü bir kutu var ve ormanda yalnız değilsin.",
      sirt: { renk: "#2c3a22", yazi: "#cdbb86", yukseklik: 280, kalinlik: 44 }
    }
  ]
};
