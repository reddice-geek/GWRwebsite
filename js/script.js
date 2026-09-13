
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if(burger){ burger.addEventListener('click', ()=> navLinks.classList.toggle('open')); }

// tabs for rediffs
document.querySelectorAll('[data-tab-btn]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const tab = btn.getAttribute('data-tab-btn');
    document.querySelectorAll('[data-tab-btn]').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('[data-tab-panel]').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.querySelector(`[data-tab-panel="${tab}"]`);
    if(panel) panel.classList.add('active');
  });
});

// active nav highlight
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{
  const href = a.getAttribute('href');
  if(href===path || (path==='' && href==='index.html')) a.classList.add('active');
});
