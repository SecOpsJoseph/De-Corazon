/* ── MÚSICA DE FONDO ── */
const music = document.getElementById('bg-music');
music.volume = 0.5;
document.addEventListener('click', () => {
  music.play();
}, { once: true });

/* ── PARTÍCULAS DE FONDO ── */
const emojis = ['🌹','💕','✨','🌸','💫','❣️','🌺','💝'];
const pContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.setProperty('--dur', (5 + Math.random() * 8) + 's');
  p.style.setProperty('--delay', (Math.random() * 10) + 's');
  p.style.left = Math.random() * 100 + 'vw';
  p.style.bottom = '-30px';
  pContainer.appendChild(p);
}

/* ── CONTRASEÑA ── */
const VALID = ['amor', 'cariño', 'carino', 'un abrazo', 'abrazo', 'tiempo', 'tu amor', 'mi amor'];
const errors = [
  "Casi... pero esa no es la llave de mi corazón. 🗝️",
  "Mmm, intenta de nuevo. Me gusta cuando te esfuerzas por entrar aquí. 😏",
  "Eso no es... pero me encanta que estés intentando descubrir mis secretos. 🌹"
];
let attempts = 0;

document.getElementById('password-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

function checkPassword() {
  const input = document.getElementById('password-input');
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  if (VALID.includes(val)) {
    enterHeart();
  } else {
    const errEl = document.getElementById('error-msg');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    errEl.textContent = errors[Math.min(attempts, errors.length - 1)];
    errEl.classList.add('show');
    const dots = document.querySelectorAll('#dots .dot');
    if (attempts < dots.length) dots[attempts].classList.add('used');
    attempts++;
    input.value = '';
    setTimeout(() => input.classList.remove('shake'), 500);
  }
}

/* ── TRANSICIÓN ── */
function enterHeart() {
  const ts = document.getElementById('transition-screen');
  const ls = document.getElementById('lock-screen');
  ts.classList.add('active');
  setTimeout(() => {
    ls.style.display = 'none';
    setTimeout(() => {
      ts.classList.remove('active');
      showHeart();
    }, 600);
  }, 2200);
}

/* ── PANTALLA CORAZÓN ── */
function showHeart() {
  const hs = document.getElementById('heart-screen');
  hs.style.display = 'flex';
  setTimeout(() => {
    document.getElementById('heart-caption').classList.add('visible');
  }, 600);
  setTimeout(() => drawHeart(), 1200);
  setTimeout(() => {
    document.getElementById('final-msg').classList.add('visible');
  }, 6000);
}

/* ── CORAZÓN RELLENO CON "Jhannara" ── */
function drawHeart() {
  const canvas = document.getElementById('heart-canvas');

  // Tamaño: ocupa casi todo el ancho del móvil
  const size = Math.min(window.innerWidth - 32, 380);
  canvas.width  = size;
  canvas.height = size * 0.92;

  const ctx  = canvas.getContext('2d');
  const W    = canvas.width;
  const H    = canvas.height;
  const name = 'Jhannara';

  // Paso pequeño = más denso
  const fontSize = 11;
  const stepX    = fontSize * 0.95;   // casi sin espacio horizontal
  const stepY    = fontSize * 1.15;   // poco espacio vertical

  ctx.font         = `bold ${fontSize}px 'Lato', sans-serif`;
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'top';

  // Centro y escala del corazón
  const scale = size * 0.032;
  const cx    = W / 2;
  const cy    = H / 2 + size * 0.06;

  // Recopilar todos los puntos
  const all = [];
  for (let py = 2; py < H; py += stepY) {
    for (let px = 2; px < W; px += stepX) {
      const nx  = (px - cx) / scale;
      const ny  = (py - cy) / scale;
      // Ecuación implícita del corazón
      const val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
      if (val <= 0.08) {   // <= 0 es interior, 0.08 incluye el borde
        all.push({ x: px, y: py });
      }
    }
  }

  shuffle(all);

  let i = 0;
  let nameIdx = 0;

  const interval = setInterval(() => {
    if (i >= all.length) { clearInterval(interval); return; }

    // Dibujar de a 8 letras por tick
    const batch = Math.min(8, all.length - i);
    for (let b = 0; b < batch; b++) {
      const pt  = all[i + b];
      const t   = (i + b) / all.length;

      ctx.fillStyle   = interpolateColor(t);
      ctx.globalAlpha = 0.92;
      // Letra siguiente del nombre en ciclo
      ctx.fillText(name[nameIdx % name.length], pt.x, pt.y);
      nameIdx++;
    }
    i += batch;
  }, 18);
}

/* ── COLORES: rosa oscuro → rosa suave → dorado ── */
function interpolateColor(t) {
  const c1 = [192, 57,  75];
  const c2 = [232, 117, 138];
  const c3 = [201, 149, 92];
  let r, g, b;
  if (t < 0.5) {
    const u = t * 2;
    r = lerp(c1[0], c2[0], u);
    g = lerp(c1[1], c2[1], u);
    b = lerp(c1[2], c2[2], u);
  } else {
    const u = (t - 0.5) * 2;
    r = lerp(c2[0], c3[0], u);
    g = lerp(c2[1], c3[1], u);
    b = lerp(c2[2], c3[2], u);
  }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

const lerp = (a, b, t) => a + (b - a) * t;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
