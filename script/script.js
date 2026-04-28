document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  injectTopTicker();
  initDynamicPlanning();
  initTabs();
  openTabFromHash();
});

/* ================================
   CONFIGURATION DES SHOWS GWR
================================ */

const GWR_SHOWS = [
  {
    id: "collision",
    name: "GWR Collision",
    shortName: "Collision",
    dayIndex: 1,
    dayLabel: "Lundi",
    hour: 19,
    minute: 0,
    durationHours: 2,
    logo: "img/gwr-collision.png",
    color: "red",
    link: "rediffs.html#collision"
  },
  {
    id: "genesis",
    name: "GWR Genesis",
    shortName: "Genesis",
    dayIndex: 4,
    dayLabel: "Jeudi",
    hour: 19,
    minute: 0,
    durationHours: 2,
    logo: "img/gwr-genesis.png",
    color: "purple",
    link: "rediffs.html#genesis"
  },
  {
    id: "dynasty",
    name: "GWR Dynasty",
    shortName: "Dynasty",
    dayIndex: 5,
    dayLabel: "Vendredi",
    hour: 20,
    minute: 0,
    durationHours: 2,
    logo: "img/gwr-dynasty.png",
    color: "blue",
    link: "rediffs.html#dynasty"
  }
];

let countdownTarget = null;
let countdownMode = "next";

/* ================================
   MENU ACTIF
================================ */

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (!href) return;

    const hrefPage = href.split("#")[0];

    if (hrefPage === currentPage) {
      link.classList.add("active-nav");
    }
  });
}

/* ================================
   TICKER DYNAMIQUE EN HAUT
================================ */

function injectTopTicker() {
  const nav = document.querySelector("nav.container-fluid");
  if (!nav) return;

  const ticker = document.createElement("div");
  ticker.className = "gwr-ticker";

  ticker.innerHTML = `
    <div class="gwr-ticker-track">
      <span>Collision • Lundi 19h</span>
      <span>Genesis • Jeudi 19h</span>
      <span>Dynasty • Vendredi 20h</span>
      <span>Rediffusions disponibles sur YouTube</span>
      <span>Global Wrestling Revolution</span>
      <span>Collision • Lundi 19h</span>
      <span>Genesis • Jeudi 19h</span>
      <span>Dynasty • Vendredi 20h</span>
      <span>Rediffusions disponibles sur YouTube</span>
      <span>Global Wrestling Revolution</span>
    </div>
  `;

  nav.insertAdjacentElement("afterend", ticker);
}

/* ================================
   PLANNING DYNAMIQUE
================================ */

function initDynamicPlanning() {
  const hasNewPlanning =
    document.getElementById("next-show-card") &&
    document.getElementById("countdown") &&
    document.getElementById("past-shows") &&
    document.getElementById("upcoming-shows") &&
    document.getElementById("weekly-timeline");

  const hasOldPlanning =
    document.getElementById("week-planning") &&
    document.getElementById("today-title");

  if (hasNewPlanning) {
    renderFullPlanning();
    updateCountdown();

    setInterval(() => {
      renderFullPlanning();
    }, 30000);

    setInterval(() => {
      updateCountdown();
    }, 1000);
  }

  if (hasOldPlanning) {
    renderSimplePlanning();
  }
}

function getStartDateForThisWeek(show, now = new Date()) {
  const date = new Date(now);
  const currentDay = date.getDay();
  const diff = show.dayIndex - currentDay;

  date.setDate(date.getDate() + diff);
  date.setHours(show.hour, show.minute, 0, 0);

  return date;
}

function getEndDate(startDate, show) {
  const end = new Date(startDate);
  end.setHours(end.getHours() + show.durationHours);
  return end;
}

