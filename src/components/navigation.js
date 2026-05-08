export function initMobileMenu() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-menu__link');
  
  if(!burger || !menu) return;

  const toggleMenu = () => {
    const isOpen = burger.classList.contains('is-open');
    burger.classList.toggle('is-open');
    menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', !isOpen);
  };

  burger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}
