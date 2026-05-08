import { gsap } from 'gsap';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]█▓▒░ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

let spotlightState = null;
let flipclockState = null;
let signatureState = null;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/* ---------- Spotlight Manifesto ---------- */

function buildSpotlightChars(rootEl) {
  const lines = rootEl.querySelectorAll('.manifesto__line');
  const allChars = [];

  lines.forEach(line => {
    const text = line.getAttribute('data-text') || line.textContent.trim();
    line.innerHTML = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.classList.add('manifesto__char');
      if (ch === ' ') {
        span.classList.add('manifesto__char--space');
        span.textContent = ' ';
      } else {
        span.dataset.real = ch;
        span.textContent = randomChar();
        span.classList.add('is-scrambled');
      }
      line.appendChild(span);
      if (ch !== ' ') allChars.push(span);
    });
  });

  return allChars;
}

export function initSpotlight(rootEl) {
  if (!rootEl || rootEl._spotlightChars) return rootEl._spotlightApi || null;
  const chars = buildSpotlightChars(rootEl);
  rootEl._spotlightChars = chars;

  let mouse = { x: -9999, y: -9999 };
  let running = false;
  let raf = null;
  let scrambleTick = 0;
  const RADIUS = 220;
  const RADIUS_SQ = RADIUS * RADIUS;

  function onMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function step() {
    if (!running) return;
    scrambleTick++;
    const refreshScramble = scrambleTick % 5 === 0; // ~12fps for scramble

    chars.forEach(ch => {
      const rect = ch.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < RADIUS_SQ) {
        if (!ch.classList.contains('is-decoded')) {
          ch.classList.remove('is-scrambled');
          ch.classList.add('is-decoded');
          ch.textContent = ch.dataset.real;
        }
      } else {
        if (!ch.classList.contains('is-scrambled')) {
          ch.classList.remove('is-decoded');
          ch.classList.add('is-scrambled');
        }
        if (refreshScramble) ch.textContent = randomChar();
      }
    });

    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    window.addEventListener('mousemove', onMove);
    step();
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    window.removeEventListener('mousemove', onMove);
  }

  function reset() {
    chars.forEach(ch => {
      ch.classList.remove('is-decoded');
      ch.classList.add('is-scrambled');
      ch.textContent = randomChar();
    });
  }

  const api = { start, stop, reset };
  rootEl._spotlightApi = api;
  return api;
}

/* ---------- Flipclock ---------- */

const FLIPCLOCK_ROLL_CHARS = '0123456789';

function buildFlipclockCells(rootEl) {
  const value = rootEl.getAttribute('data-flipclock') || '';
  rootEl.innerHTML = '';
  const cells = [];

  [...value].forEach(ch => {
    const cell = document.createElement('span');
    cell.classList.add('flipclock__cell');
    const isDigit = /[0-9]/.test(ch);
    if (!isDigit) {
      cell.classList.add('flipclock__cell--static');
      cell.textContent = ch;
    } else {
      const roll = document.createElement('span');
      roll.classList.add('flipclock__roll');
      roll.textContent = randomChar();
      cell.appendChild(roll);
      cell.dataset.target = ch;
      cells.push(cell);
    }
    rootEl.appendChild(cell);
  });

  return cells;
}

export function initFlipclock(rootEl) {
  if (!rootEl) return null;
  const cells = buildFlipclockCells(rootEl);
  rootEl._flipclockCells = cells;
  return { reset, animate };

  function reset() {
    cells.forEach(cell => {
      const roll = cell.querySelector('.flipclock__roll');
      if (roll) roll.textContent = randomChar();
    });
  }

  function animate() {
    return new Promise(resolve => {
      let pending = cells.length;
      if (pending === 0) return resolve();

      cells.forEach((cell, i) => {
        const target = cell.dataset.target;
        const roll = cell.querySelector('.flipclock__roll');
        const totalSpins = 10 + i; // each cell rolls a bit more than previous
        let spins = 0;

        const interval = setInterval(() => {
          spins++;
          if (spins >= totalSpins) {
            roll.textContent = target;
            clearInterval(interval);
            pending--;
            if (pending === 0) resolve();
          } else {
            roll.textContent = FLIPCLOCK_ROLL_CHARS[Math.floor(Math.random() * 10)];
          }
        }, 55 + i * 6);
      });
    });
  }
}

/* ---------- Signature SVG path-draw ---------- */

export function initSignature(svgEl) {
  if (!svgEl) return null;
  const path = svgEl.querySelector('.signature__path');
  if (!path) return null;

  const length = path.getTotalLength();
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(length);

  return {
    reset() {
      path.style.strokeDashoffset = String(length);
    },
    draw(duration = 1.8) {
      return new Promise(resolve => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration,
          ease: 'power2.out',
          onComplete: resolve,
        });
      });
    },
    erase(duration = 0.5) {
      return new Promise(resolve => {
        gsap.to(path, {
          strokeDashoffset: length,
          duration,
          ease: 'power2.in',
          onComplete: resolve,
        });
      });
    },
  };
}

/* ---------- Public init / reveal / hide ---------- */

export function initContactFinale() {
  const section = document.querySelector('.contact-cinema');
  if (!section) return;

  const manifesto = section.querySelector('.manifesto');
  const flipclock = section.querySelector('[data-flipclock]');
  const signature = section.querySelector('.signature');

  if (manifesto) spotlightState = initSpotlight(manifesto);
  if (flipclock) flipclockState = initFlipclock(flipclock);
  if (signature) signatureState = initSignature(signature);
}

export async function revealContactFinale(section) {
  if (!section) return;

  const manifesto = section.querySelector('.manifesto');
  const flipclock = section.querySelector('[data-flipclock]');
  const signature = section.querySelector('.signature');
  const cta = section.querySelector('.contact-cta');

  // Re-init in case DOM was reset
  if (manifesto && !manifesto._spotlightApi) spotlightState = initSpotlight(manifesto);
  if (flipclock && !flipclock._flipclockCells) flipclockState = initFlipclock(flipclock);
  if (signature) signatureState = initSignature(signature);

  if (signatureState) signatureState.reset();
  if (flipclockState) flipclockState.reset();
  if (spotlightState) spotlightState.reset();

  // start spotlight (idle scramble until cursor enters)
  if (spotlightState) spotlightState.start();

  // CTA scale-in
  if (cta) {
    gsap.fromTo(cta,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: 0.6 }
    );
  }

  // Flipclock animate digits
  if (flipclockState) flipclockState.animate();

  // Signature draw (a bit after CTA)
  if (signatureState) {
    setTimeout(() => signatureState.draw(1.8), 1100);
  }
}

export async function hideContactFinale(section) {
  if (!section) return;
  if (spotlightState) spotlightState.stop();
  if (signatureState) await signatureState.erase(0.4);
}
