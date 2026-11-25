/* Yedinci Kat vitrini: camlı kutuda dönen kitap (Three.js, MeshPhysicalMaterial).
   Görünür olduğunda çizer; sekme gizliyse ya da bölüm ekran dışındaysa durur.
   WebGL yoksa yerinde duran kapak görseli kalır. Hareket azaltma açıksa kitap dönmez. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, PMREMGenerator, Group, Mesh, BoxGeometry, CylinderGeometry,
  MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, TextureLoader, CanvasTexture, SRGBColorSpace,
  SpotLight, AmbientLight, PointLight, ACESFilmicToneMapping, PCFShadowMap, BackSide, Points, BufferGeometry,
  Float32BufferAttribute, PointsMaterial, AdditiveBlending, Color, Vector2, PlaneGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const kutu = document.querySelector('[data-vitrin3b]');
if (kutu) baslat(kutu);

function tuval(w, h, ciz) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  ciz(c.getContext('2d'), w, h);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
}

function baslat(kutu) {
  let renderer;
  try { renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { return; } // WebGL yok: yedek kapak görseli kalır
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kapak = kutu.dataset.kapak;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  // Işığı kıran cam saydam tuvalde grileşir: tuval bölümün rengiyle boyanır, kenarları CSS maskesiyle sayfaya karışır.
  renderer.setClearColor(0x0c0907, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  kutu.appendChild(renderer.domElement);

  const sahne = new Scene();
  const pm = new PMREMGenerator(renderer);
  // Yansıma ortamı: karanlık bir oda ve birkaç sıcak lamba şeridi (cam yalnızca kenarlarda parlar)
  const oda = new Scene();
  oda.add(new Mesh(new BoxGeometry(20, 20, 20), new MeshBasicMaterial({ color: 0x0d0906, side: BackSide })));
  const lamba = (x, y, z, w, h, ry, renk) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: renk })); m.position.set(x, y, z); m.rotation.y = ry; m.lookAt(0, 0, 0); oda.add(m); };
  lamba(0, 9, 0, 6, 6, 0, new Color(0xffd08a).multiplyScalar(4));
  lamba(-8, 2, 4, 2.2, 9, 0, new Color(0xffc070).multiplyScalar(2.4));
  lamba(8, 1, 3, 1.4, 7, 0, new Color(0xe9b34f).multiplyScalar(1.6));
  lamba(0, 1, 9.5, 7, 1.2, 0, new Color(0xfff0d8).multiplyScalar(1.2));
  sahne.environment = pm.fromScene(oda, 0.02).texture;
  sahne.environmentIntensity = 1;

  const kamera = new PerspectiveCamera(28, 1, 0.1, 50);
  kamera.position.set(0, 0.6, 7.6);
  kamera.lookAt(0, -0.12, 0);

  // Işıklar: yukarıdan tek bir sıcak spot, odadan hafif bir dolgu, kitabın arkasından kıyı ışığı
  sahne.add(new AmbientLight(0xffe6c4, 0.4));
  const spot = new SpotLight(0xffd7a0, 110, 14, 0.42, 0.6, 1.5);
  spot.position.set(0.4, 5.2, 1.6); spot.target.position.set(0, -0.2, 0);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0004;
  sahne.add(spot, spot.target);
  const kiyi = new PointLight(0xe9b34f, 9, 6, 1.8); kiyi.position.set(-1.4, 0.6, -1.2); sahne.add(kiyi);

  const vitrin = new Group(); sahne.add(vitrin);
  const W = 1.62, H = 2.05, D = 1.32, tabanY = -1.18;

  // Malzemeler
  const pirinc = new MeshStandardMaterial({ color: 0xc9a063, metalness: 1, roughness: 0.32 });
  const ahsap = new MeshStandardMaterial({ color: 0x3b2618, metalness: 0.1, roughness: 0.62 });
  const koyuAhsap = new MeshStandardMaterial({ color: 0x24160d, metalness: 0.1, roughness: 0.7 });
  const cam = new MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.1, ior: 1.5,
    attenuationColor: new Color(0xcfe8dc), attenuationDistance: 1.6, specularIntensity: 1, specularColor: new Color(0xfff2dc),
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 3.2, transparent: true,
  });

  // Kaide: iki kademeli ahşap, pirinç plaka
  const kaide = new Mesh(new RoundedBoxGeometry(W + 0.34, 0.42, D + 0.34, 3, 0.04), ahsap);
  kaide.position.y = tabanY - 0.21; kaide.receiveShadow = true; vitrin.add(kaide);
  const kaide2 = new Mesh(new RoundedBoxGeometry(W + 0.16, 0.1, D + 0.16, 2, 0.02), koyuAhsap);
  kaide2.position.y = tabanY + 0.05; kaide2.receiveShadow = true; vitrin.add(kaide2);
  const plakaDoku = tuval(1024, 160, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ecd09a'); gr.addColorStop(1, '#a87d43');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#6e4c22'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = '#2a1a0c'; g.font = '600 60px "Cormorant Garamond", Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('YEDİNCİ KAT · ZARLI MACERA', w / 2, h / 2 + 4);
  });
  const plaka = new Mesh(new PlaneGeometry(1.3, 0.2), new MeshStandardMaterial({ map: plakaDoku, metalness: 0.75, roughness: 0.35 }));
  plaka.position.set(0, tabanY - 0.2, (D + 0.34) / 2 + 0.003); vitrin.add(plaka);

  // Kadife zemin
  const kadife = new Mesh(new BoxGeometry(W - 0.04, 0.02, D - 0.04), new MeshStandardMaterial({ color: 0x3a0f0c, roughness: 0.95 }));
  kadife.position.y = tabanY + 0.11; kadife.receiveShadow = true; vitrin.add(kadife);

  // Cam kutu: dört duvar ve tavan ayrı paneller (kalınlıklı cam), pirinç kenarlar
  const t = 0.03, camY = tabanY + 0.1 + H / 2;
  [[0, camY, D / 2, W, H, t], [0, camY, -D / 2, W, H, t], [W / 2, camY, 0, t, H, D], [-W / 2, camY, 0, t, H, D], [0, tabanY + 0.1 + H, 0, W, t, D]]
    .forEach(([x, y, z, w, h, d]) => { const m = new Mesh(new BoxGeometry(w, h, d), cam); m.position.set(x, y, z); m.renderOrder = 2; vitrin.add(m); });
  const kenar = (x, y, z, w, h, d) => { const m = new Mesh(new BoxGeometry(w, h, d), pirinc); m.position.set(x, y, z); m.castShadow = true; vitrin.add(m); };
  const e = 0.045, ust = tabanY + 0.1 + H;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) kenar(sx * W / 2, camY, sz * D / 2, e, H, e);
  for (const sz of [-1, 1]) { kenar(0, ust, sz * D / 2, W + e, e, e); kenar(0, tabanY + 0.1, sz * D / 2, W + e, e, e); }
  for (const sx of [-1, 1]) { kenar(sx * W / 2, ust, 0, e, e, D + e); kenar(sx * W / 2, tabanY + 0.1, 0, e, e, D + e); }
  // Camın yüzeyinde ağır ağır kayan ışık parıltısı (yalnızca görsel; cam MeshPhysicalMaterial ile kırar)
  const parilti = tuval(512, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, 'rgba(255,240,215,0)'); gr.addColorStop(0.42, 'rgba(255,240,215,0)'); gr.addColorStop(0.47, 'rgba(255,240,215,.55)');
    gr.addColorStop(0.5, 'rgba(255,240,215,.15)'); gr.addColorStop(0.55, 'rgba(255,240,215,.4)'); gr.addColorStop(0.6, 'rgba(255,240,215,0)'); gr.addColorStop(1, 'rgba(255,240,215,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  parilti.wrapS = 1000; // RepeatWrapping
  const parM = new MeshBasicMaterial({ map: parilti, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false });
  const parOn = new Mesh(new PlaneGeometry(W - 0.04, H - 0.04), parM); parOn.position.set(0, camY, D / 2 + 0.02); parOn.rotation.z = 0; vitrin.add(parOn);
  const parYan = new Mesh(new PlaneGeometry(D - 0.04, H - 0.04), parM); parYan.position.set(W / 2 + 0.02, camY, 0); parYan.rotation.y = Math.PI / 2; vitrin.add(parYan);
  parilti.repeat.set(0.6, 1);
  // Tavan: ahşap kapak
  const kapakM = new Mesh(new RoundedBoxGeometry(W + 0.14, 0.12, D + 0.14, 2, 0.03), ahsap);
  kapakM.position.y = ust + 0.08; kapakM.castShadow = true; vitrin.add(kapakM);

  // Kitap: kapak görseli önde, sırtta başlık, arkada VII, kenarlarda sayfalar
  const kitapW = 0.92, kitapH = kitapW * 964 / 720, kitapD = 0.17;
  const sayfa = tuval(64, 512, (g, w, h) => { g.fillStyle = '#e6d8b5'; g.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 3) { g.fillStyle = i % 6 ? '#d4c49d' : '#efe3c4'; g.fillRect(i, 0, 1, h); } });
  const sayfaY = tuval(512, 64, (g, w, h) => { g.fillStyle = '#e6d8b5'; g.fillRect(0, 0, w, h); for (let i = 0; i < h; i += 3) { g.fillStyle = i % 6 ? '#d4c49d' : '#efe3c4'; g.fillRect(0, i, w, 1); } });
  const deri = (g, w, h) => { const gr = g.createRadialGradient(w / 2, h * 0.38, 10, w / 2, h / 2, h * 0.7); gr.addColorStop(0, '#2c1f17'); gr.addColorStop(1, '#100a07'); g.fillStyle = gr; g.fillRect(0, 0, w, h); };
  const sirt = tuval(128, 1024, (g, w, h) => {
    deri(g, w, h); g.strokeStyle = '#c9a063'; g.lineWidth = 3; [70, 90, h - 90, h - 70].forEach((y) => { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); });
    g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2); g.fillStyle = '#d8b26e'; g.font = '700 56px "Cormorant Garamond", Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('Y E D İ N C İ   K A T', 0, 2); g.restore();
  });
  const arka = tuval(512, 686, (g, w, h) => {
    deri(g, w, h); g.strokeStyle = 'rgba(201,160,99,.55)'; g.lineWidth = 3; g.strokeRect(22, 22, w - 44, h - 44);
    g.fillStyle = '#c9a063'; g.textAlign = 'center'; g.font = '600 150px "Cormorant Garamond", Georgia, serif'; g.fillText('VII', w / 2, h * 0.47);
    g.fillStyle = '#a39784'; g.font = 'italic 30px "EB Garamond", Georgia, serif';
    g.fillText('Yedi kat aşağıda,', w / 2, h * 0.62); g.fillText('adın ıslak mürekkeple yazılı.', w / 2, h * 0.62 + 40);
  });
  const deriM = (map) => new MeshStandardMaterial({ map, roughness: 0.55, metalness: 0.05 });
  const onM = new MeshStandardMaterial({ color: 0x222222, roughness: 0.42, metalness: 0.05 });
  new TextureLoader().load(kapak, (tx) => { tx.colorSpace = SRGBColorSpace; tx.anisotropy = 8; onM.map = tx; onM.color.set(0xffffff); onM.needsUpdate = true; ciz(); });
  const sayfaM = new MeshStandardMaterial({ map: sayfa, roughness: 0.9 }), sayfaYM = new MeshStandardMaterial({ map: sayfaY, roughness: 0.9 });
  const kitap = new Mesh(new BoxGeometry(kitapW, kitapH, kitapD), [sayfaM, deriM(sirt), sayfaYM, sayfaYM, onM, deriM(arka)]);
  kitap.castShadow = true;
  const kitapGrup = new Group(); kitapGrup.add(kitap); kitapGrup.position.y = tabanY + 0.1 + 0.18 + kitapH / 2; vitrin.add(kitapGrup);
  // Küçük pirinç ayak
  const ayak = new Mesh(new CylinderGeometry(0.2, 0.26, 0.16, 32), pirinc); ayak.position.y = tabanY + 0.19; ayak.castShadow = true; ayak.receiveShadow = true; vitrin.add(ayak);

  // Kül zerreleri: camın içinde yavaşça yükselir
  const N = 70, konum = new Float32Array(N * 3), hiz = new Float32Array(N);
  for (let i = 0; i < N; i++) { konum[i * 3] = (Math.random() - 0.5) * (W - 0.2); konum[i * 3 + 1] = tabanY + Math.random() * H; konum[i * 3 + 2] = (Math.random() - 0.5) * (D - 0.2); hiz[i] = 0.05 + Math.random() * 0.12; }
  const kulG = new BufferGeometry(); kulG.setAttribute('position', new Float32BufferAttribute(konum, 3));
  const kul = new Points(kulG, new PointsMaterial({ color: 0xffd9a0, size: 0.022, transparent: true, opacity: 0.7, depthWrite: false, blending: AdditiveBlending }));
  vitrin.add(kul);

  // Boyut
  function boyut() {
    const r = kutu.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    kamera.aspect = r.width / r.height;
    kamera.position.z = kamera.aspect < 0.8 ? 9.2 : 7.6;
    kamera.updateProjectionMatrix(); ciz();
  }
  // Fare: vitrin hafifçe izler; üstündeyken kitap yavaşlar
  const hedef = new Vector2(), simdi = new Vector2(); let ustunde = false;
  kutu.addEventListener('pointermove', (ev) => { const r = kutu.getBoundingClientRect(); hedef.set((ev.clientX - r.left) / r.width - 0.5, (ev.clientY - r.top) / r.height - 0.5); ustunde = true; });
  kutu.addEventListener('pointerleave', () => { hedef.set(0, 0); ustunde = false; });

  let aci = -0.45, hizKitap = 0.32, gorunur = false, son = performance.now(), dongu = 0;
  function ciz() { renderer.render(sahne, kamera); }
  function kare(zaman) {
    dongu = 0;
    const dt = Math.min((zaman - son) / 1000, 0.05); son = zaman;
    hizKitap += ((ustunde ? 0.08 : 0.32) - hizKitap) * 0.05;
    aci += dt * hizKitap; kitap.rotation.y = aci;
    kitapGrup.position.y = tabanY + 0.1 + 0.2 + kitapH / 2 + Math.sin(zaman / 1400) * 0.025;
    parilti.offset.x = (zaman / 9000) % 1;
    simdi.lerp(hedef, 0.06);
    vitrin.rotation.y = -0.32 + simdi.x * 0.5; vitrin.rotation.x = simdi.y * 0.12;
    const p = kulG.attributes.position.array;
    for (let i = 0; i < N; i++) { p[i * 3 + 1] += hiz[i] * dt; p[i * 3] += Math.sin(zaman / 900 + i) * 0.0006; if (p[i * 3 + 1] > tabanY + H) p[i * 3 + 1] = tabanY + 0.15; }
    kulG.attributes.position.needsUpdate = true;
    ciz();
    if (gorunur && !document.hidden) dongu = requestAnimationFrame(kare);
  }
  function oynat() { if (azHareket || dongu || !gorunur || document.hidden) return; son = performance.now(); dongu = requestAnimationFrame(kare); }

  if (azHareket) { kitap.rotation.y = -0.45; vitrin.rotation.y = -0.32; kul.visible = false; }
  new ResizeObserver(boyut).observe(kutu);
  new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; if (gorunur) oynat(); }, { rootMargin: '100px' }).observe(kutu);
  document.addEventListener('visibilitychange', oynat);
  boyut();
  kutu.classList.add('hazir'); // yedek görsel gizlenir
}
