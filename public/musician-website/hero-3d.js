/* ==========================================================
   Hero — 3D stage: grand piano & violin playing Pachelbel's Canon

   Everything is modelled procedurally with Three.js (no model files):
   lacquered grand piano with open lid, gold plate, strings and 88 keys;
   varnished violin with a bow that actually bows the strings.
   Stage lighting, volumetric beam, dust, bloom. Optional Web Audio.
   ========================================================== */
// Loaded as a classic script so the page also works when opened from disk (file://);
// Three.js comes from the CDN through the import map in <head>.
(async () => {
const mount = document.querySelector(".hero-3d");
function webgl() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch (_) { return false; }
}
if (!mount || !webgl()) return;

let THREE, RoomEnvironment, RoundedBoxGeometry, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;
try {
  const addon = (p) => import(`three/addons/${p}.js`);
  THREE = await import("three");
  [{ RoomEnvironment }, { RoundedBoxGeometry }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
    addon("environments/RoomEnvironment"), addon("geometries/RoundedBoxGeometry"), addon("postprocessing/EffectComposer"),
    addon("postprocessing/RenderPass"), addon("postprocessing/UnrealBloomPass"), addon("postprocessing/OutputPass"),
  ]);
} catch (err) {
  console.warn("3D stage unavailable:", err);
  return;
}

const hero = document.querySelector(".hero");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = matchMedia("(pointer: coarse)").matches || Math.min(innerWidth, innerHeight) < 700;

const V2 = THREE.Vector2, V3 = THREE.Vector3;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const easeInOut = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);


/* ==========================================================
   Procedural textures
   ========================================================== */
function canvasTex(w, h, paint, { repeat = 1, srgb = true } = {}) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  paint(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  return tex;
}

// wood grain: wavy fibres over a base colour
function woodTex(base, dark, light, { fibres = 260, warp = 6, repeat = 1 } = {}) {
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < fibres; i++) {
      const x0 = Math.random() * w, ph = Math.random() * 6.28, a = 0.04 + Math.random() * 0.16;
      g.strokeStyle = (Math.random() < 0.7 ? dark : light).replace("A", a.toFixed(2));
      g.lineWidth = 0.6 + Math.random() * 2.4;
      g.beginPath();
      for (let y = 0; y <= h; y += 16) {
        const x = x0 + Math.sin(y * 0.006 + ph) * warp + Math.sin(y * 0.031 + ph * 2) * warp * 0.3;
        y ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
  }, { repeat });
}

function sheetMusicTex() {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = "#f4ecdb"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(0,0,0,0.05)"; g.fillRect(w / 2 - 3, 0, 6, h);
    g.strokeStyle = "#2a241c"; g.fillStyle = "#2a241c";
    for (let page = 0; page < 2; page++) {
      const x0 = page * w / 2 + 40, x1 = x0 + w / 2 - 80;
      for (let s = 0; s < 6; s++) {
        const y0 = 60 + s * 72;
        g.lineWidth = 1.2;
        for (let l = 0; l < 5; l++) { g.beginPath(); g.moveTo(x0, y0 + l * 7); g.lineTo(x1, y0 + l * 7); g.stroke(); }
        for (let b = 0; b <= 4; b++) { const bx = x0 + (b * (x1 - x0)) / 4; g.beginPath(); g.moveTo(bx, y0); g.lineTo(bx, y0 + 28); g.stroke(); }
        for (let n = 0; n < 16; n++) {
          const nx = x0 + 18 + n * ((x1 - x0 - 30) / 16), ny = y0 + 28 - Math.floor(Math.random() * 9) * 3.5;
          g.beginPath(); g.ellipse(nx, ny, 4, 3, -0.4, 0, 6.28); g.fill();
          g.beginPath(); g.moveTo(nx + 3.6, ny); g.lineTo(nx + 3.6, ny - 22); g.stroke();
        }
      }
    }
  });
}

const dotTex = () => canvasTex(64, 64, (g) => {
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,0.5)"); r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
});

/* ==========================================================
   Geometry helpers
   ========================================================== */
function add(parent, geo, mat, { pos, rot, cast = true, receive = false } = {}) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = cast; m.receiveShadow = receive;
  parent.add(m);
  return m;
}
function rod(parent, a, b, r, mat, seg = 10) {
  const dir = new V3().subVectors(b, a), len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir.normalize());
  m.castShadow = true;
  parent.add(m);
  return m;
}
// lay a 2D (x, depth) shape flat and extrude it upwards
function slab(shape, depth, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, steps: 1, curveSegments: 24,
    bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3,
  });
  g.rotateX(-Math.PI / 2);
  return g;
}
// inward offset of a counter-clockwise polygon
function inset(pts, d) {
  const n = pts.length;
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const e1 = new V2(p.x - a.x, p.y - a.y).normalize(), e2 = new V2(b.x - p.x, b.y - p.y).normalize();
    const nrm = new V2(-(e1.y + e2.y), e1.x + e2.x).normalize();
    return new V2(p.x + nrm.x * d, p.y + nrm.y * d);
  });
}
function ccw(pts) {
  if (THREE.ShapeUtils.isClockWise(pts)) pts.reverse();
  return pts;
}
// deepest point of a polygon along a vertical line x
function depthAt(pts, x) {
  let best = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) best = Math.max(best, a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y));
  }
  return best;
}

/* ==========================================================
   Materials
   ========================================================== */
