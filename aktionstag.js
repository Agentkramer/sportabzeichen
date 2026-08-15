// ============================================================
// AKTIONSTAG-WERTUNG  –  eigenständiges Zusatzmodul
// ============================================================
//
// Ermittelt die Jahrgangsbesten (Jungen/Mädchen getrennt) anhand der vier
// Aktionstag-Disziplinen Sprint, 800m, Ballwurf und Weitsprung.
//
// WICHTIG: Das hat NICHTS mit der offiziellen DSA-Wertung (Bronze/Silber/
// Gold) zu tun – hier werden die Rohleistungen direkt miteinander
// verrechnet. Es ist eine schulinterne Zusatzwertung.
//
// ------------------------------------------------------------
// KOMPLETT ENTFERNEN – 3 Schritte, sonst wird keine Datei angefasst:
//   1. In index.html die Zeile <script src="aktionstag.js"></script> löschen
//   2. Diese Datei (aktionstag.js) löschen
//   3. In sw.js 'aktionstag.js' aus urlsToCache entfernen + CACHE_NAME hochzählen
// ------------------------------------------------------------
//
// Das Modul erzeugt Button, Ansicht und Styles selbst zur Laufzeit und
// schreibt nichts in app.js. Es liest lediglich die globale Variable
// `participants` (und optional `currentUserRole`) aus app.js.

