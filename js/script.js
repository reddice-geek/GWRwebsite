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


// GWR multilingual export support: French, English, Spanish, Italian, Japanese, Chinese, German.
const gwrTranslations = {'en': {'Accueil': 'Home', 'Shows': 'Shows', 'Roster unique': 'Unified roster', 'Planning': 'Schedule', 'Rediffs': 'Replays', '💬 Discord GWR': '💬 GWR Discord', 'Nouvelle ère': 'New Era', 'Global Wrestling Revolution • Nouvelle ère': 'Global Wrestling Revolution • New Era', 'LES SHOWS ': 'THE GWR SHOWS ', 'Le roster unique': 'Unified roster', 'Roster fusionné': 'Unified roster', 'À propos de Genesis': 'About Genesis', 'Consulter le planning': 'View schedule', 'Toutes les dates': 'All dates', 'Chaque jeudi • 19 h': 'Every Thursday • 7 PM', '⚡ CHAQUE JEUDI À 19 H': '⚡ EVERY THURSDAY AT 7 PM', '🎙️ Équipe de commentaires': '🎙️ Commentary Team', '🎙️ Commentateurs': '🎙️ Commentators', 'Cédric — Reddice': 'Cédric — Reddice', 'Tymothy — DrySko (« Voir le Gaulois »)': 'Tymothy — DrySko (“See the Gaul”)', 'Prochains rendez-vous': 'Upcoming Shows', 'Début à 19 h': 'Starts at 7 PM', 'Genesis est le rendez-vous hebdomadaire de la GWR. Collision et Dynasty restent en pause et leurs effectifs forment désormais un roster unique.': 'Genesis is GWR’s weekly show. Collision and Dynasty are on hiatus, and their rosters have been merged into one unified roster.', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesis is scheduled every Thursday at 7 PM. Match cards will be announced separately.', 'Une fédération. Un roster. Une nouvelle ère.': 'One federation. One roster. A new era.', 'FÉDÉRATION': 'FEDERATION', 'Show principal': 'Main show', 'SHOW PRINCIPAL': 'MAIN SHOW', 'Collision — en pause': 'Collision — on hiatus', 'Dynasty — en pause': 'Dynasty — on hiatus', 'Suivre les annonces sur Discord': 'Follow announcements on Discord', 'Voir le roster unique': 'View unified roster', 'Le chapitre Genesis': 'The Genesis Chapter', 'La GWR se recentre': 'GWR Refocuses', 'Tout savoir': 'Learn More', 'Le calendrier précédent est obsolète : Collision et Dynasty sont en pause pour préparer Genesis. Le planning ci-dessous calcule automatiquement les prochains jeudis à 19 h.': 'The previous schedule is outdated: Collision and Dynasty are on hiatus while Genesis is prepared. The schedule below automatically calculates upcoming Thursdays at 7 PM.', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': 'Upcoming dates are calculated automatically — no manual updates needed.', 'Chargement automatique des prochaines dates…': 'Automatically loading upcoming dates…', 'Roster commun': 'Unified roster', 'Archives • Épisodes précédents': 'Archives • Previous episodes', 'Les anciens épisodes restent disponibles pour les revoir. Ces playlists correspondent aux anciennes périodes de Collision, Genesis et Dynasty ; elles ne représentent pas le planning actuel.': 'Past episodes remain available to watch. These playlists cover previous Collision, Genesis and Dynasty eras; they do not represent the current schedule.', 'Pourquoi le planning est vide ?': 'Why is the schedule empty?', 'La GWR réorganise son format autour d’un seul show et d’un roster unique. Pour éviter les informations contradictoires, les anciens rendez-vous de Collision et Dynasty ne sont plus présentés comme des événements à venir.': 'GWR is reorganizing around one show and one unified roster. To avoid conflicting information, past Collision and Dynasty dates are no longer listed as upcoming events.', 'Collision et Dynasty sont en pause': 'Collision and Dynasty are on hiatus', 'Genesis — retour en préparation': 'Genesis — return in preparation', 'Mise à jour • Jeudi 29 octobre 2026': 'Updated • Thursday, October 29, 2026', 'GWR • Nouvelle ère Genesis • Mise à jour : 29 octobre 2026': 'GWR • Genesis New Era • Updated: October 29, 2026', 'Le retour de Genesis': 'The Return of Genesis', 'Mise à jour 29/10/2026': 'Updated 29/10/2026'}, 'es': {'Accueil': 'Inicio', 'Shows': 'Programas', 'Roster unique': 'Plantilla unificada', 'Planning': 'Calendario', 'Rediffs': 'Repeticiones', '💬 Discord GWR': '💬 Discord GWR', 'Nouvelle ère': 'Nueva era', 'LES SHOWS ': 'LOS PROGRAMAS ', 'À propos de Genesis': 'Sobre Genesis', 'Consulter le planning': 'Ver calendario', 'Toutes les dates': 'Todas las fechas', 'Chaque jeudi • 19 h': 'Cada jueves • 19:00', '⚡ CHAQUE JEUDI À 19 H': '⚡ CADA JUEVES A LAS 19:00', '🎙️ Équipe de commentaires': '🎙️ Equipo de comentaristas', '🎙️ Commentateurs': '🎙️ Comentaristas', 'Prochains rendez-vous': 'Próximos eventos', 'Début à 19 h': 'Comienza a las 19:00', 'Une fédération. Un roster. Une nouvelle ère.': 'Una federación. Una plantilla. Una nueva era.', 'FÉDÉRATION': 'FEDERACIÓN', 'Show principal': 'Programa principal', 'SHOW PRINCIPAL': 'PROGRAMA PRINCIPAL', 'Collision — en pause': 'Collision — en pausa', 'Dynasty — en pause': 'Dynasty — en pausa', 'Suivre les annonces sur Discord': 'Seguir anuncios en Discord', 'Voir le roster unique': 'Ver plantilla unificada', 'Le chapitre Genesis': 'El capítulo Genesis', 'La GWR se recentre': 'La GWR se reorganiza', 'Tout savoir': 'Más información', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesis se celebra cada jueves a las 19:00. Las carteleras se anunciarán por separado.', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': 'Las próximas fechas se calculan automáticamente: no hace falta actualizarlas manualmente.', 'Pourquoi le planning est vide ?': '¿Por qué está vacío el calendario?', 'Roster commun': 'Plantilla unificada', 'Archives • Épisodes précédents': 'Archivo • Episodios anteriores', 'Le retour de Genesis': 'El regreso de Genesis'}, 'it': {'Accueil': 'Home', 'Shows': 'Show', 'Roster unique': 'Roster unico', 'Planning': 'Calendario', 'Rediffs': 'Replay', '💬 Discord GWR': '💬 Discord GWR', 'Nouvelle ère': 'Nuova era', 'LES SHOWS ': 'GLI SHOW GWR ', 'À propos de Genesis': 'Informazioni su Genesis', 'Consulter le planning': 'Vedi calendario', 'Toutes les dates': 'Tutte le date', 'Chaque jeudi • 19 h': 'Ogni giovedì • 19:00', '⚡ CHAQUE JEUDI À 19 H': '⚡ OGNI GIOVEDÌ ALLE 19:00', '🎙️ Équipe de commentaires': '🎙️ Team di commento', '🎙️ Commentateurs': '🎙️ Commentatori', 'Prochains rendez-vous': 'Proimi appuntamenti', 'Début à 19 h': 'Inizio alle 19:00', 'Une fédération. Un roster. Une nouvelle ère.': 'Una federazione. Un roster. Una nuova era.', 'FÉDÉRATION': 'FEDERAZIONE', 'Show principal': 'Show principale', 'SHOW PRINCIPAL': 'SHOW PRINCIPALE', 'Collision — en pause': 'Collision — in pausa', 'Dynasty — en pause': 'Dynasty — in pausa', 'Suivre les annonces sur Discord': 'Segui gli annunci su Discord', 'Voir le roster unique': 'Vedi il roster unico', 'Le chapitre Genesis': 'Il capitolo Genesis', 'La GWR se recentre': 'La GWR si rinnova', 'Tout savoir': 'Scopri di più', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesis va in onda ogni giovedì alle 19:00. Le card degli incontri saranno annunciate separatamente.', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': 'Le prossime date vengono calcolate automaticamente: non serve aggiornarle manualmente.', 'Pourquoi le planning est vide ?': 'Perché il calendario è vuoto?', 'Roster commun': 'Roster unico', 'Archives • Épisodes précédents': 'Archivio • Episodi precedenti', 'Le retour de Genesis': 'Il ritorno di Genesis'}, 'ja': {'Accueil': 'ホーム', 'Shows': 'ショー', 'Roster unique': '統合ロスター', 'Planning': 'スケジュール', 'Rediffs': '過去配信', '💬 Discord GWR': '💬 GWR Discord', 'Nouvelle ère': '新時代', 'LES SHOWS ': 'GWRのショー ', 'À propos de Genesis': 'Genesisについて', 'Consulter le planning': '予定を見る', 'Toutes les dates': '全日程', 'Chaque jeudi • 19 h': '毎週木曜日 • 19:00', '⚡ CHAQUE JEUDI À 19 H': '⚡ 毎週木曜日 19:00', '🎙️ Équipe de commentaires': '🎙️ 実況チーム', '🎙️ Commentateurs': '🎙️ 実況者', 'Prochains rendez-vous': '今後の予定', 'Début à 19 h': '開始 19:00', 'Une fédération. Un roster. Une nouvelle ère.': 'ひとつの団体。ひとつのロスター。新時代。', 'FÉDÉRATION': '団体', 'Show principal': 'メインショー', 'SHOW PRINCIPAL': 'メインショー', 'Collision — en pause': 'Collision — 休止中', 'Dynasty — en pause': 'Dynasty — 休止中', 'Suivre les annonces sur Discord': 'Discordで最新情報を確認', 'Voir le roster unique': '統合ロスターを見る', 'Le chapitre Genesis': 'Genesisの章', 'La GWR se recentre': 'GWRの再編', 'Tout savoir': '詳しく見る', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesisは毎週木曜日19:00に開催予定です。対戦カードは別途発表されます。', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': '次回以降の日程は自動計算されるため、手動更新は不要です。', 'Pourquoi le planning est vide ?': 'スケジュールが空なのはなぜ？', 'Roster commun': '統合ロスター', 'Archives • Épisodes précédents': 'アーカイブ • 過去のエピソード', 'Le retour de Genesis': 'Genesisの復活'}, 'zh': {'Accueil': '首页', 'Shows': '节目', 'Roster unique': '统一选手名单', 'Planning': '赛程', 'Rediffs': '回放', '💬 Discord GWR': '💬 GWR Discord', 'Nouvelle ère': '新时代', 'LES SHOWS ': 'GWR节目 ', 'À propos de Genesis': '关于 Genesis', 'Consulter le planning': '查看赛程', 'Toutes les dates': '全部日期', 'Chaque jeudi • 19 h': '每周四 • 19:00', '⚡ CHAQUE JEUDI À 19 H': '⚡ 每周四 19:00', '🎙️ Équipe de commentaires': '🎙️ 解说团队', '🎙️ Commentateurs': '🎙️ 解说员', 'Prochains rendez-vous': '接下来的活动', 'Début à 19 h': '19:00 开始', 'Une fédération. Un roster. Une nouvelle ère.': '一个联盟。一份名单。一个新时代。', 'FÉDÉRATION': '摔角联盟', 'Show principal': '主节目', 'SHOW PRINCIPAL': '主节目', 'Collision — en pause': 'Collision — 暂停', 'Dynasty — en pause': 'Dynasty — 暂停', 'Suivre les annonces sur Discord': '在 Discord 关注公告', 'Voir le roster unique': '查看统一名单', 'Le chapitre Genesis': 'Genesis篇章', 'La GWR se recentre': 'GWR重新整合', 'Tout savoir': '了解更多', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesis计划于每周四19:00举行。比赛对阵表将另行公布。', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': '后续日期将自动计算，无需手动更新。', 'Pourquoi le planning est vide ?': '为什么赛程为空？', 'Roster commun': '统一名单', 'Archives • Épisodes précédents': '视频档案 • 往期节目', 'Le retour de Genesis': 'Genesis回归'}, 'de': {'Accueil': 'Startseite', 'Shows': 'Shows', 'Roster unique': 'Gemeinsamer Kader', 'Planning': 'Terminplan', 'Rediffs': 'Wiederholungen', '💬 Discord GWR': '💬 GWR Discord', 'Nouvelle ère': 'Neue Ära', 'LES SHOWS ': 'DIE GWR-SHOWS ', 'À propos de Genesis': 'Über Genesis', 'Consulter le planning': 'Terminplan ansehen', 'Toutes les dates': 'Alle Termine', 'Chaque jeudi • 19 h': 'Jeden Donnerstag • 19 Uhr', '⚡ CHAQUE JEUDI À 19 H': '⚡ JEDEN DONNERSTAG UM 19 UHR', '🎙️ Équipe de commentaires': '🎙️ Kommentatorenteam', '🎙️ Commentateurs': '🎙️ Kommentatoren', 'Prochains rendez-vous': 'Nächste Termine', 'Début à 19 h': 'Beginn um 19 Uhr', 'Une fédération. Un roster. Une nouvelle ère.': 'Eine Liga. Ein Kader. Eine neue Ära.', 'FÉDÉRATION': 'LIGA', 'Show principal': 'Hauptshow', 'SHOW PRINCIPAL': 'HAUPTSHOW', 'Collision — en pause': 'Collision — pausiert', 'Dynasty — en pause': 'Dynasty — pausiert', 'Suivre les annonces sur Discord': 'Ankündigungen auf Discord verfolgen', 'Voir le roster unique': 'Gemeinsamen Kader ansehen', 'Le chapitre Genesis': 'Das Genesis-Kapitel', 'La GWR se recentre': 'GWR richtet sich neu aus', 'Tout savoir': 'Mehr erfahren', 'Genesis est programmé chaque jeudi à 19 h. Les cartes de matchs seront annoncées séparément.': 'Genesis findet jeden Donnerstag um 19 Uhr statt. Matchkarten werden separat angekündigt.', 'Les prochaines dates sont calculées automatiquement : aucune mise à jour manuelle n’est nécessaire.': 'Die nächsten Termine werden automatisch berechnet – manuelle Aktualisierungen sind nicht nötig.', 'Pourquoi le planning est vide ?': 'Warum ist der Terminplan leer?', 'Roster commun': 'Gemeinsamer Kader', 'Archives • Épisodes précédents': 'Archiv • Frühere Episoden', 'Le retour de Genesis': 'Die Rückkehr von Genesis'}};