function materials() {
  const P = (o) => new THREE.MeshPhysicalMaterial(o);
  return {
    lacquer: P({ color: 0x050505, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.03 }),
    lacquerInner: P({ color: 0x080808, roughness: 0.3, clearcoat: 0.6 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xc89f55, metalness: 1, roughness: 0.3 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xd8b26a, metalness: 1, roughness: 0.22 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd6d6d6, metalness: 1, roughness: 0.2 }),
    spruce: new THREE.MeshStandardMaterial({ map: woodTex("#d7a96a", "rgba(120,70,30,A)", "rgba(255,230,180,A)", { repeat: 1.2, warp: 3 }), roughness: 0.55 }),
    felt: new THREE.MeshStandardMaterial({ color: 0x5e1414, roughness: 1 }),
    ivory: P({ color: 0xf3eee3, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.2 }),
    ebonyKey: P({ color: 0x0a0a0a, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.1 }),
    // violin
    varnish: P({
      map: woodTex("#8e3d12", "rgba(50,15,0,A)", "rgba(230,140,60,A)", { fibres: 320, warp: 2.5, repeat: 1 / 120 }),
      roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.3, sheenColor: new THREE.Color(0xffb070),
    }),
    ebony: P({ color: 0x0b0806, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.15 }),
    maple: new THREE.MeshStandardMaterial({ color: 0xe2c592, roughness: 0.6 }),
    purfling: new THREE.MeshBasicMaterial({ color: 0x120804 }),
    hole: new THREE.MeshBasicMaterial({ color: 0x050200 }),
    string: new THREE.MeshStandardMaterial({ color: 0xe8e0cc, metalness: 0.85, roughness: 0.25 }),
    stick: P({ color: 0x4a1d0b, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.1 }),
    hair: new THREE.MeshStandardMaterial({ color: 0xf2ebda, roughness: 0.85 }),
    pearl: P({ color: 0xf6f1ea, roughness: 0.15, clearcoat: 1, iridescence: 0.8, iridescenceIOR: 1.6 }),
  };
}

/* ==========================================================
   Grand piano (metres; keyboard front at z = 0, tail towards -z)
   ========================================================== */
