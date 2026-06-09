/* ── MÚSICA DE FONDO ── */
const music = document.getElementById('bg-music');
music.volume = 0.5;
document.addEventListener('click', () => { music.play(); }, { once: true });

/* ── PARTÍCULAS ── */
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
const VALID = ['amor','cariño','carino','un abrazo','abrazo','tiempo','tu amor','mi amor'];
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

/* ── MOSTRAR PANTALLA CORAZÓN ── */
function showHeart() {
  const hs = document.getElementById('heart-screen');
  hs.style.display = 'flex';
  hs.style.animation = 'fadeIn 1s ease';

  // 1. Frase aparece
  setTimeout(() => {
    document.getElementById('heart-caption').classList.add('visible');
  }, 500);

  // 2. Contorno se dibuja
  setTimeout(() => {
    document.getElementById('heart-outline').classList.add('draw');
  }, 1200);

  // 3. Relleno de palabras aparece
  setTimeout(() => {
    buildHeartText();
  }, 1800);

  // 4. Mensaje final
  setTimeout(() => {
    document.getElementById('final-msg').classList.add('visible');
  }, 6500);
}

/* ── CORAZÓN RELLENO CON SVG TEXT ── */
function buildHeartText() {
  const group = document.getElementById('heart-text-group');
  const name  = 'Jhannara ';   // espacio para separar repeticiones
  const word  = name.repeat(3); // "Jhannara Jhannara Jhannara "

  // Colores del gradiente para cada fila
  const colors = [
    '#c0394b','#c8404f','#d05060','#d86070',
    '#e07080','#e8758a','#e87a8f','#dd8090',
    '#d09070','#c9955c'
  ];

  // Filas de texto que llenan el corazón
  // viewBox es 200x190, corazón va de y≈20 a y≈170
  const rows = [];
  for (let y = 26; y <= 168; y += 11) {
    rows.push(y);
  }

  const allTexts = [];

  rows.forEach((y, rowIdx) => {
    const colorIdx = Math.floor((rowIdx / rows.length) * colors.length);
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', '5');
    t.setAttribute('y', String(y));
    t.setAttribute('font-family', "'Lato', sans-serif");
    t.setAttribute('font-weight', 'bold');
    t.setAttribute('font-size', '9');
    t.setAttribute('fill', colors[Math.min(colorIdx, colors.length - 1)]);
    t.setAttribute('opacity', '0');
    // Repetir el nombre muchas veces para que llene el ancho
    t.textContent = word.repeat(8);
    group.appendChild(t);
    allTexts.push(t);
  });

  // Aparecen de a poco, fila por fila
  allTexts.forEach((el, i) => {
    setTimeout(() => {
      el.setAttribute('opacity', '0.92');
    }, i * 80);
  });
}

function lerp(a, b, t) { return a + (b - a) * t; }
