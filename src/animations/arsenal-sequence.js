const DEFAULT_SEQUENCE = {
  afterTitleDelay: 180,
  cardTextDelay: 0.25,
  cardStagger: 0.3,
  duration: 1.5,
};

function getViewport() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function wait(ms) {
  return ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}

export function getArsenalCardOrigin(index, viewport = getViewport()) {
  const origins = [
    { x: -viewport.width, y: 0 },
    { x: 0, y: -viewport.height },
    { x: -viewport.width, y: 0 },
    { x: 0, y: viewport.height },
    { x: 0, y: viewport.height },
  ];

  return origins[index] || { x: 0, y: viewport.height };
}

export function resetMatrixReveals(scope) {
  if (!scope?.querySelectorAll) return;

  scope.querySelectorAll('.matrix-reveal').forEach(el => {
    if (el._matrixReveal?.reset) el._matrixReveal.reset();
  });
}

export function decodeMatrixReveals(scope) {
  if (!scope?.querySelectorAll) return Promise.resolve([]);

  const decodes = Array.from(scope.querySelectorAll('.matrix-reveal'))
    .map(el => el._matrixReveal?.decode?.())
    .filter(Boolean);

  return Promise.all(decodes);
}

export function eraseMatrixReveals(scope) {
  if (!scope?.querySelectorAll) return Promise.resolve([]);

  const erases = Array.from(scope.querySelectorAll('.matrix-reveal'))
    .map(el => el._matrixReveal?.erase?.())
    .filter(Boolean);

  return Promise.all(erases);
}

export function resetArsenalContent(section, gsap) {
  resetMatrixReveals(section);

  const cards = Array.from(section.querySelectorAll('.bento-card'));
  cards.forEach((card, index) => {
    gsap.set(card, {
      ...getArsenalCardOrigin(index),
      opacity: 0,
    });
  });
}

export async function revealArsenalContent(section, gsap, options = {}) {
  const settings = { ...DEFAULT_SEQUENCE, ...options };
  const title = section.querySelector('.section-title.matrix-reveal');
  const subtitle = section.querySelector('.section-subtitle.matrix-reveal');
  const cards = Array.from(section.querySelectorAll('.bento-card'));

  if (title?._matrixReveal?.decode) {
    await title._matrixReveal.decode();
    if (subtitle?._matrixReveal?.decode) await subtitle._matrixReveal.decode();
    await wait(settings.afterTitleDelay);
  }

  if (!cards.length) return;

  await new Promise(resolve => {
    gsap.to(cards, {
      opacity: 1,
      x: 0,
      y: 0,
      stagger: settings.cardStagger,
      duration: settings.duration,
      ease: 'expo.out',
      onStart: () => {
        cards.forEach((card, index) => {
          gsap.delayedCall(index * settings.cardStagger + settings.cardTextDelay, () => {
            decodeMatrixReveals(card);
          });
        });
      },
      onComplete: resolve,
    });
  });
}

export async function hideArsenalContent(section, gsap) {
  const cards = Array.from(section.querySelectorAll('.bento-card'));
  const reversedCards = cards
    .map((card, index) => ({ card, index }))
    .reverse();

  await eraseMatrixReveals(section.querySelector('.bento__grid'));

  await Promise.all(reversedCards.map(({ card, index }, order) => (
    new Promise(resolve => {
      gsap.to(card, {
        ...getArsenalCardOrigin(index),
        opacity: 0,
        duration: 0.8,
        delay: order * 0.1,
        ease: 'expo.in',
        onComplete: resolve,
      });
    })
  )));

  await eraseMatrixReveals(section.querySelector('.section-header'));

  resetMatrixReveals(section);
}