function buildPiano(mat, logoTex) {
  const piano = new THREE.Group();
  const HW = 0.74;

  // top-view outline: straight bass side (left), curved bentside and tail (right/back)
  const outline = new THREE.Shape();
  outline.moveTo(-HW, 0); outline.lineTo(HW, 0); outline.lineTo(HW, 0.38);
  outline.bezierCurveTo(HW, 0.78, 0.38, 0.8, 0.22, 1.08);
  outline.bezierCurveTo(0.08, 1.34, 0.02, 1.62, -0.36, 1.62);
  outline.bezierCurveTo(-0.62, 1.62, -HW, 1.52, -HW, 1.32);
  outline.lineTo(-HW, 0);
  const outer = ccw(outline.getSpacedPoints(260).slice(0, -1));
  const inner = inset(outer, 0.035);
  const plateOutline = inset(outer, 0.06);

  // rim (a shell), bottom, soundboard
  const rimShape = new THREE.Shape(outer);
  rimShape.holes.push(new THREE.Path(inner));
  add(piano, slab(rimShape, 0.34, 0.006), mat.lacquer, { pos: [0, 0.615, 0] });
  add(piano, slab(new THREE.Shape(outer), 0.03), mat.lacquer, { pos: [0, 0.585, 0] });
  add(piano, slab(new THREE.Shape(inner), 0.008), mat.spruce, { pos: [0, 0.8, 0], receive: true });

  // gold cast-iron plate with its round openings
  const plate = new THREE.Shape(plateOutline);
  [[-0.3, 0.55, 0.09], [0.1, 0.5, 0.08], [-0.35, 1.0, 0.1], [0.0, 0.9, 0.07], [-0.52, 0.3, 0.06], [0.32, 0.25, 0.05]]
    .forEach(([x, y, r]) => plate.holes.push(new THREE.Path().absarc(x, y, r, 0, Math.PI * 2, true)));
  add(piano, slab(plate, 0.012, 0.003), mat.gold, { pos: [0, 0.835, 0], receive: true });

  // strings: copper-wound bass, steel treble, plus tuning pins and the damper rail
  const N = 72, sPos = [], sCol = [];
  const copper = new THREE.Color(0xb8743a), steelC = new THREE.Color(0xd9d9d9);
  for (let i = 0; i < N; i++) {
    const x = -0.66 + (i * 1.3) / (N - 1);
    const back = depthAt(inner, x) - 0.07;
    if (back < 0.3) continue;
    sPos.push(x, 0.863, -0.14, x, 0.863, -back);
    const c = i < 18 ? copper : steelC;
    sCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute("position", new THREE.Float32BufferAttribute(sPos, 3));
  sGeo.setAttribute("color", new THREE.Float32BufferAttribute(sCol, 3));
  piano.add(new THREE.LineSegments(sGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 })));

  const pins = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.022, 8), mat.steel, N * 2);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < N * 2; i++) {
    m4.makeTranslation(-0.66 + ((i >> 1) * 1.3) / (N - 1) + (i & 1) * 0.006, 0.868, -0.1 - (i & 1) * 0.022);
    pins.setMatrixAt(i, m4);
  }
  pins.castShadow = true;
  piano.add(pins);
  add(piano, new THREE.BoxGeometry(1.28, 0.03, 0.05), mat.lacquerInner, { pos: [0, 0.885, -0.22] });
  add(piano, new THREE.BoxGeometry(1.28, 0.008, 0.04), mat.felt, { pos: [0, 0.868, -0.22] });

  // lid on its hinge (bass side), with the prop stick
  const lidPivot = new THREE.Group();
  lidPivot.position.set(-HW, 0.963, 0);
  lidPivot.rotation.z = 0.5;
  piano.add(lidPivot);
  add(lidPivot, slab(new THREE.Shape(outer), 0.016, 0.004), mat.lacquer, { pos: [HW, 0, 0] });
  const a = 0.5, d = 1.12;
  rod(piano, new V3(0.5, 0.963, -0.62), new V3(-HW + d * Math.cos(a), 0.963 + d * Math.sin(a) - 0.01, -0.62), 0.011, mat.lacquer);

  // keyboard: 88 keys from A0, pivoting at the back like real keys
  const KW = 1.222, wW = KW / 52;
  const whiteGeo = new RoundedBoxGeometry(wW - 0.0013, 0.022, 0.148, 2, 0.0018);
  const blackGeo = new RoundedBoxGeometry(0.0118, 0.02, 0.094, 2, 0.0018);
  const keys = new Map();
  let white = 0;
  for (let midi = 21; midi <= 108; midi++) {
    const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
    const pivot = new THREE.Group();
    const m = (isBlack ? mat.ebonyKey : mat.ivory).clone();
    const key = add(pivot, isBlack ? blackGeo : whiteGeo, m, { pos: isBlack ? [0, 0.01, 0.047] : [0, 0.011, 0.074], receive: true });
    if (isBlack) pivot.position.set(-KW / 2 + white * wW, 0.714, 0.004);
    else { pivot.position.set(-KW / 2 + (white + 0.5) * wW, 0.698, 0.002); white++; }
    key.userData.midi = midi;
    piano.add(pivot);
    keys.set(midi, { pivot, mesh: key, mat: m, press: 0, hold: 0, black: isBlack });
  }

  // keybed, key slip, cheek blocks, fallboard with the gold logo
  add(piano, new THREE.BoxGeometry(1.48, 0.04, 0.2), mat.lacquer, { pos: [0, 0.675, 0.09] });
  add(piano, new RoundedBoxGeometry(1.48, 0.032, 0.022, 2, 0.004), mat.lacquer, { pos: [0, 0.7, 0.168] });
  [-1, 1].forEach((s) => add(piano, new RoundedBoxGeometry(0.12, 0.09, 0.21, 3, 0.012), mat.lacquer, { pos: [s * (KW / 2 + 0.06), 0.722, 0.08] }));
  add(piano, new RoundedBoxGeometry(KW, 0.095, 0.022, 2, 0.004), mat.lacquer, { pos: [0, 0.78, -0.004], rot: [-0.12, 0, 0] });
  if (logoTex) {
    const logoMat = new THREE.MeshStandardMaterial({ color: 0xd9b56e, metalness: 1, roughness: 0.25, map: logoTex, transparent: true, alphaTest: 0.05 });
    add(piano, new THREE.PlaneGeometry(0.27, 0.27 / 3.38), logoMat, { pos: [0, 0.785, 0.0085], rot: [-0.12, 0, 0], cast: false });
  }

  // music desk with an open score
  const desk = new THREE.Group();
  desk.position.set(0, 1.1, -0.17);
  desk.rotation.x = -0.28;
  piano.add(desk);
  add(desk, new RoundedBoxGeometry(0.84, 0.27, 0.016, 2, 0.004), mat.lacquer);
  add(desk, new THREE.BoxGeometry(0.84, 0.02, 0.04), mat.lacquer, { pos: [0, -0.13, 0.02] });
  add(desk, new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshStandardMaterial({ map: sheetMusicTex(), roughness: 0.9 }), { pos: [0, 0.005, 0.0095], cast: false });

  // legs with brass casters, pedal lyre
  [[-0.62, -0.09], [0.62, -0.09], [-0.36, -1.36]].forEach(([x, z]) => {
    add(piano, new THREE.CylinderGeometry(0.05, 0.034, 0.53, 32), mat.lacquer, { pos: [x, 0.33, z] });
    add(piano, new RoundedBoxGeometry(0.13, 0.05, 0.13, 2, 0.01), mat.lacquer, { pos: [x, 0.585, z] });
    add(piano, new THREE.CylinderGeometry(0.036, 0.04, 0.03, 24), mat.brass, { pos: [x, 0.055, z] });
    add(piano, new THREE.SphereGeometry(0.028, 20, 12), mat.brass, { pos: [x, 0.028, z] });
  });
  const lyre = new THREE.Group();
  lyre.position.set(0, 0, -0.34);
  piano.add(lyre);
  [-1, 1].forEach((s) => add(lyre, new RoundedBoxGeometry(0.024, 0.46, 0.07, 2, 0.006), mat.lacquer, { pos: [s * 0.09, 0.36, 0] }));
  add(lyre, new RoundedBoxGeometry(0.26, 0.03, 0.08, 2, 0.006), mat.lacquer, { pos: [0, 0.59, 0] });
  add(lyre, new RoundedBoxGeometry(0.3, 0.05, 0.12, 2, 0.008), mat.lacquer, { pos: [0, 0.11, 0] });
  [-0.04, 0, 0.04].forEach((x) => rod(lyre, new V3(x, 0.14, 0), new V3(x, 0.57, 0), 0.0035, mat.brass));
  [-0.06, 0, 0.06].forEach((x) => add(lyre, new RoundedBoxGeometry(0.024, 0.012, 0.11, 2, 0.004), mat.brass, { pos: [x, 0.09, 0.1] }));

  return { piano, keys };
}

/* ==========================================================
   Violin (millimetres; scroll up +Y, top plate facing +Z)
   ========================================================== */
