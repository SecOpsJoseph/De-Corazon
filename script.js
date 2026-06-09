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
    void input.offsetWidth; // forzar reflow para reiniciar animación
    input.classList.add('shake');
    errEl.textContent = errors[Math.min(attempts, errors.length - 1)];
    errEl.classList.add('show');

    // Marcar punto de intento
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

  // Mostrar frase mientras se forma el corazón
  setTimeout(() => {
    document.getElementById('heart-caption').classList.add('visible');
  }, 600);

  // Dibujar corazón con el nombre Jhannara
  setTimeout(() => drawHeart(), 1400);

  // Mostrar mensaje final al terminar
  setTimeout(() => {
    document.getElementById('final-msg').classList.add('visible');
  }, 5000);
}

/* ── CORAZÓN DE LETRAS ── */
function drawHeart() {
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const name = 'Jhannara'; // ← el nombre que forma el corazón

  // Contorno del corazón (paramétrica)
  const points = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.04) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({
      x: W / 2 + x * 10.5,
      y: H / 2 + y * 10.5 - 10
    });
  }

  // Relleno interior (grid de puntos dentro del corazón)
  const filled = [];
  const step = 14;
  for (let px = step; px < W - step; px += step) {
    for (let py = step; py < H - step; py += step) {
      if (insideHeart(px, py, W, H)) {
        filled.push({ x: px, y: py });
      }
    }
  }

  const all = [...points, ...filled];
  shuffle(all);

  let i = 0;
  const interval = setInterval(() => {
    if (i >= all.length) { clearInterval(interval); return; }
    const batch = Math.min(4, all.length - i);
    for (let b = 0; b < batch; b++) {
      const pt = all[i + b];
      ctx.font = 'bold 10px Lato';
      ctx.fillStyle = interpolateColor(i / all.length);
      ctx.globalAlpha = 0.85;
      ctx.fillText(name[Math.floor(Math.random() * name.length)], pt.x, pt.y);
    }
    i += batch;
  }, 28);
}

function insideHeart(px, py, W, H) {
  const scale = 10.5;
  const cx = W / 2, cy = H / 2 - 10;
  const nx = (px - cx) / scale;
  const ny = (py - cy) / scale;
  const val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
  return val <= 0;
}

function interpolateColor(t) {
  // deep rose → soft pink → gold
  const r1 = [192, 57, 75], r2 = [232, 117, 138], r3 = [201, 149, 92];
  let r, g, b;
  if (t < 0.5) {
    const u = t * 2;
    r = lerp(r1[0], r2[0], u); g = lerp(r1[1], r2[1], u); b = lerp(r1[2], r2[2], u);
  } else {
    const u = (t - 0.5) * 2;
    r = lerp(r2[0], r3[0], u); g = lerp(r2[1], r3[1], u); b = lerp(r2[2], r3[2], u);
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
