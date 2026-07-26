document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  injectTicker();
  initTabs();
  renderSuspension();
});

const GWR_SHOWS = [
  { id: "collision", name: "GWR Collision", dayLabel: "Lundi", hour: 19, logo: "img/gwr-collision.png", color: "red", suspended: "12/05/2026", link: "#rediffs" },
  { id: "genesis", name: "GWR Genesis", dayLabel: "Jeudi", hour: 19, logo: "img/gwr-genesis.png", color: "purple", suspended: "07/05/2026", link: "#rediffs" },
  { id: "dynasty", name: "GWR Dynasty", dayLabel: "Vendredi", hour: 20, logo: "img/gwr-dynasty.png", color: "blue", suspended: "12/05/2026", link: "#rediffs" }
];

function setActiveNav(){
  const links = document.querySelectorAll("nav .links a");
  links.forEach(l => {
    l.addEventListener("click", () => {
      links.forEach(x => x.classList.remove("active"));
      l.classList.add("active");
    });
  });
}

function injectTicker(){
  const nav = document.querySelector("nav");
  if(!nav) return;
  const ticker = document.createElement("div");
  ticker.className = "gwr-ticker";
  ticker.innerHTML = `<div class="gwr-ticker-track">
    <span>Collision • Lundi 19h [SUSPENDU 12/05/2026]</span>
    <span>Genesis • Jeudi 19h [ARRETE 07/05/2026]</span>
    <span>Dynasty • Vendredi 20h [SUSPENDU 12/05/2026]</span>
    <span>FEDERATION EN PAUSE</span>
    <span>Discord E-Fed: discord.com/invite/2U9SatYNbg</span>
    <span>Global Wrestling Revolution</span>
    <span>Collision • Lundi 19h [SUSPENDU]</span>
    <span>Genesis • Jeudi 19h [ARRETE]</span>
    <span>Dynasty • Vendredi 20h [SUSPENDU]</span>
    <span>FEDERATION EN PAUSE</span>
  </div>`;
  nav.insertAdjacentElement("afterend", ticker);
}

function renderSuspension(){
  const el = document.getElementById("suspend-detail");
  if(!el) return;
  el.innerHTML = `
    <h3>🚨 Fédération en pause</h3>
    <p><strong>Shows suspendus depuis le 12/05/2026</strong><br>
    <strong>Genesis arrêté depuis le 07/05/2026</strong></p>
    <p>La Global Wrestling Revolution est actuellement en pause. Les shows reprendront un jour quand l'engouement des joueurs qui veulent créer des histoires, des rivalités et faire le show avant de faire de la win voudront créer des shows spectaculaires.</p>
    <p><em>Objectif GWR : Spectaculaire avant la win. RP, storytelling, rivalités d'abord.</em></p>
    <a href="https://discord.com/invite/2U9SatYNbg" target="_blank" class="btn btn-discord">Rejoindre le Discord pour le retour</a>
  `;
}

function initTabs(){
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");
  if(!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(tab)?.classList.add("active");
      history.replaceState(null,"","#"+tab);
    });
  });
  const hash = location.hash.replace("#","");
  if(hash){
    const b = document.querySelector(`.tab-button[data-tab="${hash}"]`);
    if(b) b.click();
  }
}
