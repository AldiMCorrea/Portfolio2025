import React from 'react';
import './AerialExperience.css';
import logo from './aerial-logo-black.png';

const WHATSAPP_NUMBER = '5493517892061';
const WHATSAPP_MESSAGE = '¡Hola Aldi! Quiero inscribirme a las clases de Aerial Dance 🤍';
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// ---- Drapery background -------------------------------------------------
// Side curtain in a 400x1000 box: full width at the top, gathered by a
// tie-back at (TIE_X, TIE_Y), then flaring out towards the floor.
const TIE_X = 150;
const TIE_Y = 590;
const FOLDS = 9;

const curtainOutline =
  `M0 0 H400 C370 230 220 470 ${TIE_X} ${TIE_Y} ` +
  `C200 700 300 860 340 1000 H0 Z`;

// Fold lines follow the curtain shape: converge at the tie-back, fan out below.
const curtainFolds = Array.from({ length: FOLDS }, (_, i) => {
  const t = (i + 1) / (FOLDS + 1);
  const top = 400 * t;
  const tie = TIE_X * t;
  const floor = 340 * t;
  return `M${top} 0 C${top - 10} 260 ${tie + 20} 470 ${tie} ${TIE_Y} C${tie + 15} 720 ${floor - 5} 860 ${floor} 1000`;
});

function Curtain({ side }) {
  const id = `curtain-${side}`;
  return (
    <svg className={`ae-curtain ae-curtain-${side}`} viewBox="0 0 400 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        {/* Repeating vertical folds: light crest, soft shadow valley. */}
        <linearGradient id={`${id}-folds`} x1="0" x2="0.11" y1="0" y2="0" spreadMethod="repeat">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f3efea" />
          <stop offset="70%" stopColor="#e4ddd5" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        {/* Shade towards the inner edge and the floor, for depth. */}
        <linearGradient id={`${id}-shade`} x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="75%" stopColor="#d8cfc5" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c9bdb0" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path d={curtainOutline} fill={`url(#${id}-folds)`} />
      <path d={curtainOutline} fill={`url(#${id}-shade)`} />
      <g className="ae-fold-lines">
        {curtainFolds.map((d, i) => <path key={i} d={d} />)}
      </g>
      {/* Tie-back ribbon */}
      <path className="ae-tieback" d={`M-10 ${TIE_Y - 18} C60 ${TIE_Y - 30} 120 ${TIE_Y - 22} ${TIE_X + 14} ${TIE_Y - 4} L${TIE_X + 14} ${TIE_Y + 10} C120 ${TIE_Y - 4} 60 ${TIE_Y - 12} -10 ${TIE_Y} Z`} />
    </svg>
  );
}

// Swagged valance across the top: a row of sagging fabric scallops.
function Valance() {
  const swags = [0, 1, 2, 3];
  const w = 1000 / swags.length;
  return (
    <svg className="ae-valance" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="valance-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f4f0eb" />
          <stop offset="85%" stopColor="#e6dfd7" />
          <stop offset="100%" stopColor="#fbfaf8" />
        </linearGradient>
      </defs>
      <rect width="1000" height="14" fill="#efe9e2" />
      {swags.map((i) => {
        const x0 = i * w - 20;
        const x1 = (i + 1) * w + 20;
        const mid = (x0 + x1) / 2;
        return (
          <g key={i}>
            <path d={`M${x0} 0 H${x1} C${x1 - 30} 70 ${mid + 80} 130 ${mid} 132 C${mid - 80} 130 ${x0 + 30} 70 ${x0} 0 Z`} fill="url(#valance-fill)" />
            <path className="ae-valance-fold" d={`M${x0 + 40} 10 Q${mid} 110 ${x1 - 40} 10`} />
            <path className="ae-valance-fold" d={`M${x0 + 70} 8 Q${mid} 80 ${x1 - 70} 8`} />
          </g>
        );
      })}
    </svg>
  );
}