function buildViolin(mat) {
  const violin = new THREE.Group();

  // half outline (mirrored), from the 2D drawing
  const HALF = [
    [[34, 0], [76, 6], [84, 34]], [[90, 56], [84, 82], [74, 96]], [[70, 102], [70, 106], [75, 110]],
    [[56, 112], [48, 132], [48, 150]], [[48, 168], [56, 186], [75, 190]], [[70, 194], [70, 198], [77, 204]],
    [[95, 218], [104, 240], [104, 266]], [[104, 318], [64, 352], [0, 352]],
  ];
  const body = new THREE.Shape();
  body.moveTo(0, 0);
  HALF.forEach(([a, b, p]) => body.bezierCurveTo(a[0], -a[1], b[0], -b[1], p[0], -p[1]));
  const pts = [[0, 0], ...HALF.map((s) => s[2])];
  for (let i = HALF.length - 1; i >= 0; i--) {
    const [a, b] = HALF[i], p = pts[i];
    body.bezierCurveTo(-b[0], -b[1], -a[0], -a[1], -p[0], -p[1]);
  }
  const TOP = 35;
  add(violin, new THREE.ExtrudeGeometry(body, { depth: 28, bevelEnabled: true, bevelThickness: 7, bevelSize: 5, bevelSegments: 8, curveSegments: 40 }), mat.varnish);

  // purfling inlay
  const rim = ccw(body.getSpacedPoints(320).slice(0, -1));
  const purf = new THREE.Shape(inset(rim, 3.4));
  purf.holes.push(new THREE.Path(inset(rim, 4.6)));
  add(violin, new THREE.ShapeGeometry(purf), mat.purfling, { pos: [0, 0, TOP + 0.15], cast: false });

  // f-holes
  [1, -1].forEach((s) => {
    const c = new THREE.CubicBezierCurve(new V2(28 * s, -151), new V2(40 * s, -172), new V2(24 * s, -206), new V2(42 * s, -232));
    const p = c.getSpacedPoints(40);
    const left = [], right = [];
    p.forEach((q, i) => {
      const tng = c.getTangentAt(i / 40), w = 1.3 * Math.sin(Math.PI * (0.15 + 0.7 * (i / 40)));
      left.push(new V2(q.x - tng.y * w, q.y + tng.x * w));
      right.push(new V2(q.x + tng.y * w, q.y - tng.x * w));
    });
    add(violin, new THREE.ShapeGeometry(new THREE.Shape([...left, ...right.reverse()])), mat.hole, { pos: [0, 0, TOP + 0.2], cast: false });
    add(violin, new THREE.CircleGeometry(2.8, 20), mat.hole, { pos: [28 * s, -151, TOP + 0.2], cast: false });
    add(violin, new THREE.CircleGeometry(3.4, 20), mat.hole, { pos: [42 * s, -232, TOP + 0.2], cast: false });
  });

  // neck, fingerboard, nut, pegbox, scroll, pegs
  add(violin, new RoundedBoxGeometry(24, 132, 22, 3, 5), mat.varnish, { pos: [0, 64, 35] });
  const fb = new THREE.Shape([new V2(-12, 130), new V2(12, 130), new V2(21, -140), new V2(-21, -140)]);
  add(violin, new THREE.ExtrudeGeometry(fb, { depth: 6, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelSegments: 2 }), mat.ebony, { pos: [0, 0, 46] });
  add(violin, new THREE.BoxGeometry(25, 4, 6), mat.ebony, { pos: [0, 130, 51] });
  add(violin, new RoundedBoxGeometry(22, 54, 26, 3, 4), mat.varnish, { pos: [0, 156, 33] });
  const spiral = [];
  for (let i = 0; i <= 120; i++) {
    const k = i / 120, th = -Math.PI / 2 + k * Math.PI * 4.4, r = 16 * (1 - 0.78 * k);
    spiral.push(new V3(0, 198 + r * Math.sin(th), 33 - r * Math.cos(th)));
  }
  add(violin, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spiral), 160, 6.5, 14), mat.varnish);
  for (let k = 0; k < 4; k++) {
    const y = 140 + k * 12, s = k % 2 ? -1 : 1;
    rod(violin, new V3(-12 * s, y, 33), new V3(22 * s, y, 33), 2.4, mat.ebony);
    add(violin, new THREE.SphereGeometry(8, 20, 14), mat.ebony, { pos: [27 * s, y, 33] }).scale.set(0.35, 1, 0.8);
  }

  // bridge (maple), tailpiece, fine tuner, chinrest, end button
  const br = new THREE.Shape();
  br.moveTo(-21, 0); br.lineTo(-14, 0); br.quadraticCurveTo(0, 10, 14, 0); br.lineTo(21, 0);
  br.lineTo(19, 27); br.quadraticCurveTo(0, 35, -19, 27); br.closePath();
  const brGeo = new THREE.ExtrudeGeometry(br, { depth: 4, bevelEnabled: false });
  brGeo.rotateX(Math.PI / 2);
  add(violin, brGeo, mat.maple, { pos: [0, -186, TOP] });
  const tp = new THREE.Shape([new V2(-11, -224), new V2(11, -224), new V2(16, -310), new V2(0, -316), new V2(-16, -310)]);
  add(violin, new THREE.ExtrudeGeometry(tp, { depth: 5, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1.5, bevelSegments: 3 }), mat.ebony, { pos: [0, 0, 38] });
  rod(violin, new V3(9, -238, 44), new V3(9, -238, 51), 2.6, mat.steel);
  const cr = new THREE.Shape();
  cr.moveTo(-18, -334); cr.bezierCurveTo(-40, -342, -68, -328, -66, -306); cr.bezierCurveTo(-64, -292, -46, -290, -32, -304); cr.bezierCurveTo(-24, -314, -20, -324, -18, -334);
  add(violin, new THREE.ExtrudeGeometry(cr, { depth: 9, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 4 }), mat.ebony, { pos: [0, 0, TOP] });
  rod(violin, new V3(0, -350, 14), new V3(0, -362, 14), 3.6, mat.ebony);

  // strings: nut → bridge → tailpiece (G D A E)
  const NUT_X = [-7.5, -2.5, 2.5, 7.5], BR_X = [-16, -5.5, 5.5, 16], TAIL_X = [-9, -3, 3, 9];
  const brZ = (x) => TOP + 27 + 4 * (1 - (x / 19) ** 2);
  const strings = NUT_X.map((nx, i) => {
    const a = new V3(nx, 130, 53), b = new V3(BR_X[i], -186, brZ(BR_X[i])), c = new V3(TAIL_X[i], -232, 45);
    const m = mat.string.clone();
    rod(violin, b, c, 0.45, m, 6);
    return { mesh: rod(violin, a, b, 0.5, m, 6), mat: m };
  });

  // bow: tapered stick, frog with pearl eye, hair ribbon; slides along its own axis
  const Y_CONTACT = -164;
  const frac = (130 - Y_CONTACT) / (130 + 186);
  const contactX = NUT_X.map((n, i) => lerp(n, BR_X[i], frac));
  const contactZ = NUT_X.map((_, i) => lerp(53, brZ(BR_X[i]), frac) + 1.4);
  const bowPivot = new THREE.Group();
  bowPivot.position.set(contactX[2], Y_CONTACT, contactZ[2]);
  violin.add(bowPivot);
  const bowSlide = new THREE.Group();
  bowPivot.add(bowSlide);
  add(bowSlide, new THREE.BoxGeometry(664, 10, 0.9), mat.hair, { pos: [-20, 0, 0] });
  add(bowSlide, new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new V3(-352, 0, 17), new V3(-10, 0, 9), new V3(318, 0, 15)), 80, 3.4, 10), mat.stick);
  add(bowSlide, new RoundedBoxGeometry(38, 11, 19, 2, 2), mat.ebony, { pos: [-333, 0, 9] });
  rod(bowSlide, new V3(-333, -6, 9), new V3(-333, 6, 9), 2.6, mat.pearl, 16);
  add(bowSlide, new THREE.BoxGeometry(4, 11.4, 9), mat.steel, { pos: [-313, 0, 4] });
  rod(bowSlide, new V3(-352, 0, 17), new V3(-368, 0, 17), 3.4, mat.steel, 12);
  add(bowSlide, new RoundedBoxGeometry(11, 9, 20, 2, 2), mat.stick, { pos: [318, 0, 8] });
  add(bowSlide, new THREE.BoxGeometry(1.6, 9.4, 20), mat.pearl, { pos: [324, 0, 8] });

  violin.traverse((o) => o.isMesh && (o.castShadow = true));
  return { violin, bowPivot, bowSlide, strings, contactX, contactZ };
}

