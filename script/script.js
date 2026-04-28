document.addEventListener("DOMContentLoaded", () => {
  initPlanning();
  initTabs();
  openTabFromHash();
});

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
    replay: "rediffs.html#collision"
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
    replay: "rediffs.html#genesis"
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
    replay: "rediffs.html#dynasty"
  }
];

let nextShowDate = null;
let nextShowData = null;

function initPlanning() {
  const hasPlanning =
    document.getElementById("next-show-card") &&
    document.getElementById("countdown") &&
    document.getElementById("past-shows") &&
    document.getElementById("upcoming-shows") &&
    document.getElementById("weekly-timeline");

  if (!hasPlanning) return;

  renderPlanning();
  updateCountdown();

  setInterval(updateCountdown, 1000);
  setInterval(renderPlanning, 30000);
}

function renderPlanning() {
  const now = new Date();

  const next = getNextShow(now);
  nextShowDate = next.date;
  nextShowData = next.show;

  renderNextShow(next.show, next.date);
  renderPastAndUpcoming(now);
  renderWeeklyTimeline(now);
}

function getShowDateForCurrentWeek(show, now) {
  const date = new Date(now);
  const currentDay = date.getDay();
  const diff = show.dayIndex - currentDay;

  date.setDate(date.getDate() + diff);
  date.setHours(show.hour, show.minute, 0, 0);

  return date;
}

function getNextShow(now) {
  const nextShows = GWR_SHOWS.map(show => {
    const date = getShowDateForCurrentWeek(show, now);

    if (date <= now) {
      date.setDate(date.getDate() + 7);
    }

    return { show, date };
  }).sort((a, b) => a.date - b.date);

  return nextShows[0];
}

function getShowEndDate(startDate, show) {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + show.durationHours);
  return endDate;
}

function getShowStatus(show, now) {
  const startDate = getShowDateForCurrentWeek(show, now);
  const endDate = getShowEndDate(startDate, show);

  if (now >= startDate && now < endDate) {
    return {
      status: "live",
      label: "En cours",
      date: startDate
    };
  }

  if (now >= endDate) {
    return {
      status: "past",
      label: "Show passé",
      date: startDate
    };
  }

  return {
    status: "upcoming",
    label: "À venir",
    date: startDate
  };
}

function renderNextShow(show, date) {
  const container = document.getElementById("next-show-card");
  if (!container) return;

  container.innerHTML = `
    <div class="next-show-logo">
      <img src="${show.logo}" alt="Logo ${show.name}">
    </div>

    <div class="next-show-info">
      <span class="status-pill next">Prochain show</span>
      <h3>${show.name}</h3>
      <p>
        ${show.dayLabel} à ${formatHour(show.hour, show.minute)}
      </p>
      <strong>${formatFullDate(date)}</strong>
      <a href="${show.replay}" role="button">Voir la page du show</a>
    </div>
  `;
}

function renderPastAndUpcoming(now) {
  const pastContainer = document.getElementById("past-shows");
  const upcomingContainer = document.getElementById("upcoming-shows");

  if (!pastContainer || !upcomingContainer) return;

  const statuses = GWR_SHOWS.map(show => {
    const data = getShowStatus(show, now);
    return {
      ...data,
      show
    };
  });

  const pastShows = statuses
    .filter(item => item.status === "past")
    .sort((a, b) => b.date - a.date);

  const liveShows = statuses
    .filter(item => item.status === "live");

  const upcomingShows = statuses
    .filter(item => item.status === "upcoming")
    .sort((a, b) => a.date - b.date);

  pastContainer.innerHTML = "";

  if (pastShows.length === 0) {
    pastContainer.innerHTML = `<p class="empty-message">Aucun show passé cette semaine.</p>`;
  } else {
    pastShows.forEach(item => {
      pastContainer.appendChild(createScheduleCard(item.show, item.date, "past", "Show passé"));
    });
  }

  upcomingContainer.innerHTML = "";

  liveShows.forEach(item => {
    upcomingContainer.appendChild(createScheduleCard(item.show, item.date, "live", "En cours"));
  });

  upcomingShows.forEach(item => {
    upcomingContainer.appendChild(createScheduleCard(item.show, item.date, "upcoming", "À venir"));
  });

  if (liveShows.length === 0 && upcomingShows.length === 0) {
    const next = getNextShow(now);
    upcomingContainer.appendChild(createScheduleCard(next.show, next.date, "next-week", "Semaine prochaine"));
  }
}

function createScheduleCard(show, date, status, label) {
  const card = document.createElement("article");
  card.className = `show-mini-card ${status}`;

  card.innerHTML = `
    <img src="${show.logo}" alt="Logo ${show.name}">
    <div>
      <span class="status-pill ${status}">${label}</span>
      <h4>${show.name}</h4>
      <p>${show.dayLabel} • ${formatHour(show.hour, show.minute)}</p>
      <small>${formatFullDate(date)}</small>
    </div>
  `;

  return card;
}

function renderWeeklyTimeline(now) {
  const container = document.getElementById("weekly-timeline");
  if (!container) return;

  container.innerHTML = "";

  GWR_SHOWS.forEach(show => {
    const data = getShowStatus(show, now);
    const item = document.createElement("article");

    item.className = `timeline-show ${data.status}`;
    item.innerHTML = `
      <span>${show.dayLabel}</span>
      <img src="${show.logo}" alt="Logo ${show.name}">
      <strong>${formatHour(show.hour, show.minute)}</strong>
      <small>${data.label}</small>
    `;

    container.appendChild(item);
  });
}

function updateCountdown() {
  const countdown = document.getElementById("countdown");
  if (!countdown || !nextShowDate) return;

  const now = new Date();
  const distance = nextShowDate - now;

  if (distance <= 0) {
    renderPlanning();
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.innerHTML = `
    <span>${String(days).padStart(2, "0")}<small>jours</small></span>
    <span>${String(hours).padStart(2, "0")}<small>heures</small></span>
    <span>${String(minutes).padStart(2, "0")}<small>min</small></span>
    <span>${String(seconds).padStart(2, "0")}<small>sec</small></span>
  `;
}

function formatHour(hour, minute) {
  return `${String(hour).padStart(2, "0")}h${minute > 0 ? String(minute).padStart(2, "0") : ""}`;
}

function formatFullDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

/* Onglets rediffs */
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

      const selectedPanel = document.getElementById(tabName);
      if (selectedPanel) {
        selectedPanel.classList.add("active");
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