// Season 2 status: the new era began on Thursday, 22 October 2026.
Object.assign(gwrTranslations.en, {
  '⚡ SAISON 2 EN COURS':'⚡ SEASON 2 UNDERWAY',
  'SAISON 2 • Lancée le 22 octobre 2026':'SEASON 2 • Launched 22 October 2026',
  'Saison 2 • Lancée le 22 octobre 2026':'Season 2 • Launched 22 October 2026',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'SEASON 2 UNDERWAY — GENESIS EVERY THURSDAY',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'GWR Season 2 has been underway since Thursday, 22 October 2026.'
});
Object.assign(gwrTranslations.es, {
  '⚡ SAISON 2 EN COURS':'⚡ TEMPORADA 2 EN CURSO',
  'Saison 2 • Lancée le 22 octobre 2026':'Temporada 2 • Comenzó el 22 de octubre de 2026',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'TEMPORADA 2 EN CURSO — GENESIS CADA JUEVES',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'La temporada 2 de GWR está en marcha desde el jueves 22 de octubre de 2026.'
});
Object.assign(gwrTranslations.it, {
  '⚡ SAISON 2 EN COURS':'⚡ STAGIONE 2 IN CORSO',
  'Saison 2 • Lancée le 22 octobre 2026':'Stagione 2 • Iniziata il 22 ottobre 2026',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'STAGIONE 2 IN CORSO — GENESIS OGNI GIOVEDÌ',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'La stagione 2 della GWR è in corso da giovedì 22 ottobre 2026.'
});
Object.assign(gwrTranslations.ja, {
  '⚡ SAISON 2 EN COURS':'⚡ シーズン2進行中',
  'Saison 2 • Lancée le 22 octobre 2026':'シーズン2 • 2026年10月22日開始',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'シーズン2進行中 — Genesisは毎週木曜日',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'GWRシーズン2は2026年10月22日（木）から進行中です。'
});
Object.assign(gwrTranslations.zh, {
  '⚡ SAISON 2 EN COURS':'⚡ 第二季进行中',
  'Saison 2 • Lancée le 22 octobre 2026':'第二季 • 于2026年10月22日开始',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'第二季进行中 — Genesis每周四播出',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'GWR第二季自2026年10月22日（星期四）起正式进行。'
});
Object.assign(gwrTranslations.de, {
  '⚡ SAISON 2 EN COURS':'⚡ STAFFEL 2 LÄUFT',
  'Saison 2 • Lancée le 22 octobre 2026':'Staffel 2 • Gestartet am 22. Oktober 2026',
  'SAISON 2 EN COURS — GENESIS CHAQUE JEUDI':'STAFFEL 2 LÄUFT — GENESIS JEDEN DONNERSTAG',
  'La Saison 2 de la GWR est en cours depuis le jeudi 22 octobre 2026.':'GWR-Staffel 2 läuft seit Donnerstag, dem 22. Oktober 2026.'
});

