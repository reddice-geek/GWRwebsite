const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

document.querySelectorAll('[data-tab-btn]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab-btn');
    document.querySelectorAll('[data-tab-btn]').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    document.querySelectorAll('[data-tab-panel]').forEach(panel => {
      panel.classList.toggle('active', panel.getAttribute('data-tab-panel') === tab);
    });
  });
});

const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path) a.classList.add('active');
});