/* ==========================================================
   Score — Canon in D (bass, arpeggios, violin melody)
   ========================================================== */
const STEP = 0.3, CHORD_STEPS = 4;
const CHORDS = [[62, 66, 69, 74], [64, 69, 73, 76], [62, 66, 71, 74], [61, 66, 69, 73], [62, 67, 71, 74], [62, 66, 69, 74], [67, 71, 74, 79], [64, 69, 73, 76]];
const BASS = [38, 45, 47, 42, 43, 38, 43, 45];
const MELODY_A = [78, 76, 74, 73, 71, 69, 71, 73];
const MELODY_B = [74, 78, 81, 79, 78, 74, 78, 76, 74, 71, 74, 81, 79, 83, 81, 79];
const LOOP = 16 * CHORD_STEPS;
const byStep = Array.from({ length: LOOP }, () => []);
for (let c = 0; c < 16; c++) {
  const at = c * CHORD_STEPS, ch = CHORDS[c % 8], order = c < 8 ? [0, 1, 2, 3] : [0, 2, 1, 3];
  byStep[at].push({ kind: "piano", midi: BASS[c % 8], dur: 4, vel: 0.26 });
  byStep[at].push({ kind: "piano", midi: BASS[c % 8] + 12, dur: 4, vel: 0.12 });
  order.forEach((k, i) => byStep[at + i].push({ kind: "piano", midi: ch[k], dur: 1, vel: i ? 0.12 : 0.16 }));
  if (c < 8) byStep[at].push({ kind: "violin", midi: MELODY_A[c], dur: 4 });
  else {
    byStep[at].push({ kind: "violin", midi: MELODY_B[(c - 8) * 2], dur: 2 });
    byStep[at + 2].push({ kind: "violin", midi: MELODY_B[(c - 8) * 2 + 1], dur: 2 });
  }
}
const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const stringFor = (m) => (m >= 76 ? 3 : m >= 69 ? 2 : m >= 62 ? 1 : 0);

/* ==========================================================
   Audio (built on first user gesture)
   ========================================================== */
function createAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ac = new AC();
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 3;
  const master = ac.createGain(); master.gain.value = 0.7;
  master.connect(comp).connect(ac.destination);

  const len = ac.sampleRate * 2.8, ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
  }
  const verb = ac.createConvolver(); verb.buffer = ir;
  const wet = ac.createGain(); wet.gain.value = 0.32;
  verb.connect(wet).connect(master);
  const noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  function out(node, pan) {
    let n = node;
    if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; n.connect(p); n = p; }
    n.connect(master);
    const send = ac.createGain(); send.gain.value = 0.9;
    n.connect(send).connect(verb);
  }

  function piano(when, midi, vel) {
    const f = freq(midi), decay = clamp(2.6 + (64 - midi) * 0.05, 1.6, 4.5);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(9000, f * 14), when);
    lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 3), when + 1.4);
    const env = ac.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(vel, when + 0.004);
    env.gain.exponentialRampToValueAtTime(vel * 0.45, when + 0.3);
    env.gain.exponentialRampToValueAtTime(0.0004, when + decay);
    lp.connect(env);
    out(env, clamp((midi - 64) / 36, -0.6, 0.6));
    [[1, "sine", 1], [1.0015, "triangle", 0.35], [2.003, "sine", 0.32], [3.008, "sine", 0.11], [4.016, "sine", 0.05]].forEach(([r, type, lvl]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = f * r; g.gain.value = lvl;
      o.connect(g).connect(lp); o.start(when); o.stop(when + decay + 0.05);
    });
  }

  function violin(when, midi, dur) {
    const f = freq(midi), end = when + dur;
    const env = ac.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(0.06, when + 0.16);
    env.gain.linearRampToValueAtTime(0.075, when + dur * 0.55);
    env.gain.linearRampToValueAtTime(0.055, end - 0.06);
    env.gain.linearRampToValueAtTime(0, end + 0.14);
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 190;
    const chain = [hp];
    [[290, 4, 1.2], [1100, 5, 1.4], [2900, 4, 1.6]].forEach(([fr, gain, q]) => {
      const b = ac.createBiquadFilter(); b.type = "peaking"; b.frequency.value = fr; b.gain.value = gain; b.Q.value = q; chain.push(b);
    });
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 5200; chain.push(lp);
    chain.reduce((a, b) => (a.connect(b), b));
    lp.connect(env);
    out(env, 0.25);
    const vib = ac.createOscillator(), depth = ac.createGain();
    vib.frequency.value = 5.6;
    depth.gain.setValueAtTime(0, when);
    depth.gain.linearRampToValueAtTime(f * 0.0055, when + 0.35);
    vib.connect(depth);
    [-5, 5].forEach((cents) => {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = cents;
      depth.connect(o.frequency); o.connect(hp); o.start(when); o.stop(end + 0.2);
    });
    vib.start(when); vib.stop(end + 0.2);
    const n = ac.createBufferSource(); n.buffer = noise;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600; bp.Q.value = 0.8;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.025, when);
    ng.gain.exponentialRampToValueAtTime(0.003, when + 0.25);
    ng.gain.linearRampToValueAtTime(0, end);
    n.connect(bp).connect(ng).connect(env);
    n.start(when); n.stop(end);
  }

  return { ac, piano, violin };
}

/* ==========================================================
   Stage
   ========================================================== */
