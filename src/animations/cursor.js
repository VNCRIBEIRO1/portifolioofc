export function initCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorText = document.querySelector('.cursor__text');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Lida com elementos interativos
  const interactables = document.querySelectorAll('a, button, [data-cursor-text]');
  
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active');
      const text = el.getAttribute('data-cursor-text');
      if (text && cursorText) cursorText.innerText = text;
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
      if (cursorText) cursorText.innerText = '';
    });
  });
}
