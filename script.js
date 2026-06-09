/* ══ MÚSICA ══ */
const music = document.getElementById('bg-music');
music.volume = 0.45;
function tryPlay() { music.play().catch(()=>{}); }
document.addEventListener('touchstart', tryPlay, {once:true});
document.addEventListener('click', tryPlay, {once:true});

/* ══ PARTÍCULAS ══ */
const emojis = ['🌹','💕','✨','🌸','💫','❣️','🌺','💝'];
const pWrap = document.getElementById('particles');
for(let i=0;i<20;i++){
  const p=document.createElement('div');
  p.className='particle';
  p.textContent=emojis[i%emojis.length];
  p.style.setProperty('--dur',(5+Math.random()*8)+'s');
  p.style.setProperty('--delay',(Math.random()*10)+'s');
  p.style.left=Math.random()*100+'vw';
  p.style.bottom='-30px';
  pWrap.appendChild(p);
}

/* ══ CONTRASEÑA ══ */
const VALID=['amor','cariño','carino','un abrazo','abrazo','tiempo','tu amor','mi amor'];
const ERRORS=[
  "Casi... pero esa no es la llave de mi corazón. 🗝️",
  "Mmm, intenta de nuevo. Me gusta cuando te esfuerzas por entrar aquí. 😏",
  "Eso no es... pero me encanta que estés intentando descubrir mis secretos. 🌹"
];
let attempts=0;

document.getElementById('password-input').addEventListener('keydown',e=>{
  if(e.key==='Enter') checkPassword();
});

function checkPassword(){
  const input=document.getElementById('password-input');
  const val=input.value.trim().toLowerCase();
  if(!val) return;
  if(VALID.includes(val)){
    tryPlay();
    enterHeart();
  } else {
    const errEl=document.getElementById('error-msg');
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    errEl.textContent=ERRORS[Math.min(attempts,ERRORS.length-1)];
    errEl.classList.add('show');
    const dots=document.querySelectorAll('#dots .dot');
    if(attempts<dots.length) dots[attempts].classList.add('used');
    attempts++;
    input.value='';
    setTimeout(()=>input.classList.remove('shake'),500);
  }
}

/* ══ TRANSICIÓN ══ */
function enterHeart(){
  const ts=document.getElementById('transition-screen');
  const ls=document.getElementById('lock-screen');
  ts.classList.add('active');
  setTimeout(()=>{
    ls.style.display='none';
    setTimeout(()=>{
      ts.classList.remove('active');
      showHeart();
    },600);
  },2200);
}

/* ══ MOSTRAR CORAZÓN ══ */
function showHeart(){
  const hs=document.getElementById('heart-screen');
  hs.style.display='flex';
  hs.style.animation='fadeIn 1s ease';

  setTimeout(()=>{
    document.getElementById('heart-caption').classList.add('visible');
  },500);

  setTimeout(()=>{ drawHeart(); },1000);

  setTimeout(()=>{
    document.getElementById('final-msg').classList.add('visible');
  },7000);
}

/* ══ DIBUJAR CORAZÓN CON PALABRAS ══ */
function drawHeart(){
  const canvas=document.getElementById('heart-canvas');
  const SIZE=Math.min(window.innerWidth-32, 380);
  canvas.width=SIZE;
  canvas.height=SIZE;

  const ctx=canvas.getContext('2d');
  const NAME='Jhannara ';

  // Tamaño de fuente proporcional
  const FS=Math.max(12, Math.round(SIZE/26));
  ctx.font=`bold ${FS}px Arial, sans-serif`;
  ctx.textBaseline='top';

  const words=[];
  const step=FS+2;

  // Generar todas las palabras usando la ecuación del corazón
  // Normalizado: cx=SIZE/2, cy=SIZE*0.47, scale=SIZE*0.27
  const cx=SIZE/2;
  const cy=SIZE*0.47;
  const sc=SIZE*0.27;

  for(let row=0; row*step < SIZE; row++){
    const py=row*step;
    let col=0;
    for(let px=0; px<SIZE; px+=Math.round(FS*0.6)){
      // Transformar a coordenadas del corazón
      const x=(px-cx)/sc;
      const y=-(py-cy)/sc;
      // Ecuación: (x²+y²-1)³ - x²y³ ≤ 0
      const val=Math.pow(x*x+y*y-1,3)-x*x*y*y*y;
      if(val<=0){
        words.push({
          x:px,
          y:py,
          ch:NAME[(row*50+col)%NAME.length],
          row:row
        });
        col++;
      }
    }
  }

  console.log('Total palabras:', words.length); // debug

  if(words.length===0){
    // Fallback: dibujar directo sin animación
    ctx.fillStyle='#c0394b';
    ctx.fillText('Error dibujando corazón', 10, SIZE/2);
    return;
  }

  // Agrupar por fila
  const rowMap={};
  words.forEach(w=>{
    if(!rowMap[w.row]) rowMap[w.row]=[];
    rowMap[w.row].push(w);
  });
  const rowKeys=Object.keys(rowMap).map(Number).sort((a,b)=>a-b);

  const COLORS=[
    '#c0394b','#c73d50','#cf4256','#d8526a',
    '#e06378','#e8758a','#e07888','#d47a78',
    '#c98068','#c9955c'
  ];

  // Dibujar fila por fila con delay
  rowKeys.forEach((rowIdx,i)=>{
    setTimeout(()=>{
      const color=COLORS[Math.floor((i/rowKeys.length)*COLORS.length)];
      ctx.fillStyle=color;
      ctx.globalAlpha=0.95;
      rowMap[rowIdx].forEach(w=>{
        ctx.fillText(w.ch, w.x, w.y);
      });
    }, i*55);
  });
}
