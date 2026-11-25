/* Macera Kütüphanesi: hareket katmanı (GSAP demo)
 *
 * Motion-design kararları (LottieFiles motion-design skill'i):
 *  - Kişilik: "Premium" (kütüphane, kağıt, lamba ışığı): sakin, aşırıya kaçmayan, taşma yok
 *    (yalnızca kağıt fişte %3 civarı, kağıt malzemesine uygun).
 *  - İmza yumuşatma: power3.out (girişler yavaşlayarak oturur), sahnede kalanlar sine.inOut.
 *  - Süre paleti: hızlı 0.25 sn, standart 0.5 sn, yavaş 0.9 sn.
 *  - Giriş deseni: aşağıdan 24 px yükselip belirme (yön her yerde aynı).
 *  - Kademe bütçesi: toplam en fazla 0.4 sn; aynı anda ekranın en fazla üçte biri hareket eder.
 * GSAP kuralları (resmi gsap-core / scrolltrigger / performance skill'leri):
 *  - Yalnızca transform ve opacity (autoAlpha); width/top/left yok.
 *  - Her şey gsap.matchMedia() içinde: "hareketi azalt" diyen kullanıcıya hiçbiri çalışmaz.
 *  - ScrollTrigger'lar sayfadaki sırayla (yukarıdan aşağı) kurulur; scrub ile toggleActions karışmaz.
 */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const HIZLI = 0.25, STANDART = 0.5, YAVAS = 0.9;
  const IMZA = "power3.out";
  gsap.defaults({ duration: STANDART, ease: IMZA });

  const $ = (s, k = document) => k.querySelector(s);
  const $$ = (s, k = document) => [...k.querySelectorAll(s)];

  /** Başlığı kelimelere böler (em gibi iç etiketleri korur); her kelime ayrı yükselir. */
  function kelimelereBol(el) {
    if (!el || el.dataset.bolundu) return [];
    el.dataset.bolundu = "1";
    const parcalar = [];
    const isle = (dugum) => {
      [...dugum.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            const dis = document.createElement("span"); dis.className = "hk-kelime";
            const ic = document.createElement("span"); ic.className = "hk-ic"; ic.textContent = w;
            dis.appendChild(ic); frag.appendChild(dis); parcalar.push(ic);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) isle(c);
      });
    };
    isle(el);
    return parcalar;
  }

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    document.documentElement.classList.add("hareket");

    /* 1 · Giriş sayıları sayarak gelir (CSS'teki fadeup 1.3 sn'de bitince) */
    const say = (b, gecikme) => {
      const hedef = parseInt(b.textContent.replace(/\D/g, ""), 10) || 0;
      if (!hedef) return;
      const o = { n: 0 };
      gsap.to(o, { n: hedef, duration: YAVAS * 1.4, delay: gecikme, ease: "power2.out",
        onUpdate: () => { b.textContent = Math.round(o.n).toLocaleString("tr-TR"); } });
    };
    $$("#stats > div:not([hidden]) b").forEach((b, i) => say(b, 1.3 + i * 0.08));
    // Beğeni toplamı sonradan (servisten) gelir: göründüğü anda saydır
    const begeni = $("#stat-likes");
    if (begeni) {
      const g = new MutationObserver(() => { if (!begeni.hidden) { g.disconnect(); say(begeni.querySelector("b"), 0.2); } });
      g.observe(begeni, { attributes: true, attributeFilter: ["hidden"] });
    }

    /* 2 · Giriş derinliği: kaydırdıkça katmanlar farklı hızlarda uzaklaşır (scrub) */
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 } })
      .to("#title", { y: -90, ease: "none" }, 0)
      .to(".hero .lede, .hero-cta, .hero .kicker", { y: -40, autoAlpha: 0.2, ease: "none" }, 0)
      .to(".hero .stats", { y: -20, autoAlpha: 0, ease: "none" }, 0)
      .to(".reel", { y: 60, ease: "none" }, 0);

    /* 3 · Özel vitrin (Yedinci Kat): yazı sütunu kademeyle yükselir; 3B sahne kendi kendini çizer (vitrin3b/) */
    gsap.from(".ozel-yazi > *", { y: 24, autoAlpha: 0, stagger: 0.06, duration: STANDART,
      scrollTrigger: { trigger: "#vitrin", start: "top 75%", toggleActions: "play none none none" } });

    /* 4 · Bölüm başlıkları kelime kelime yükselir (kademe 0.06 sn, toplam ≤ 0.4 sn) */
    $$(".sec-head h2").forEach((h2) => {
      const k = kelimelereBol(h2);
      if (!k.length) return;
      gsap.from(k, { yPercent: 110, autoAlpha: 0, duration: STANDART + 0.1, stagger: { each: 0.06 },
        scrollTrigger: { trigger: h2, start: "top 85%", toggleActions: "play none none none" } });
    });

    /* 5 · Sahneler şeridi kaydırma hızına tepki verir: hızlı kaydırınca hızlanır, sonra yavaşça normale döner */
    const serit = $("#scenes .track");
    const anim = serit && serit.getAnimations && serit.getAnimations()[0];
    if (anim) {
      const hiz = { v: 1 };
      const uygula = () => { anim.playbackRate = hiz.v; };
      ScrollTrigger.create({ trigger: "#sahneler", start: "top bottom", end: "bottom top",
        onUpdate: (st) => {
          const hedef = 1 + Math.min(12, Math.abs(st.getVelocity()) / 120);
          gsap.to(hiz, { v: hedef, duration: HIZLI, overwrite: true, onUpdate: uygula,
            onComplete: () => gsap.to(hiz, { v: 1, duration: 1.6, ease: "sine.inOut", onUpdate: uygula }) });
        } });
    }

    /* 6 · Raf: seçilen kitap hafifçe öne çıkar, fiş kağıt gibi düşüp oturur */
    const fis = $("#fis");
    if (fis) {
      const fisGelsin = () => {
        if (fis.hidden) return;
        gsap.killTweensOf(fis);
        gsap.fromTo(fis, { y: -22, rotation: -1.2, autoAlpha: 0, transformOrigin: "30% 0%" },
          { y: 0, rotation: 0, autoAlpha: 1, duration: STANDART, ease: "back.out(1.1)" });
        gsap.from(fis.querySelectorAll(":scope > *"), { y: 12, autoAlpha: 0, duration: STANDART * 0.8, stagger: 0.04, delay: 0.08 });
      };
      new MutationObserver(fisGelsin).observe(fis, { childList: true });
    }
    const row = $("#row");
    if (row) {
      const vurgula = () => {
        $$(".kt", row).forEach((el) => {
          const secili = el.getAttribute("aria-pressed") === "true";
          gsap.to(el, { y: secili ? -14 : 0, rotationX: secili ? 4 : 0, scale: secili ? 1.03 : 1, transformPerspective: 900, duration: secili ? STANDART : HIZLI, ease: secili ? "back.out(1.4)" : "power2.out", overwrite: "auto" });
        });
      };
      new MutationObserver(vurgula).observe(row, { attributes: true, subtree: true, attributeFilter: ["aria-pressed"] });
      vurgula();
    }

    /* 7 · Nasıl okunur: iğne düşer, simge kendini çizer, metin yükselir (her kart bir öncekinden 0.12 sn sonra) */
    $$(".step").forEach((step, i) => {
      const yol = step.querySelector("path.draw");
      const tl = gsap.timeline({ delay: i * 0.12,
        scrollTrigger: { trigger: ".steps", start: "top 80%", toggleActions: "play none none none" } });
      tl.from(step.querySelector(".igne"), { y: -40, autoAlpha: 0, duration: STANDART, ease: "bounce.out" });
      if (yol && yol.getTotalLength) {
        const L = yol.getTotalLength();
        tl.fromTo(yol, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: YAVAS, ease: "power2.inOut" }, "-=0.2");
      }
      tl.from(step.querySelectorAll("h3, p"), { y: 16, autoAlpha: 0, stagger: 0.06 }, "-=0.5");
    });

    /* 8 · Kapanış: "Yeni kitaplar yolda" satırları ve damga */
    gsap.from("footer .big", { y: 30, autoAlpha: 0, duration: YAVAS,
      scrollTrigger: { trigger: "footer", start: "top 90%", toggleActions: "play none none none" } });
    gsap.from("footer .siradaki", { scale: 1.6, rotation: -14, autoAlpha: 0, duration: STANDART, ease: "back.out(2)", delay: 0.4,
      scrollTrigger: { trigger: "footer", start: "top 90%", toggleActions: "play none none none" } });

    // Görseller ve yazı tipleri yüklenince tetik noktalarını yeniden hesapla
    addEventListener("load", () => ScrollTrigger.refresh());

    return () => document.documentElement.classList.remove("hareket");
  });
})();