(function initGwrLanguage() {
  const selector = document.getElementById('gwrLanguage');
  if (!selector) return;
  const supported = ['fr', 'en', 'es', 'it', 'ja', 'zh', 'de'];
  const originalText = new WeakMap();
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement && !node.parentElement.closest('script,style,select,option')) {
      const text = node.nodeValue.trim();
      if (text) {
        originalText.set(node, node.nodeValue);
        textNodes.push(node);
      }
    }
  }
  const langMap = {fr:'fr-FR',en:'en-GB',es:'es-ES',it:'it-IT',ja:'ja-JP',zh:'zh-CN',de:'de-DE'};
  function translate(lang) {
    const dict = gwrTranslations[lang] || {};
    textNodes.forEach(node => {
      const original = originalText.get(node);
      const key = original.trim();
      if (lang === 'fr') {
        node.nodeValue = original;
      } else if (Object.prototype.hasOwnProperty.call(dict, key)) {
        const leading = original.match(/^\s*/)[0], trailing = original.match(/\s*$/)[0];
        node.nodeValue = leading + dict[key] + trailing;
      }
    });
    document.documentElement.lang = langMap[lang] || 'fr-FR';
    document.title = document.title; 
    selector.value = lang;
    try { localStorage.setItem('gwr-language', lang); } catch(e) {}
  }
  let preferred = 'fr';
  try {
    const saved = localStorage.getItem('gwr-language');
    if (saved && supported.includes(saved)) preferred = saved;
  } catch(e) {}
  selector.addEventListener('change', () => translate(selector.value));
  translate(preferred);
})();
