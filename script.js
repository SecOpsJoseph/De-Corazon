/* ══════════════════════════════════════
   MÚSICA — arranca con el primer toque
══════════════════════════════════════ */
const music = document.getElementById('bg-music');
music.volume = 0.45;

function tryPlayMusic() {
  music.play().catch(() => {});
}
document.addEventListener('touchstart', tryPlayMusic, { once: true });
document.addEventListener('click',      tryPlayMusic, { once: true });

/* ══════════════════════════════════════
   PARTÍCULAS
══════════════════════════════════════ */
const emojis = ['🌹','💕','✨','🌸','💫','❣️','🌺','💝'];
const pContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.textContent = emojis[i % emojis.length];
  p.style.setProperty('--dur',   (5 + Math.random() * 8) + 's');
  p.style.setProperty('--delay', (Math.random() * 10) + 's');
  p.style.left   = Math.random() * 100 + 'vw';
  p.style.bottom = '-30px';
  pContainer.appendChild(p);
}

/* ══════════════════════════════════════
   CONTRASEÑA
══════════════════════════════════════ */
const VALID = ['amor','cariño','carino','un abrazo','abrazo','tiempo','tu amor','mi amor'];
const ERRORS = [
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
  const val   = input.value.trim().toLowerCase();
  if (!val) return;

  if (VALID.includes(val)) {
    tryPlayMusic();
    enterHeart();
  } else {
    const errEl = document.getElementById('error-msg');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    errEl.textContent = ERRORS[Math.min(attempts, ERRORS.length - 1)];
    errEl.classList.add('show');
    const dots = document.querySelectorAll('#dots .dot');
    if (attempts < dots.length) dots[attempts].classList.add('used');
    attempts++;
    input.value = '';
    setTimeout(() => input.classList.remove('shake'), 500);
  }
}

/* ══════════════════════════════════════
   TRANSICIÓN
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   PANTALLA DEL CORAZÓN
══════════════════════════════════════ */
function showHeart() {
  const hs = document.getElementById('heart-screen');
  hs.style.display    = 'flex';
  hs.style.animation  = 'fadeIn 1s ease';

  setTimeout(() => {
    document.getElementById('heart-caption').classList.add('visible');
  }, 500);

  // Esperar que el DOM pinte antes de medir el canvas
  setTimeout(() => drawHeart(), 1000);

  setTimeout(() => {
    document.getElementById('final-msg').classList.add('visible');
  }, 7000);
}

/* ══════════════════════════════════════
   CORAZÓN — canvas con palabras densas
══════════════════════════════════════ */
function drawHeart() {
  const canvas = document.getElementById('heart-canvas');

  // Tamaño real disponible en pantalla
  const maxW  = Math.min(window.innerWidth - 32, 400);
  const SIZE  = maxW;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';

  const ctx   = canvas.getContext('2d');
  const NAME  = 'Jhannara ';   // espacio entre repeticiones
  const FS    = Math.round(SIZE * 0.038);   // ~15px en 400px, se escala
  const STEP  = Math.round(FS * 1.1);       // interlineado justo

  ctx.font         = `bold ${FS}px 'Lato', sans-serif`;
  ctx.textBaseline = 'top';

  // Escala del corazón matemático  (va de -1.4 a +1.4 en X, -1.3 a +1.2 en Y aprox)
  const SC = SIZE / 3.2;
  const CX = SIZE / 2;
  const CY = SIZE / 2 + SIZE * 0.05;

  // ── Función que dice si (px,py) está DENTRO del corazón ──
  function inHeart(px, py) {
    const x =  (px - CX) / SC;
    const y = -(py - CY) / SC;   // Y invertido (corazón apunta hacia abajo)
    return Math.pow(x*x + y*y - 1, 3) - x*x * y*y*y <= 0;
  }

  // Recoger todos los puntos válidos fila a fila
  const rows = [];
  for (let py = 0; py < SIZE; py += STEP) {
    const row = [];
    for (let px = 0; px < SIZE; px += Math.round(FS * 0.62)) {
      if (inHeart(px + FS * 0.3, py + FS * 0.5)) row.push(px);
    }
    if (row.length > 0) rows.push({ y: py, xs: row });
  }

  // Paleta: rosa oscuro → rosa suave → dorado
  const COLORS = [
    '#c0394b','#c73d50','#cf4256','#d8526a',
    '#e06378','#e8758a','#e07888','#d47a78',
    '#c98068','#c9955c'
  ];

  let namePos = 0;

  // Dibujar fila por fila con delay para efecto de formación
  rows.forEach((row, rowIdx) => {
    setTimeout(() => {
      const color = COLORS[Math.floor((rowIdx / rows.length) * COLORS.length)];
      ctx.fillStyle   = color;
      ctx.globalAlpha = 0.92;

      row.xs.forEach(px => {
        const ch = NAME[namePos % NAME.length];
        ctx.fillText(ch, px, row.y);
        namePos++;
      });
    }, rowIdx * 60);   // 60ms entre filas = animación suave de arriba a abajo
  });
}