// A wide translucent silk sweeping diagonally across the whole viewport.
function Sweep() {
  return (
    <svg className="ae-sweep" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sweep-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f1ebe4" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e8e0d7" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M1000 60 C780 180 620 420 480 560 C340 700 180 800 0 880 L0 1000 C220 900 400 800 540 660 C700 500 820 300 1000 210 Z" fill="url(#sweep-fill)" />
      <path className="ae-sweep-fold" d="M1000 130 C800 250 640 460 510 610 C370 760 200 850 0 940" />
    </svg>
  );
}

function Drapery() {
  return (
    <div className="ae-drapes" aria-hidden="true">
      <Sweep />
      <Curtain side="left" />
      <Curtain side="right" />
      <Valance />
    </div>
  );
}

function StrapsIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M34 8 V78 a6 6 0 0 0 12 0 V8" />
      <path d="M54 8 V78 a6 6 0 0 0 12 0 V8" />
    </svg>
  );
}

function TrapezeIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M30 8 L28 88" />
      <path d="M70 8 L72 88" />
      <path d="M20 88 H80" strokeWidth="5" />
    </svg>
  );
}

function HammockIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M44 8 C30 50 22 80 50 100 C78 80 70 50 56 8" />
      <path d="M40 30 C44 60 56 60 60 30" opacity="0.5" />
    </svg>
  );
}

const DISCIPLINES = [
  {
    key: 'straps',
    title: 'Aerial Straps',
    Icon: StrapsIcon,
    text: 'Dos correas suspendidas que ponen a prueba la fuerza, el control y la precisión. Trabajamos tracciones, rotaciones y figuras dinámicas, construyendo una base sólida de hombros y core paso a paso.',
  },
  {
    key: 'trapeze',
    title: 'Dance Trapeze',
    Icon: TrapezeIcon,
    text: 'El trapecio de danza une el vuelo con el movimiento coreográfico. Balanceos, giros y transiciones fluidas sobre la barra y las cuerdas, donde la técnica se vuelve expresión.',
  },
  {
    key: 'hammock',
    title: 'Aerial Hammock',
    Icon: HammockIcon,
    text: 'Una tela en forma de hamaca que te sostiene y te invita a explorar. Ideal para comenzar: inversiones, envolturas y caídas suaves, combinando fuerza, flexibilidad y mucha confianza.',
  },
];

function AerialExperience() {
  return (
    <div className="ae">
      <Drapery />

      <header className="ae-hero">
        <h1 className="ae-title">
          <img className="ae-logo" src={logo} alt="Aerial Experience" />
        </h1>
        <p className="ae-tagline">Clases de aerial dance · Volá, fluí, sentí</p>
        <a className="ae-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Quiero inscribirme
        </a>
      </header>

      <main>
        <section className="ae-section ae-about" id="about">
          <p className="ae-eyebrow">About</p>
          <h2>Danza en el aire</h2>
          <p>
            Aerial Experience es un espacio para descubrir la danza aérea desde cero o seguir
            creciendo en tu práctica. Cada clase combina técnica, acondicionamiento físico y
            expresión artística, en grupos reducidos y con acompañamiento personalizado.
          </p>
          <p>
            No necesitás experiencia previa: solo ganas de moverte, animarte a volar y disfrutar
            del proceso. Cada cuerpo tiene su tiempo, y acá lo respetamos.
          </p>
        </section>

        <section className="ae-section" id="disciplinas">
          <p className="ae-eyebrow">Disciplinas</p>
          <h2>Elegí tu aparato</h2>
          <div className="ae-cards">
            {DISCIPLINES.map((d) => (
              <article className="ae-card" key={d.key} id={d.key}>
                <div className="ae-card-icon"><d.Icon /></div>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ae-section ae-contact" id="contacto">
          <p className="ae-eyebrow">Inscripciones</p>
          <h2>¿Te sumás a volar?</h2>
          <p>Escribime por WhatsApp para consultar horarios, cupos y reservar tu clase.</p>
          <a className="ae-btn ae-btn-wpp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.96-3.48-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43a9.4 9.4 0 0 1 9.43 9.44c0 5.2-4.24 9.44-9.44 9.44zm8.03-17.47A11.3 11.3 0 0 0 12.05.7C5.8.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.3l5.72-1.5a11.3 11.3 0 0 0 5.72 1.46h.01c6.25 0 11.35-5.1 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" />
            </svg>
            +54 9 351 789-2061
          </a>
        </section>
      </main>

      <footer className="ae-footer">
        <a href="/">aldicorrea.com</a>
      </footer>
    </div>
  );
}

export default AerialExperience;
