document.addEventListener("DOMContentLoaded", () => {
  initPlanning();
  initTabs();
  openTabFromHash();
});

function initPlanning() {
  const planningContainer = document.getElementById("week-planning");
  const todayTitle = document.getElementById("today-title");

  if (!planningContainer || !todayTitle) return;

  const week = [
    {
      dayIndex: 1,
      label: "Lundi",
      show: "Collision",
      description: "Show du lundi",
      type: "show"
    },
    {
      dayIndex: 2,
      label: "Mardi",
      show: "Préparation RP",
      description: "Promos, réactions et segments",
      type: "rp"
    },
    {
      dayIndex: 3,
      label: "Mercredi",
      show: "Cartes & annonces",
      description: "Préparation des prochains shows",
      type: "rp"
    },
    {
      dayIndex: 4,
      label: "Jeudi",
      show: "Genesis",
      description: "Show du jeudi",
      type: "show"
    },
    {
      dayIndex: 5,
      label: "Vendredi",
      show: "Dynasty",
      description: "Show du vendredi",
      type: "show"
    },
    {
      dayIndex: 6,
      label: "Samedi",
      show: "Réactions RP",
      description: "Retombées des shows",
      type: "rp"
    },
    {
      dayIndex: 0,
      label: "Dimanche",
      show: "Pré-show",
      description: "Préparation de Collision",
      type: "rp"
    }
  ];

  const today = new Date().getDay();
  const currentDay = week.find(day => day.dayIndex === today);

  todayTitle.textContent = `Aujourd’hui : ${currentDay.show}`;

  week.forEach(day => {
    const card = document.createElement("article");
    card.className = "day-card";

    if (day.dayIndex === today) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <strong>${day.label}</strong>
      <span>${day.show}</span>
      <small>${day.description}</small>
    `;

    planningContainer.appendChild(card);
  });
}

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
