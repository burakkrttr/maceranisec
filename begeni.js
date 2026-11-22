/*
  MACERA KÜTÜPHANESİ · BEĞENİLER
  Sayaçlar ücretsiz Abacus servisinde tutulur (https://abacus.jasoncameron.dev); yanıt vermezse CounterAPI (api.counterapi.dev) yedektir.
  - Her tarayıcı bir kitabı bir kez beğenebilir, beğeni geri alınamaz.
  - Plaka her zaman görünür. Servislere ulaşılamazsa sayı yazılmaz; beğeni tarayıcıda bekler ve servis dönünce gönderilir.
  - Sayaçlar 6 ay hiç okunmazsa silinir; site her açıldığında okunduğu için bu sorun olmaz.
*/
(() => {
  const API = "https://abacus.jasoncameron.dev";
  const NS = "burakkrttr-macera-kutuphanesi";
  const key = (id) => id + "-begeni";
  const mine = (id) => { try { return localStorage.getItem("begendim-" + id) === "1"; } catch (e) { return false; } };
  const remember = (id) => { try { localStorage.setItem("begendim-" + id, "1"); } catch (e) {} };

  // İki servis: önce Abacus, yanıt yoksa CounterAPI. İkisi de yoksa beğeni tarayıcıda bekler, sonra gönderilir.
  const FALLBACK = "https://api.counterapi.dev/v1";
  const zaman = (ms) => new Promise((_, no) => setTimeout(() => no(new Error("zaman aşımı")), ms));
  const iste = (url) => Promise.race([fetch(url, { cache: "no-store" }), zaman(6000)]);
  async function abacusGet(id) { const r = await iste(`${API}/get/${NS}/${key(id)}`); if (r.status === 404) return 0; if (!r.ok) throw 0; return (await r.json()).value || 0; }
  async function abacusHit(id) { const r = await iste(`${API}/hit/${NS}/${key(id)}`); if (!r.ok) throw 0; return (await r.json()).value; }
  async function yedekGet(id) { const r = await iste(`${FALLBACK}/${NS}/${key(id)}`); if (r.status === 400 || r.status === 404) return 0; if (!r.ok) throw 0; return (await r.json()).count || 0; }
  async function yedekHit(id) { const r = await iste(`${FALLBACK}/${NS}/${key(id)}/up`); if (!r.ok) throw 0; return (await r.json()).count; }
  async function get(id) { try { return await abacusGet(id); } catch (e) { return await yedekGet(id); } }
  const bekleyen = (id, v) => { try { if (v === undefined) return localStorage.getItem("begeni-bekliyor-" + id) === "1"; v ? localStorage.setItem("begeni-bekliyor-" + id, "1") : localStorage.removeItem("begeni-bekliyor-" + id); } catch (e) { return false; } };
  async function hit(id) {
    remember(id);
    try { const n = await abacusHit(id).catch(() => yedekHit(id)); bekleyen(id, false); return n; }
    catch (e) { bekleyen(id, true); throw e; }
  }

  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';
  const fmt = (n) => n.toLocaleString("tr-TR");

  const CSS = `
  .like { --c: #e9b34f; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; border: 0; position: relative;
    font: 600 19px/1 "Cormorant Garamond", Georgia, serif; letter-spacing: .04em; padding: 11px 18px 11px 14px; border-radius: 999px;
    background: rgba(239,230,209,.07); color: inherit; box-shadow: inset 0 0 0 1px rgba(239,230,209,.22); transition: box-shadow .2s, background .2s, transform .15s; }
  .like:hover { box-shadow: inset 0 0 0 1px var(--c); }
  .like:active { transform: scale(.96); }
  .like svg { width: 24px; height: 24px; fill: none; stroke: var(--c); stroke-width: 1.8; transition: fill .25s, transform .25s; overflow: visible; }
  .like .n { font-variant-numeric: lining-nums tabular-nums; min-width: 1ch; }
  .like .l { opacity: .75; font-weight: 500; }
  .like.on { cursor: default; background: rgba(233,179,79,.14); box-shadow: inset 0 0 0 1px rgba(233,179,79,.6); }
  .like.on svg { fill: var(--c); }
  .like.pop svg { animation: like-pop .55s cubic-bezier(.2,1.6,.4,1); }
  @keyframes like-pop { 0% { transform: scale(1); } 30% { transform: scale(.7); } 70% { transform: scale(1.35); } 100% { transform: scale(1); } }
  .like .burst { position: absolute; left: 26px; top: 50%; width: 0; height: 0; pointer-events: none; }
  .like .burst i { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--c); left: -3px; top: -3px; animation: like-fly .7s ease-out forwards; }
  @keyframes like-fly { from { transform: translate(0,0) scale(1); opacity: 1; } to { transform: translate(var(--x), var(--y)) scale(.2); opacity: 0; } }
  .like.on-paper { --c: #8d3a26; color: #2b241d; background: rgba(141,58,38,.05); box-shadow: inset 0 0 0 1px rgba(141,58,38,.3); }
  .like.on-paper.on { background: rgba(141,58,38,.1); }
  .like[hidden] { display: none; }
  @media (prefers-reduced-motion: reduce) { .like.pop svg, .like .burst i { animation: none; } }`;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  /* Bir kapsayıcıya beğeni düğmesi koyar. opts.paper: kağıt zeminli sayfalar için koyu renk */
  function mount(host, id, opts = {}) {
    if (!host) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "like" + (opts.paper ? " on-paper" : ""); b.hidden = true;
    b.innerHTML = `${HEART}<span class="n">0</span><span class="l"></span><span class="burst"></span>`;
    host.appendChild(b);
    const set = (n, on) => {
      b.querySelector(".n").textContent = fmt(n);
      b.querySelector(".l").textContent = on ? "beğendin" : "beğen";
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? `Bu kitabı beğendin, toplam ${n} beğeni` : `Bu kitabı beğen, şu an ${n} beğeni`);
      b.disabled = on;
    };
    // Plaka hemen görünür; sayı servisten gelince yazılır. Servis yoksa yalnızca kalp ve "beğen" kalır.
    let yuklendi = false;
    set(0, mine(id)); b.querySelector(".n").textContent = ""; b.hidden = false;
    const yukle = (deneme) => get(id).then((n) => {
        if (bekleyen(id)) hit(id).then((m) => { set(m, true); opts.onCount && opts.onCount(m); }).catch(() => {});
        yuklendi = true; set(n, mine(id)); opts.onCount && opts.onCount(n);
      })
      .catch(() => { if (deneme < 2) setTimeout(() => yukle(deneme + 1), 3000 * (deneme + 1)); });
    yukle(0);
    b.addEventListener("click", () => {
      if (mine(id)) return;
      const cur = parseInt(b.querySelector(".n").textContent.replace(/\D/g, ""), 10) || 0;
      set(cur + 1, true); remember(id); if (!yuklendi) b.querySelector(".n").textContent = "";
      b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
      const burst = b.querySelector(".burst"); burst.innerHTML = "";
      for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.283, r = 26 + Math.random() * 14; const i = document.createElement("i"); i.style.setProperty("--x", Math.cos(a) * r + "px"); i.style.setProperty("--y", Math.sin(a) * r + "px"); burst.appendChild(i); }
      hit(id).then((n) => { yuklendi = true; set(n, true); opts.onCount && opts.onCount(n); }).catch(() => {});
    });
    return b;
  }

  window.Begeni = { get, hit, mine, mount };
})();