function getStatus(show, now = new Date()) {
  const start = getStartDateForThisWeek(show, now);
  const end = getEndDate(start, show);

  if (now >= start && now < end) {
    return {
      status: "live",
      label: "En cours",
      start,
      end
    };
  }

  if (now >= end) {
    return {
      status: "past",
      label: "Show passé",
      start,
      end
    };
  }

  return {
    status: "upcoming",
    label: "À venir",
    start,
    end
  };
}

function getNextShow(now = new Date()) {
  const liveShow = GWR_SHOWS
    .map(show => ({ show, ...getStatus(show, now) }))
    .find(item => item.status === "live");

  if (liveShow) {
    return {
      show: liveShow.show,
      date: liveShow.end,
      mode: "live",
      label: "Show en cours"
    };
  }

  const upcoming = GWR_SHOWS.map(show => {
    let date = getStartDateForThisWeek(show, now);

    if (date <= now) {
      date.setDate(date.getDate() + 7);
    }

    return {
      show,
      date
    };
  }).sort((a, b) => a.date - b.date);

  return {
    show: upcoming[0].show,
    date: upcoming[0].date,
    mode: "next",
    label: "Prochain show"
  };
}

function renderFullPlanning() {
  const now = new Date();
  const next = getNextShow(now);

  countdownTarget = next.date;
  countdownMode = next.mode;

  renderMainNextShow(next);
  renderPastShows(now);
  renderUpcomingShows(now);
  renderTimeline(now);
}

function renderMainNextShow(next) {
  const container = document.getElementById("next-show-card");
  if (!container) return;

  const isLive = next.mode === "live";

  container.innerHTML = `
    <div class="next-show-logo ${next.show.color}">
      <img src="${next.show.logo}" alt="Logo ${next.show.name}">
    </div>

    <div class="next-show-info ${next.show.color}">
      <span class="status-pill ${isLive ? "live" : "next"}">
        ${isLive ? "En cours maintenant" : "Prochain show"}
      </span>

      <h3>${next.show.name}</h3>

      <p>
        ${next.show.dayLabel} • ${formatTime(next.show.hour, next.show.minute)}
      </p>

      <strong>
        ${isLive ? "Fin estimée : " : "Début : "}
        ${formatDate(next.date)}
      </strong>

      <a href="${next.show.link}" role="button">
        Voir la page du show
      </a>
    </div>
  `;
}

function renderPastShows(now) {
  const container = document.getElementById("past-shows");
  if (!container) return;

  container.innerHTML = "";

  const pastShows = GWR_SHOWS
    .map(show => ({ show, ...getStatus(show, now) }))
    .filter(item => item.status === "past")
    .sort((a, b) => b.start - a.start);

  if (!pastShows.length) {
    container.innerHTML = `<p class="empty-message">Aucun show passé cette semaine.</p>`;
    return;
  }

  pastShows.forEach(item => {
    container.appendChild(createMiniShowCard(item.show, item.start, "past", "Show passé"));
  });
}

function renderUpcomingShows(now) {
  const container = document.getElementById("upcoming-shows");
  if (!container) return;

  container.innerHTML = "";

  const currentWeekShows = GWR_SHOWS
    .map(show => ({ show, ...getStatus(show, now) }))
    .filter(item => item.status === "live" || item.status === "upcoming")
    .sort((a, b) => a.start - b.start);

  if (currentWeekShows.length) {
    currentWeekShows.forEach(item => {
      container.appendChild(
        createMiniShowCard(
          item.show,
          item.start,
          item.status,
          item.status === "live" ? "En cours" : "À venir"
        )
      );
    });

    return;
  }

  const next = getNextShow(now);
  container.appendChild(createMiniShowCard(next.show, next.date, "next-week", "Semaine prochaine"));
}

function createMiniShowCard(show, date, status, label) {
  const card = document.createElement("article");
  card.className = `show-mini-card ${status}`;

  card.innerHTML = `
    <img src="${show.logo}" alt="Logo ${show.name}">

    <div>
      <span class="status-pill ${status}">${label}</span>
      <h4>${show.name}</h4>
      <p>${show.dayLabel} • ${formatTime(show.hour, show.minute)}</p>
      <small>${formatDate(date)}</small>
    </div>
  `;

  return card;
}

