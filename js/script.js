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


// Planning Genesis automatique : chaque jeudi à 19 h (heure de Paris).
// Si l'on est jeudi avant 19 h, la date du jour est incluse ; sinon, on passe au jeudi suivant.
(function renderGenesisSchedule() {
  const schedule = document.getElementById('genesisSchedule');
  const nextDateTargets = document.querySelectorAll('[data-next-genesis]');
  if (!schedule && !nextDateTargets.length) return;

  const now = new Date();
  const parisNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const today = new Date(parisNow.getFullYear(), parisNow.getMonth(), parisNow.getDate());
  const weekday = today.getDay(); // dimanche = 0, jeudi = 4
  let daysUntilThursday = (4 - weekday + 7) % 7;
  if (daysUntilThursday === 0 &&
      (parisNow.getHours() > 19 || (parisNow.getHours() === 19 && parisNow.getMinutes() > 0))) {
    daysUntilThursday = 7;
  }
  const firstThursday = new Date(today);
  firstThursday.setDate(today.getDate() + daysUntilThursday);

  const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const capitalize = value => value.charAt(0).toLocaleUpperCase('fr-FR') + value.slice(1);
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(firstThursday);
    date.setDate(firstThursday.getDate() + i * 7);
    dates.push(date);
  }

  nextDateTargets.forEach(target => {
    target.textContent = `${capitalize(dateFormatter.format(dates[0]))} à 19 h`;
  });

  if (schedule) {
    schedule.replaceChildren();
    dates.forEach((date, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      const top = document.createElement('div');
      top.className = 'card-top gold';
      const body = document.createElement('div');
      body.className = 'card-body';
      const title = document.createElement('strong');
      title.textContent = `Genesis — ${capitalize(dateFormatter.format(date))}`;
      const line = document.createElement('small');
      line.className = 'muted';
      line.textContent = 'Début à 19 h';
      body.append(title, document.createElement('br'), line);
      if (index === 0) {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = 'Prochain rendez-vous';
        body.prepend(pill, document.createElement('br'));
      }
      card.append(top, body);
      schedule.append(card);
    });
  }
})();
