import { gsap } from 'gsap';

const instances = new WeakMap();

export function initPricingTickets(section) {
  if (!section || instances.has(section)) return instances.get(section);

  const ticketsRoot = section.querySelector('[data-pricing-tickets]');
  const detailRoot = section.querySelector('[data-pricing-detail]');
  if (!ticketsRoot || !detailRoot) return null;

  const tickets = Array.from(ticketsRoot.querySelectorAll('.ticket'));
  const panes = Array.from(detailRoot.querySelectorAll('.pricing-pane'));
  const overviewBtn = ticketsRoot.querySelector('.pricing-overview-btn');

  function setActivePane(name) {
    panes.forEach(pane => {
      const isMatch = pane.getAttribute('data-pane') === name;
      pane.classList.toggle('is-active', isMatch);
    });
    if (overviewBtn) {
      overviewBtn.classList.toggle('is-active', name === 'default');
    }
  }

  function setActiveTicket(name) {
    tickets.forEach(t => {
      t.classList.toggle('is-active', t.getAttribute('data-ticket') === name);
    });
  }

  function activate(name) {
    if (!name) return;
    setActiveTicket(name === 'default' ? null : name);
    setActivePane(name);
  }

  tickets.forEach(ticket => {
    ticket.addEventListener('click', () => {
      activate(ticket.getAttribute('data-ticket'));
    });
    ticket.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(ticket.getAttribute('data-ticket'));
      }
    });
  });

  if (overviewBtn) {
    overviewBtn.addEventListener('click', () => activate('default'));
  }

  function reset() {
    setActiveTicket(null);
    setActivePane('default');
  }

  const api = { activate, reset, tickets, panes, overviewBtn };
  instances.set(section, api);
  return api;
}

function forceCleanInline(elements) {
  elements.forEach(el => {
    if (!el) return;
    el.style.opacity = '';
    el.style.transform = '';
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
    el.style.removeProperty('translate');
    el.style.removeProperty('rotate');
    el.style.removeProperty('scale');
  });
}

export async function revealPricingTickets(section) {
  if (!section) return;
  const api = initPricingTickets(section);
  if (!api) return;

  api.reset();

  const tickets = api.tickets;
  const allPanes = api.panes;
  const overviewBtn = api.overviewBtn;
  const activePane = section.querySelector('.pricing-pane.is-active');

  // Force-clean any inline styles left from previous hide
  forceCleanInline([...tickets, ...allPanes, overviewBtn]);
  gsap.set([...tickets, ...allPanes, overviewBtn].filter(Boolean), { clearProps: 'all' });

  const tl = gsap.timeline();

  if (overviewBtn) {
    tl.from(overviewBtn, {
      opacity: 0,
      y: -12,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);
  }

  tl.from(tickets, {
    opacity: 0,
    x: -50,
    rotateY: -12,
    duration: 0.65,
    stagger: 0.1,
    ease: 'power3.out',
  }, 0.1);

  if (activePane) {
    tl.from(activePane, {
      opacity: 0,
      x: 30,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.15);
  }

  await tl.then();

  // Final cleanup: remove any residual inline styles
  gsap.set([...tickets, activePane, overviewBtn].filter(Boolean), { clearProps: 'opacity,x,y,transform,rotateY' });
}

export async function hidePricingTickets(section) {
  if (!section) return;
  const tickets = section.querySelectorAll('.ticket');
  const panes = section.querySelectorAll('.pricing-pane.is-active');
  const overviewBtn = section.querySelector('.pricing-overview-btn');

  await gsap.to([...tickets, ...panes, overviewBtn].filter(Boolean), {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
  });

  // Critical: clear inline styles so next visit isn't stuck at opacity:0
  gsap.set([...tickets, ...panes, overviewBtn].filter(Boolean), { clearProps: 'all' });
  forceCleanInline([...tickets, ...panes, overviewBtn]);
}