(function () {
  'use strict';

  // ============================================================
  // KONFIGURATION – hier nachjustieren, wenn nach dem Aktionstag
  // die echten Leistungsspannen bekannt sind.
  //
  // Punkte = BASIS
  //          - Sprintzeit(Zehntel) * sprintProZehntel
  //          - 800m-Zeit(Sekunden) * lauf800ProSekunde
  //          + Wurfweite(Meter)    * wurfProMeter
  //          + Sprungweite(Meter)  * sprungProMeter
  //
  // BASIS ist rein kosmetisch: Sie verschiebt alle Teilnehmer um denselben
  // Betrag und hat KEINEN Einfluss auf die Reihenfolge. Nur die vier
  // Faktoren bestimmen, wie stark eine Disziplin ins Gewicht fällt.
  //
  // Die Faktoren sind so gewählt, dass jede Disziplin ungefähr 300 Punkte
  // Spanne zwischen einem starken und einem schwachen Kind beisteuert –
  // basierend auf geschätzten Leistungsspannen für Klasse 5/6.
  // ============================================================
  const CONFIG = {
    basis: 2800,
    sprintProZehntel: 9,     // vorher (Tabelle): 1
    lauf800ProSekunde: 2,    // vorher (Tabelle): 1
    wurfProMeter: 10,        // unverändert
    sprungProMeter: 130,     // vorher (Tabelle): 100
    anzahlPlaetze: 3,
    standardJahrgang: 5
  };

  // Übungs-Keys aus app.js, die für die Wertung zählen
  const UEBUNG = {
    sprint: ['lauf_50m'],
    lauf800: ['800m_lauf'],
    wurf: ['schlagball_80g', 'wurfball_200g'],
    sprung: ['weitsprung']
  };

  const GERAET_LABEL = {
    schlagball_80g: 'Schlagball 80g',
    wurfball_200g: 'Wurfball 200g'
  };

  // ============================================================
  // STYLES (werden zur Laufzeit injiziert, styles.css bleibt unberührt)
  // ============================================================
  const style = document.createElement('style');
  style.id = 'aktionstagStyles';
  style.textContent = `
    .at-hinweis {
      background: rgba(180, 83, 9, 0.25);
      border: 1px solid #b45309;
      color: #fcd34d;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .at-gruppe { margin-bottom: 1.5rem; }
    .at-gruppe h3 {
      font-size: 1rem;
      color: #cbd5e1;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .at-platz {
      display: flex;
      gap: 0.75rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
    }
    .at-platz-nr {
      font-size: 1.25rem;
      min-width: 2rem;
      text-align: center;
    }
    .at-platz-body { flex: 1; min-width: 0; }
    .at-platz-name { font-weight: 600; }
    .at-platz-werte {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 0.25rem;
      line-height: 1.6;
    }
    .at-punkte {
      font-weight: 700;
      color: #fbbf24;
      white-space: nowrap;
      align-self: center;
    }
    .at-gleichstand {
      border-color: #f59e0b;
    }
    .at-leer {
      color: #94a3b8;
      font-size: 0.9rem;
      padding: 0.5rem 0;
    }
    .at-fuss {
      font-size: 0.75rem;
      color: #64748b;
      border-top: 1px solid #334155;
      padding-top: 0.75rem;
      margin-top: 0.5rem;
      line-height: 1.6;
    }
  `;
  document.head.appendChild(style);

  // ============================================================
  // DOM AUFBAUEN
  // ============================================================
  const headerActions = document.getElementById('headerActions');
  const main = document.querySelector('.main');
  const listView = document.getElementById('listView');

  if (!headerActions || !main || !listView) {
    console.warn('[Aktionstag] Erwartete Elemente nicht gefunden – Modul inaktiv.');
    return;
  }

  const btn = document.createElement('button');
  btn.id = 'aktionstagBtn';
  btn.className = 'btn btn-secondary btn-icon';
  btn.title = 'Jahrgangsbeste (Aktionstag)';
  btn.textContent = '🏆';
  headerActions.appendChild(btn);

  const view = document.createElement('div');
  view.id = 'aktionstagView';
  view.className = 'hidden';
  view.innerHTML = `
    <div class="form-header">
      <h2>🏆 Jahrgangsbeste</h2>
      <button id="aktionstagCloseBtn" class="close-btn">✕</button>
    </div>
    <div class="form-section">
      <label for="aktionstagJahrgang" style="display:block; margin-bottom:0.5rem; font-size:0.9rem; color:#cbd5e1;">
        🎓 Jahrgangsstufe:
      </label>
      <select id="aktionstagJahrgang"></select>
    </div>
    <div id="aktionstagInhalt"></div>
  `;
  main.appendChild(view);

  const closeBtn = view.querySelector('#aktionstagCloseBtn');
  const jahrgangSelect = view.querySelector('#aktionstagJahrgang');
  const inhalt = view.querySelector('#aktionstagInhalt');

  // ============================================================
  // HILFSFUNKTIONEN
  // ============================================================

  // Akzeptiert "4:35", "4:35.2", "275", "3,75" – gibt Sekunden bzw. Zahl zurück
  function zuZahl(wert) {
    if (typeof wert === 'number') return wert;
    const s = String(wert).trim().replace(',', '.');
    if (s.includes(':')) {
      const [min, sek] = s.split(':');
      return parseInt(min, 10) * 60 + parseFloat(sek);
    }
    return parseFloat(s);
  }

  function sekundenAlsZeit(sek) {
    const m = Math.floor(sek / 60);
    const s = Math.round(sek % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function zahlDe(n, stellen) {
    return n.toFixed(stellen).replace('.', ',');
  }

  function jahrgangVon(participant) {
    if (!participant.class_name) return null;
    const jg = parseInt(participant.class_name, 10);
    return isNaN(jg) ? null : jg;
  }

  // Liefert den Rohwert einer Kategorie, falls die passende Übung gewählt wurde
  function rohwert(participant, kategorie, erlaubteUebungen) {
    const eintrag = participant.results?.[kategorie];
    if (!eintrag || !erlaubteUebungen.includes(eintrag.exercise)) return null;
    if (eintrag.value === undefined || eintrag.value === null || eintrag.value === '') return null;
    return eintrag.value;
  }

  // ============================================================
  // BERECHNUNG
  // ============================================================
  function bewerte(participant) {
    const sprintRoh = rohwert(participant, 'schnelligkeit', UEBUNG.sprint);
    const lauf800Roh = rohwert(participant, 'ausdauer', UEBUNG.lauf800);
    const wurfRoh = rohwert(participant, 'kraft', UEBUNG.wurf);
    const sprungRoh = rohwert(participant, 'koordination', UEBUNG.sprung);

    // Nur wer alle vier Disziplinen absolviert hat, kann gewertet werden.
    // (Sonst würde eine fehlende Disziplin rechnerisch belohnt.)
    if (sprintRoh === null || lauf800Roh === null || wurfRoh === null || sprungRoh === null) {
      return null;
    }

    // Fehleingaben würden die Rangliste kippen: "3,47" statt "3:47" wäre hier
    // eine 800m-Zeit von 3,47 Sekunden und damit ein sicherer erster Platz.
    // Solche Datensätze bleiben ungewertet, bis sie korrigiert sind (🔎).
    if (typeof pruefeTeilnehmer === 'function'
        && pruefeTeilnehmer(participant).some(f => f.status === 'fehler')) {
      return null;
    }

    const sprintSek = zuZahl(sprintRoh);
    const lauf800Sek = zuZahl(lauf800Roh);
    const wurfM = zuZahl(wurfRoh);
    const sprungM = zuZahl(sprungRoh);

    const werte = [sprintSek, lauf800Sek, wurfM, sprungM];
    if (werte.some(v => !isFinite(v) || v <= 0)) return null;

    const punkte =
      CONFIG.basis
      - sprintSek * 10 * CONFIG.sprintProZehntel
      - lauf800Sek * CONFIG.lauf800ProSekunde
      + wurfM * CONFIG.wurfProMeter
      + sprungM * CONFIG.sprungProMeter;

    return {
      participant,
      punkte: Math.round(punkte),
      sprintSek,
      lauf800Sek,
      wurfM,
      sprungM,
      wurfGeraet: participant.results.kraft.exercise
    };
  }

  // Top N inklusive aller Punktgleichen auf dem letzten Platz
  function bestenliste(eintraege) {
    const sortiert = [...eintraege].sort((a, b) => b.punkte - a.punkte);
    if (sortiert.length <= CONFIG.anzahlPlaetze) return sortiert;
    const grenze = sortiert[CONFIG.anzahlPlaetze - 1].punkte;
    return sortiert.filter(e => e.punkte >= grenze);
  }

  // ============================================================
  // RENDERING
  // ============================================================
  function renderGruppe(titel, icon, eintraege) {
    const liste = bestenliste(eintraege);

    if (liste.length === 0) {
      return `
        <div class="at-gruppe">
          <h3>${icon} ${titel}</h3>
          <p class="at-leer">Keine vollständigen Ergebnisse vorhanden.</p>
        </div>
      `;
    }

    // Gleiche Punktzahl = gleicher Platz
    let letztePunkte = null;
    let letzterPlatz = 0;
    const zeilen = liste.map((e, i) => {
      const platz = e.punkte === letztePunkte ? letzterPlatz : i + 1;
      letztePunkte = e.punkte;
      letzterPlatz = platz;

      const gleichstand = liste.filter(x => x.punkte === e.punkte).length > 1;
      const medaille = platz === 1 ? '🥇' : platz === 2 ? '🥈' : platz === 3 ? '🥉' : `${platz}.`;
      const p = e.participant;

      return `
        <div class="at-platz${gleichstand ? ' at-gleichstand' : ''}">
          <div class="at-platz-nr">${medaille}</div>
          <div class="at-platz-body">
            <div class="at-platz-name">${p.first_name} ${p.last_name}${p.class_name ? ` (${p.class_name})` : ''}</div>
            <div class="at-platz-werte">
              Sprint ${zahlDe(e.sprintSek, 1)} s ·
              800m ${sekundenAlsZeit(e.lauf800Sek)} ·
              Wurf ${zahlDe(e.wurfM, 2)} m ·
              Weit ${zahlDe(e.sprungM, 2)} m
            </div>
          </div>
          <div class="at-punkte">${e.punkte}</div>
        </div>
      `;
    }).join('');

    return `<div class="at-gruppe"><h3>${icon} ${titel}</h3>${zeilen}</div>`;
  }

  function render() {
    const jahrgang = parseInt(jahrgangSelect.value, 10);
    const imJahrgang = participants.filter(p => jahrgangVon(p) === jahrgang);

    const bewertet = [];
    let unvollstaendig = 0;
    let fehlerhaft = 0;

    imJahrgang.forEach(p => {
      const e = bewerte(p);
      if (e) {
        bewertet.push(e);
      } else if (typeof pruefeTeilnehmer === 'function'
                 && pruefeTeilnehmer(p).some(f => f.status === 'fehler')) {
        fehlerhaft++;   // wegen Fehleingabe ausgeschlossen, nicht wegen fehlender Disziplin
      } else {
        unvollstaendig++;
      }
    });

    const maedchen = bewertet.filter(e => e.participant.gender === 'weiblich');
    const jungen = bewertet.filter(e => e.participant.gender === 'maennlich');

    const hinweise = [];

    // Examiner sehen durch RLS nur ihre eigenen Klassen -> Rangliste unvollständig
    if (typeof currentUserRole !== 'undefined' && currentUserRole !== 'admin') {
      hinweise.push(
        '⚠️ Du siehst nur Teilnehmer deiner zugewiesenen Klassen. ' +
        'Die Rangliste bildet den Jahrgang deshalb möglicherweise nicht vollständig ab.'
      );
    }

    // Gemischte Wurfgeräte im selben Jahrgang -> nicht direkt vergleichbar
    [['Mädchen', maedchen], ['Jungen', jungen]].forEach(([label, gruppe]) => {
      const geraete = [...new Set(gruppe.map(e => e.wurfGeraet))];
      if (geraete.length > 1) {
        hinweise.push(
          `⚠️ Bei den ${label} wurden zwei verschiedene Wurfgeräte erfasst ` +
          `(${geraete.map(g => GERAET_LABEL[g] || g).join(', ')}). ` +
          'Diese Weiten sind nicht direkt vergleichbar – die Wertung ist hier mit Vorsicht zu genießen.'
        );
      }
    });

    inhalt.innerHTML = `
      ${hinweise.map(h => `<div class="at-hinweis">${h}</div>`).join('')}
      ${renderGruppe('Mädchen', '👧', maedchen)}
      ${renderGruppe('Jungen', '👦', jungen)}
      <div class="at-fuss">
        Gewertet: ${bewertet.length} von ${imJahrgang.length} Teilnehmern im Jahrgang.
        ${unvollstaendig > 0 ? `${unvollstaendig} ohne vollständigen Satz aus Sprint, 800m, Ballwurf und Weitsprung (nicht wertbar).` : ''}
        ${fehlerhaft > 0 ? `<br>⛔ ${fehlerhaft} ${fehlerhaft === 1 ? 'Teilnehmer ist' : 'Teilnehmer sind'} wegen einer fehlerhaften Eingabe ausgeschlossen – siehe 🔎 Eingaben prüfen.` : ''}
        <br>
        Punkte = ${CONFIG.basis} − Sprint(Zehntel)×${CONFIG.sprintProZehntel}
        − 800m(Sek)×${CONFIG.lauf800ProSekunde}
        + Wurf(m)×${CONFIG.wurfProMeter}
        + Weitsprung(m)×${CONFIG.sprungProMeter}.
        Schulinterne Aktionstag-Wertung, unabhängig vom Sportabzeichen.
        Orange umrandete Einträge sind punktgleich.
      </div>
    `;
  }

  function jahrgaengeBefuellen() {
    const vorhanden = [...new Set(
      participants.map(jahrgangVon).filter(jg => jg !== null)
    )].sort((a, b) => a - b);

    if (vorhanden.length === 0) {
      jahrgangSelect.innerHTML = '<option value="">Keine Klassen vorhanden</option>';
      return;
    }

    const vorher = jahrgangSelect.value;
    jahrgangSelect.innerHTML = vorhanden
      .map(jg => `<option value="${jg}">Jahrgang ${jg}</option>`)
      .join('');

    if (vorher && vorhanden.includes(parseInt(vorher, 10))) {
      jahrgangSelect.value = vorher;
    } else if (vorhanden.includes(CONFIG.standardJahrgang)) {
      jahrgangSelect.value = String(CONFIG.standardJahrgang);
    }
  }

  // ============================================================
  // ANSICHT EIN-/AUSBLENDEN (gleiches Muster wie showImport/hideImport)
  // ============================================================
  function zeigen() {
    listView.classList.add('hidden');
    view.classList.remove('hidden');
    headerActions.classList.add('hidden');
    jahrgaengeBefuellen();
    render();
  }

  function verbergen() {
    view.classList.add('hidden');
    listView.classList.remove('hidden');
    headerActions.classList.remove('hidden');
  }

  btn.addEventListener('click', zeigen);
  closeBtn.addEventListener('click', verbergen);
  jahrgangSelect.addEventListener('change', render);
})();
