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
      durum: "yayinda",
      eklenme: "2026-11-20",
      seri: "Kendi Maceranı Seç",
      kitapNo: 2,
      baslik: "Amazon",
      altBaslik: "Yeşil Sessizlik",
      yazar: "Burak Karatatar",
      tur: ["Macera", "Hayatta kalma"],
      okumaSuresi: "30 dk",
      sonSayisi: 7,
      slogan: "Uçak düştü. Orman seni bekliyor.",
      tanitim: "Küçük bir kargo uçağı ormanın derinliklerine düştü. Pilot yaralı, enkazda mühürlü bir kutu var ve ormanda yalnız değilsin.",
      kapak: "kitaplar/amazon/img/kapak.jpg",
      adres: "kitaplar/amazon/index.html",
      sonAnahtari: "amazon-sonlar",
      sirt: { renk: "#2c3a22", yazi: "#cdbb86", yukseklik: 280, kalinlik: 44 }
    },
    {
      id: "kum-firtinasi",
      durum: "yayinda",
      eklenme: "2026-11-20",
      seri: "Kendi Maceranı Seç",
      kitapNo: 3,
      baslik: "Kum Fırtınası",
      altBaslik: "Bir Star Wars hayran macerası",
      yazar: "Burak Karatatar",
      tur: ["Uzay operası", "Hayran kurgusu"],
      okumaSuresi: "30 dk",
      sonSayisi: 7,
      slogan: "Kapsüle dokunduğun anda uğultu başladı.",
      tanitim: "Çöl gezegeni Kessar'da bir hurdacının çırağısın. Hurdalığa düşen bir kapsülde taş bir küp buluyorsun ve aynı gece kasabaya bir Engizitör iniyor.",
      kapak: "kitaplar/kum-firtinasi/img/kapak.jpg",
      adres: "kitaplar/kum-firtinasi/index.html",
      sonAnahtari: "kum-firtinasi-sonlar",
      sirt: { renk: "#3a2216", yazi: "#e8a64a", yukseklik: 340, kalinlik: 48, yaziBoyu: 17 }
    },
    {
      id: "karanlik-koy",
      durum: "yayinda",
      eklenme: "2026-11-20",
      seri: "Kendi Maceranı Seç",
      kitapNo: 4,
      baslik: "Karanlık Köy",
      altBaslik: "Bir Karadeniz korku hikâyesi",
      yazar: "Burak Karatatar",
      tur: ["Korku", "Gerilim"],
      okumaSuresi: "30 dk",
      sonSayisi: 7,
      slogan: "Sis gelince kapını kimseye açma.",
      tanitim: "Kasım 1987. Artvin'in yükseklerindeki Kuşkaya köyünün okuluna atanan yeni öğretmensin. Bir önceki öğretmen geçen kış kayboldu. Okulun kapısında onun el yazısıyla bir not var ve aynı gece dağdan sis iniyor.",
      kapak: "kitaplar/karanlik-koy/img/kapak.jpg",
      adres: "kitaplar/karanlik-koy/index.html",
      sonAnahtari: "karanlik-koy-sonlar",
      sirt: { renk: "#172024", yazi: "#e3a64f", yukseklik: 320, kalinlik: 46, yaziBoyu: 17 }
    }
  ]
};