function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.fog = new THREE.Fog(0x000000, 6, 13);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
  const mat = materials();

  const logoTex = new THREE.TextureLoader().load("Asserts/logo.png");
  logoTex.colorSpace = THREE.SRGBColorSpace;
  logoTex.anisotropy = 8;
  const { piano, keys } = buildPiano(mat, logoTex);
  scene.add(piano);

  const V = buildViolin(mat);
  const violinRig = new THREE.Group();
  violinRig.add(V.violin);
  V.violin.scale.setScalar(0.00118);
  V.violin.position.y = 0.2;           // pivot near the body centre
  scene.add(violinRig);

  // floor
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.55 });
  add(scene, new THREE.CircleGeometry(16, 72), floorMat, { rot: [-Math.PI / 2, 0, 0], cast: false, receive: true });

  // lights: a warm stage spot, a cool rim, a soft fill
  const spot = new THREE.SpotLight(0xffe2bd, 0, 0, 0.42, 0.75, 2);
  spot.position.set(0.7, 5.4, 1.7);
  spot.target.position.set(0.15, 0.8, -0.45);
  spot.castShadow = true;
  spot.shadow.mapSize.setScalar(small ? 1024 : 2048);
  spot.shadow.bias = -0.0001;
  spot.shadow.normalBias = 0.02;
  spot.shadow.camera.near = 2; spot.shadow.camera.far = 9;
  scene.add(spot, spot.target);
  const rim = new THREE.DirectionalLight(0xa9bcff, 0);
  rim.position.set(-3, 3, -4);
  scene.add(rim);
  const hemi = new THREE.HemisphereLight(0xfff6ea, 0x1a1712, 0);
  scene.add(hemi);

  // volumetric beam from the spot down to the floor
  const beamDir = new V3().subVectors(spot.position, spot.target.position).normalize();
  const beamLen = spot.position.y / beamDir.y;
  const beamGeo = new THREE.ConeGeometry(Math.tan(0.42) * beamLen, beamLen, 64, 1, true);
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(0xffd9a8) }, uOpacity: { value: 0 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ float edge = pow(abs(dot(vN, vV)), 2.0);
        float a = (0.25 + 0.75 * pow(vUv.y, 1.8)) * edge * uOpacity;
        gl_FragColor = vec4(uColor, a); }`,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.copy(spot.position).addScaledVector(beamDir, -beamLen / 2);
  beam.quaternion.setFromUnitVectors(new V3(0, 1, 0), beamDir);
  scene.add(beam);

  // dust drifting in the light
  const DUST = small ? 220 : 480, dpos = new Float32Array(DUST * 3), dvel = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    const r = Math.sqrt(Math.random()) * 1.3, a = Math.random() * 6.28;
    dpos.set([0.15 + r * Math.cos(a), Math.random() * 3.4, -0.45 + r * Math.sin(a)], i * 3);
    dvel[i] = 0.02 + Math.random() * 0.05;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.014, map: dotTex(), color: 0xffe0b0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(dustGeo, dustMat));

  // post-processing (desktop): gentle bloom on highlights
  let composer = null, bloom = null;
  if (!small) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new V2(1, 1), 0.35, 0.6, 0.82);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  /* ---------- Themes ---------- */
  const THEMES = {
    dark:  { bg: 0x000000, floor: 0x0b0b0b, fog: [0.8, 7.8], spot: 170, rim: 1.2, hemi: 0.05, env: 0.45, exposure: 1.0, bloom: 0.38, beam: 0.09, dust: 0.85 },
    light: { bg: 0xefe7da, floor: 0xe9e0d0, fog: [1.8, 9.8], spot: 60, rim: 0.4, hemi: 1.6, env: 0.95, exposure: 0.9, bloom: 0.08, beam: 0, dust: 0 },
  };
  let theme = THEMES.dark;
  function applyTheme() {
    theme = THEMES[document.documentElement.dataset.theme === "light" ? "light" : "dark"];
    scene.background = new THREE.Color(theme.bg);
    scene.fog.color.set(theme.bg);
    floorMat.color.set(theme.floor);
    scene.environmentIntensity = theme.env;
    renderer.toneMappingExposure = theme.exposure;
    if (bloom) bloom.strength = theme.bloom;
    if (!running) render();
  }
  new MutationObserver(() => { applyTheme(); frame(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "dir"] });

  /* ---------- Camera framing ---------- */
  // The stage is placed in whatever space the copy leaves free (beside it on wide
  // screens, above it when stacked), and the camera backs off until the scene fits.
  const target = new V3(0.12, 0.88, -0.5);
  const SCENE_W = 1.95, SCENE_H = 1.9;  // on-screen size of piano + violin, in metres (measured)
  const copy = document.querySelector(".hero-copy");
  let baseRadius = 5.2;
  function frame() {
    const w = mount.clientWidth, h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    if (composer) composer.setSize(w, h);

    const m = mount.getBoundingClientRect(), c = copy.getBoundingClientRect();
    const rtl = document.documentElement.dir === "rtl";
    const stacked = innerWidth <= 860;
    const top = 84, gap = 40, edge = 16;
    let left, right, upper, lower;
    if (stacked) {
      // the canvas is its own block above the copy: use all of it below the header
      left = 8; right = w - 8;
      upper = 72; lower = h - 18;
    } else {
      left = rtl ? edge : c.right - m.left + gap;
      right = rtl ? c.left - m.left - gap : w - edge;
      if (right - left < w * 0.3) rtl ? (right = left + w * 0.3) : (left = right - w * 0.3);
      upper = top; lower = h - 24;
    }
    // the scene reaches further left (keyboard) than right of its pivot, so bias the pivot right
    const cx = left + (right - left) * 0.56, cy = (upper + lower) / 2;
    const rw = right - left, rh = lower - upper;

    // widen the virtual frustum so its centre lands on (cx, cy); aspect must match it
    const fw = 2 * Math.max(cx, w - cx), fh = 2 * Math.max(cy, h - cy);
    camera.aspect = fw / fh;
    camera.setViewOffset(fw, fh, cx < w / 2 ? fw - w : 0, cy < h / 2 ? fh - h : 0, w, h);
    camera.updateProjectionMatrix();

    const k = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // on phones let the stage fill its block (the bow tip may graze the edge)
    const fill = stacked ? 1.0 : 0.92, sw = stacked ? 2.05 : SCENE_W, sh = stacked ? 2.0 : SCENE_H;
    baseRadius = Math.max(stacked ? 3.2 : 4.4, (sw * fh) / (k * rw * fill), (sh * fh) / (k * rh * fill));
    if (!running) { update(elapsed, 0.016); render(); }
  }
  new ResizeObserver(frame).observe(mount);
  document.addEventListener("langchange", frame);           // copy width changes with the language
  if (document.fonts) document.fonts.ready.then(frame);

  // violin floats beside the treble end, facing the camera in three-quarter view
  const violinBase = new V3(1.12, 1.36, 0.42);
  violinRig.position.copy(violinBase);
  const camHome = new V3(Math.sin(0.62) * 5.2, 0.5 + 5.2 * Math.sin(0.28), Math.cos(0.62) * 5.2).add(target);
  violinRig.lookAt(camHome);
  violinRig.rotateY(0.55);
  violinRig.rotateZ(0.62);
  violinRig.rotateX(-0.18);
  const violinQ = violinRig.quaternion.clone();

  /* ---------- Performance state ---------- */
  const LEAD_IN = 2.4;
  let bowPos = 0, bowFrom = 0, bowTo = 0, bowStart = 0, bowDur = 1, bowDir = 1;
  let bowAngle = 0, bowString = 2, intensity = 0;
  let lastVisualStep = -1, lastAudioStep = -1;
  let audio = null, soundOn = false;
  const BOW_ANGLE = [-0.24, -0.08, 0.08, 0.24];

  function pressKey(midi, holdSteps) {
    const k = keys.get(midi);
    if (!k) return;
    k.press = 1;
    k.hold = holdSteps * STEP - 0.05;
  }

  function onStep(step, t) {
    for (const e of byStep[step % LOOP]) {
      if (e.kind === "piano") pressKey(e.midi, e.dur);
      else {
        bowDir = -bowDir;
        bowFrom = bowPos;
        bowTo = clamp(bowPos + bowDir * (e.dur >= 4 ? 300 : 170), -160, 160);
        if (Math.abs(bowTo - bowFrom) < 90) { bowDir = -bowDir; bowTo = clamp(bowPos + bowDir * 220, -160, 160); }
        bowStart = t; bowDur = e.dur * STEP;
        bowString = stringFor(e.midi);
      }
    }
  }

  function scheduleAudio(t) {
    if (!soundOn || !audio) return;
    while ((lastAudioStep + 1) * STEP + LEAD_IN < t + 0.15) {
      const step = ++lastAudioStep, when = audio.ac.currentTime + Math.max(0, step * STEP + LEAD_IN - t);
      for (const e of byStep[step % LOOP]) {
        if (e.kind === "piano") audio.piano(when, e.midi, e.vel * (0.9 + Math.random() * 0.2));
        else audio.violin(when, e.midi, e.dur * STEP);
      }
    }
  }

  /* ---------- Render loop ---------- */
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  let running = false, raf = 0, start = 0, elapsed = 0, prevNow = 0, shown = false;

  function render() {
    composer ? composer.render() : renderer.render(scene, camera);
    if (!shown) { shown = true; mount.classList.add("ready"); }
  }

  function update(t, dt) {
    // stage lights come up, camera settles in
    const lights = reduceMotion ? 1 : easeOut(t / 2.6);
    spot.intensity = theme.spot * lights;
    rim.intensity = theme.rim * lights;
    hemi.intensity = theme.hemi;
    beamMat.uniforms.uOpacity.value = theme.beam * lights * (0.92 + 0.08 * Math.sin(t * 1.7));
    dustMat.opacity = theme.dust * lights;

    par.x = lerp(par.x, par.tx, 0.04); par.y = lerp(par.y, par.ty, 0.04);
    const intro = reduceMotion ? 1 : easeOut(t / 4.5);
    const az = 0.62 + 0.16 * Math.sin(t * 0.06) + par.x * 0.08 + (1 - intro) * 0.25;
    const el = 0.28 + 0.03 * Math.sin(t * 0.09) - par.y * 0.04;
    const r = baseRadius + (1 - intro) * 2.2;
    scene.fog.near = r + theme.fog[0];   // fog fades the floor, relative to the camera distance
    scene.fog.far = r + theme.fog[1];
    camera.position.set(target.x + Math.sin(az) * r * Math.cos(el), target.y + r * Math.sin(el), target.z + Math.cos(az) * r * Math.cos(el));
    camera.lookAt(target);

    // music
    const musicT = t - LEAD_IN;
    if (musicT >= 0 && !reduceMotion) {
      const step = Math.floor(musicT / STEP);
      while (lastVisualStep < step) onStep(++lastVisualStep, t);
    }
    scheduleAudio(t);

    // keys: quick strike, held while sounding, soft release
    keys.forEach((k) => {
      if (k.press <= 0) return;
      k.hold -= dt;
      if (k.hold < 0) k.press = Math.max(0, k.press - dt * 9);
      k.pivot.rotation.x = 0.065 * easeOut(k.press);
      k.mat.emissive.setRGB(1, 0.72, 0.38).multiplyScalar(0.22 * k.press * (theme.bloom > 0.2 ? 1 : 0.4));
    });

    // bow stroke, string crossing, string glow
    const prev = bowPos;
    bowPos = lerp(bowFrom, bowTo, easeInOut((t - bowStart) / bowDur));
    intensity = lerp(intensity, clamp(Math.abs(bowPos - prev) / dt / 260, 0, 1), 0.1);
    bowAngle = lerp(bowAngle, BOW_ANGLE[bowString], 0.07);
    V.bowPivot.position.x = lerp(V.bowPivot.position.x, V.contactX[bowString], 0.07);
    V.bowPivot.position.z = lerp(V.bowPivot.position.z, V.contactZ[bowString], 0.07);
    V.bowPivot.rotation.y = bowAngle;
    V.bowSlide.position.x = bowPos;
    V.strings.forEach((s, i) => s.mat.emissive.setRGB(1, 0.8, 0.5).multiplyScalar(i === bowString ? 0.5 * intensity : 0));

    // the violin floats and leans into the phrase
    violinRig.position.set(violinBase.x, violinBase.y + 0.025 * Math.sin(t * 0.8), violinBase.z);
    violinRig.quaternion.copy(violinQ);
    violinRig.rotateZ(0.03 * Math.sin(t * 0.55) + intensity * 0.02);
    violinRig.rotateX(0.02 * Math.sin(t * 0.7));

    // dust
    if (theme.dust > 0) {
      for (let i = 0; i < DUST; i++) {
        dpos[i * 3 + 1] += dvel[i] * dt;
        dpos[i * 3] += Math.sin(t * 0.3 + i) * 0.0006;
        if (dpos[i * 3 + 1] > 3.4) dpos[i * 3 + 1] = 0;
      }
      dustGeo.attributes.position.needsUpdate = true;
    }
  }

  function loop(now) {
    const t = (now - start) / 1000;
    const dt = Math.min(0.05, (now - prevNow) / 1000 || 0.016);
    prevNow = now;
    elapsed = t;
    update(t, dt);
    render();
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (running || reduceMotion) return;
    running = true;
    start = performance.now() - elapsed * 1000;
    prevNow = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  /* ---------- Interaction ---------- */
  const ray = new THREE.Raycaster(), ndc = new V2();
  const keyMeshes = [...keys.values()].map((k) => k.mesh);
  function keyAt(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(keyMeshes, false)[0];
    return hit ? hit.object.userData.midi : 0;
  }
  renderer.domElement.addEventListener("pointerdown", (e) => {
    const midi = keyAt(e);
    if (!midi) return;
    pressKey(midi, 1);
    if (!audio) audio = createAudio();
    if (audio) { audio.ac.resume(); audio.piano(audio.ac.currentTime, midi, 0.26); }
    if (!running) { update(elapsed, 0.016); render(); }
  });
  if (matchMedia("(hover: hover)").matches) {
    let n = 0;
    renderer.domElement.addEventListener("pointermove", (e) => {
      if (++n % 3 === 0) renderer.domElement.style.cursor = keyAt(e) ? "pointer" : "";
    });
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      par.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      par.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    });
    hero.addEventListener("pointerleave", () => (par.tx = par.ty = 0));
  }

  const btn = document.querySelector(".sound");
  const label = btn.querySelector("span");
  const setLabel = () => (label.textContent = window.t ? window.t(soundOn ? "anim.mute" : "anim.listen") : soundOn ? "Mute" : "Listen");
  btn.addEventListener("click", () => {
    soundOn = !soundOn;
    if (soundOn) {
      if (!audio) audio = createAudio();
      if (audio) audio.ac.resume();
      lastAudioStep = Math.max(lastVisualStep, Math.floor((elapsed - LEAD_IN) / STEP));
    }
    btn.setAttribute("aria-pressed", String(soundOn));
    setLabel();
  });
  document.addEventListener("langchange", setLabel);
  setLabel();

  /* ---------- Go ---------- */
  applyTheme();
  frame();
  if (reduceMotion) { update(30, 0.016); render(); return; }
  update(0, 0.016);
  render();

  let inView = false;
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    inView ? play() : pause();
  }, { threshold: 0.05 }).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : inView && play()));
}

start();
})();