function renderTimeline(now) {
  const container = document.getElementById("weekly-timeline");
  if (!container) return;

  container.innerHTML = "";

  GWR_SHOWS.forEach(show => {
    const statusData = getStatus(show, now);

    const item = document.createElement("article");
    item.className = `timeline-show ${statusData.status}`;

    item.innerHTML = `
      <span>${show.dayLabel}</span>
      <img src="${show.logo}" alt="Logo ${show.name}">
      <strong>${formatTime(show.hour, show.minute)}</strong>
      <small>${statusData.label}</small>
    `;

    container.appendChild(item);
  });
}

function updateCountdown() {
  const countdown = document.getElementById("countdown");
  if (!countdown || !countdownTarget) return;

  const now = new Date();
  const distance = countdownTarget.getTime() - now.getTime();

  if (distance <= 0) {
    renderFullPlanning();
    return;
  }

  const secondsTotal = Math.floor(distance / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  const label = countdownMode === "live" ? "Fin du show dans" : "Début du show dans";
  const labelElement = document.querySelector(".countdown-label");

  if (labelElement) {
    labelElement.textContent = label;
  }

  countdown.innerHTML = `
    <span>${pad(days)}<small>jours</small></span>
    <span>${pad(hours)}<small>heures</small></span>
    <span>${pad(minutes)}<small>min</small></span>
    <span>${pad(seconds)}<small>sec</small></span>
  `;
}

/* Compatibilité avec l’ancien planning */
function renderSimplePlanning() {
  const container = document.getElementById("week-planning");
  const title = document.getElementById("today-title");

  if (!container || !title) return;

  const now = new Date();

  container.innerHTML = "";

  const week = [
    { label: "Lundi", show: "Collision", desc: "19h", dayIndex: 1 },
    { label: "Mardi", show: "Préparation RP", desc: "Promos et segments", dayIndex: 2 },
    { label: "Mercredi", show: "Cartes & annonces", desc: "Préparation des shows", dayIndex: 3 },
    { label: "Jeudi", show: "Genesis", desc: "19h", dayIndex: 4 },
    { label: "Vendredi", show: "Dynasty", desc: "20h", dayIndex: 5 },
    { label: "Samedi", show: "Réactions RP", desc: "Retombées des shows", dayIndex: 6 },
    { label: "Dimanche", show: "Pré-show", desc: "Préparation Collision", dayIndex: 0 }
  ];

  const currentDay = now.getDay();
  const next = getNextShow(now);

  title.textContent = `${next.label} : ${next.show.name}`;

  week.forEach(day => {
    const card = document.createElement("article");
    card.className = "day-card";

    if (day.dayIndex === currentDay) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <strong>${day.label}</strong>
      <span>${day.show}</span>
      <small>${day.desc}</small>
    `;

    container.appendChild(card);
  });
}

/* ================================
   REDIFFS : ONGLETS
================================ */

function initTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  if (!buttons.length || !panels.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;

      buttons.forEach(btn => btn.classList.remove("active"));
      panels.forEach(panel => panel.classList.remove("active"));

      button.classList.add("active");

      const panel = document.getElementById(tabName);

      if (panel) {
        panel.classList.add("active");
        history.replaceState(null, "", `#${tabName}`);
      }
    });
  });
}

function openTabFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;

  const button = document.querySelector(`.tab-button[data-tab="${hash}"]`);
  const panel = document.getElementById(hash);

  if (!button || !panel) return;

  document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(item => item.classList.remove("active"));

  button.classList.add("active");
  panel.classList.add("active");
}

/* ================================
   OUTILS
================================ */

function pad(number) {
  return String(number).padStart(2, "0");
}

function formatTime(hour, minute) {
  return `${pad(hour)}h${minute > 0 ? pad(minute) : ""}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
