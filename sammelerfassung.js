// ============================================================================
// SAMMELERFASSUNG – eine Disziplin, eine Klasse, alle Kinder auf einer Seite
// ============================================================================
// In einer Sportstunde wird eine Disziplin bei einer Klasse abgenommen. Statt
// 28-mal eine Karte zu öffnen, zeigt diese Ansicht alle Kinder der Klasse mit
// einem Eingabefeld für genau diese eine Übung.
//
// Bewusst als entfernbares Modul angelegt, wie pruefung.js und aktionstag.js:
// Button, Ansicht und Styles entstehen zur Laufzeit, app.js/styles.css bleiben
// unberührt. Entfernen = Script-Zeile in index.html löschen, Datei löschen,
// Eintrag aus urlsToCache in sw.js entfernen.
//
// Geschrieben wird ausschließlich über die Datenbankfunktion set_result
// (sql/011_sammelerfassung_rpc.sql). Die fasst nur eine Disziplingruppe
// innerhalb von results an – Klasse, external_id und die drei anderen Gruppen
// kann diese Ansicht damit gar nicht beschädigen.
// ============================================================================

(function () {
  'use strict';

  // ============================================================
  // VORAUSSETZUNGEN
  // ============================================================
  // Mit typeof auf den bloßen Namen prüfen, nicht über window: ein top-level
  // "const" in app.js landet NICHT auf window, ist für später geladene Scripts
  // aber als Name sichtbar. typeof ist die einzige Form, die bei einem
  // unbekannten Namen keinen ReferenceError wirft.
  const fehlend = [];
  if (typeof PERFORMANCE_DATA === 'undefined')   fehlend.push('PERFORMANCE_DATA');
  if (typeof CATEGORIES === 'undefined')         fehlend.push('CATEGORIES');
  if (typeof EXERCISE_LABELS === 'undefined')    fehlend.push('EXERCISE_LABELS');
  if (typeof STANDARD_UEBUNGEN === 'undefined')  fehlend.push('STANDARD_UEBUNGEN');
  if (typeof participants === 'undefined')       fehlend.push('participants');
  if (typeof db === 'undefined')                 fehlend.push('db');
  if (typeof pruefeLeistung !== 'function')      fehlend.push('pruefeLeistung');
  if (typeof calculatePoints !== 'function')     fehlend.push('calculatePoints');
  if (typeof getAgeGroup !== 'function')         fehlend.push('getAgeGroup');
  if (typeof calculateAgeForYear !== 'function') fehlend.push('calculateAgeForYear');
  if (typeof loadParticipants !== 'function')    fehlend.push('loadParticipants');

  if (fehlend.length) {
    console.warn('[Sammelerfassung] fehlt aus app.js:', fehlend.join(', '), '– Modul inaktiv.');
    return;
  }

  const listView       = document.getElementById('listView');
  const main           = document.querySelector('.main');
  const headerActions  = document.getElementById('headerActions');
  const classFilter    = document.getElementById('classFilter');
  const zaehlerAnker   = document.getElementById('participantCount');

  if (!listView || !main || !classFilter || !zaehlerAnker) {
    console.warn('[Sammelerfassung] Erwartete Elemente in index.html nicht gefunden – Modul inaktiv.');
    return;
  }

  // ============================================================
  // STYLES (zur Laufzeit injiziert, styles.css bleibt unberührt)
  // ============================================================
  const style = document.createElement('style');
  style.id = 'sammelerfassungStyles';
  style.textContent = `
    #sammelBtn { margin-bottom: 1rem; }
    #sammelBtn:disabled { opacity: 0.5; cursor: not-allowed; }

    .se-reiter {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.25rem;
      margin-bottom: 0.6rem;
    }
    .se-reiter button {
      border: 1px solid transparent;
      background: #1e293b;
      color: #94a3b8;
      border-radius: 9px;
      padding: 0.5rem 0.2rem;
      font: inherit;
      font-size: 0.65rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      min-height: 52px;
      justify-content: center;
    }
    .se-reiter button .ic { font-size: 1rem; }
    .se-reiter button[aria-pressed="true"] {
      background: #334155;
      border-color: #475569;
      color: #f1f5f9;
    }

    .se-ziele-box {
      background: #1e293b;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 0.6rem;
    }
    .se-ziele-kopf {
      width: 100%;
      min-height: 44px;
      border: none;
      background: transparent;
      color: #f1f5f9;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.6rem 0.8rem;
      text-align: left;
    }
    .se-ziele-kopf.statisch { color: #94a3b8; cursor: default; }
    .se-ziele-liste {
      border-top: 1px solid #334155;
      padding: 0.5rem 0.8rem 0.7rem;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }
    .se-ziel-zeile { display: flex; flex-direction: column; gap: 0.15rem; }
    .se-ziel-wer { font-size: 0.68rem; color: #94a3b8; }
    .se-ziel-fehlt { font-size: 0.72rem; color: #f59e0b; }
    .se-werte {
      display: flex;
      gap: 0.7rem;
      flex-wrap: wrap;
      font-size: 0.75rem;
      color: #e2e8f0;
      font-variant-numeric: tabular-nums;
    }

    .se-leiste {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
      padding: 0 0.15rem;
      margin-bottom: 0.5rem;
    }
    .se-leiste button {
      border: 1px solid #475569;
      background: transparent;
      color: #94a3b8;
      border-radius: 999px;
      padding: 0.3rem 0.75rem;
      font: inherit;
      font-size: 0.72rem;
      cursor: pointer;
      min-height: 32px;
    }
    .se-leiste button[aria-pressed="true"] { background: #334155; color: #f1f5f9; }

    .se-hinweis {
      font-size: 0.78rem;
      color: #f59e0b;
      background: rgba(180, 83, 9, 0.25);
      border-radius: 8px;
      padding: 0.6rem 0.7rem;
      line-height: 1.5;
      margin-bottom: 0.6rem;
    }

    .se-geraet {
      font-size: 0.7rem;
      color: #94a3b8;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.8rem 0.15rem 0.25rem;
      border-bottom: 1px solid #334155;
      margin-bottom: 0.3rem;
    }

    .se-zeilen { display: flex; flex-direction: column; gap: 0.35rem; }

    .se-zeile {
      background: #1e293b;
      border-radius: 10px;
      padding: 0.55rem 0.7rem;
      display: grid;
      grid-template-columns: 1fr 84px 30px;
      align-items: center;
      gap: 0.5rem;
    }
    .se-zeile.turnen { grid-template-columns: 1fr 140px 30px; }
    .se-zeile.gesperrt { opacity: 0.72; }
    .se-zeile.markiert { border-left: 3px solid #f59e0b; }
    .se-zeile.fehler { border-left: 3px solid #ef4444; }

    .se-wer { min-width: 0; }

    .se-name {
      border: none;
      background: transparent;
      padding: 0;
      color: #f1f5f9;
      font: inherit;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      display: block;
      text-decoration: underline;
      text-decoration-style: dotted;
      text-underline-offset: 3px;
      text-decoration-color: #475569;
    }
    .se-sub { font-size: 0.68rem; color: #94a3b8; }
    .se-sub.flag { color: #f59e0b; }
    .se-sub .pkt { color: #e2e8f0; }

    .se-zeile input.se-wert {
      width: 100%;
      background: #0f172a;
      border: 1px solid #475569;
      color: #f1f5f9;
      border-radius: 7px;
      padding: 0.5rem 0.4rem;
      font: inherit;
      font-size: 0.9rem;
      text-align: center;
      font-variant-numeric: tabular-nums;
      min-height: 42px;
    }
    .se-zeile input.se-wert::placeholder { color: #64748b; }
    .se-platzhalter {
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }

    .se-noten { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.2rem; }
    .se-noten button {
      border: 1px solid #475569;
      background: #0f172a;
      color: #94a3b8;
      border-radius: 6px;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      min-height: 42px;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    .se-noten button[aria-pressed="true"] {
      background: #059669;
      border-color: #059669;
      color: #fff;
    }

    .se-status { text-align: center; font-size: 0.95rem; }
    .se-status.ok    { color: #22c55e; }
    .se-status.laeuft{ color: #94a3b8; }
    .se-status.warn  { color: #f59e0b; }
    .se-status.err   { color: #ef4444; }

    .se-meldung {
      grid-column: 1 / -1;
      font-size: 0.7rem;
      line-height: 1.45;
      padding-top: 0.35rem;
    }
    .se-meldung.warn { color: #f59e0b; }
    .se-meldung.err  { color: #ef4444; }

    .se-ersetzen {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.7rem;
      color: #94a3b8;
      padding-top: 0.35rem;
    }
    .se-bewertung { color: #e2e8f0; font-size: 0.75rem; }

    .se-ersetzen button {
      border: 1px solid #475569;
      background: transparent;
      color: #f1f5f9;
      border-radius: 7px;
      padding: 0.3rem 0.6rem;
      font: inherit;
      font-size: 0.7rem;
      cursor: pointer;
      min-height: 32px;
      flex-shrink: 0;
    }

    .se-override {
      grid-column: 1 / -1;
      width: 100%;
      background: #334155;
      border: 1px solid #f59e0b;
      color: #f1f5f9;
      border-radius: 7px;
      padding: 0.4rem 0.5rem;
      font: inherit;
      font-size: 0.75rem;
      margin-top: 0.3rem;
    }

    .se-zeile .se-werte {
      grid-column: 1 / -1;
      border-top: 1px dashed #475569;
      padding-top: 0.45rem;
      margin-top: 0.2rem;
      font-size: 0.72rem;
    }

    .se-leer { color: #94a3b8; text-align: center; padding: 2rem 1rem; font-size: 0.9rem; }
  `;
  document.head.appendChild(style);

  // ============================================================
  // EINSTIEGSKNOPF (in der Listenansicht, nicht in der Kopfzeile)
  // ============================================================
  // renderList() überschreibt nur #participantList – ein Geschwisterelement
  // davor überlebt jedes Neuzeichnen, ohne dass app.js etwas davon wissen muss.
  const btn = document.createElement('button');
  btn.id = 'sammelBtn';
  btn.type = 'button';
  btn.className = 'btn btn-success btn-full';
  listView.insertBefore(btn, zaehlerAnker);

  function knopfAktualisieren() {
    const klasse = classFilter.value;
    const echteKlasse = !!klasse && klasse !== 'NO_CLASS';
    btn.textContent = echteKlasse ? `📋 Sammelerfassung · ${klasse}` : '📋 Sammelerfassung';
    btn.disabled = !echteKlasse;
    btn.title = echteKlasse ? `Alle Teilnehmer der Klasse ${klasse} in einer Disziplin erfassen`
                            : 'Bitte zuerst oben eine Klasse wählen';
  }

  classFilter.addEventListener('change', knopfAktualisieren);
  knopfAktualisieren();

  // ============================================================
  // ANSICHT
  // ============================================================
  const view = document.createElement('div');
  view.id = 'sammelView';
  view.className = 'hidden';
  view.innerHTML = `
    <div class="form-header">
      <h2 id="seTitel">📋 Sammelerfassung</h2>
      <button id="seCloseBtn" class="close-btn">✕</button>
    </div>
    <div class="se-reiter" id="seReiter" role="group" aria-label="Disziplingruppe"></div>
    <div class="form-section" style="margin-bottom:0.6rem;">
      <label for="seUebung" style="display:block; margin-bottom:0.5rem; font-size:0.9rem; color:#cbd5e1;">
        Übung für alle
      </label>
      <select id="seUebung"></select>
    </div>
    <div id="seZiele"></div>
    <div id="seMeldung"></div>
    <div class="se-leiste">
      <span id="seZaehler"></span>
      <button type="button" id="seNurOffene" aria-pressed="false">nur offene</button>
    </div>
    <div class="se-zeilen" id="seZeilen"></div>
  `;
  main.appendChild(view);

  const titel        = view.querySelector('#seTitel');
  const closeBtn     = view.querySelector('#seCloseBtn');
  const reiterBox    = view.querySelector('#seReiter');
  const uebungSelect = view.querySelector('#seUebung');
  const zieleBox     = view.querySelector('#seZiele');
  const meldungBox   = view.querySelector('#seMeldung');
  const zaehlerBox   = view.querySelector('#seZaehler');
  const nurOffeneBtn = view.querySelector('#seNurOffene');
  const zeilenBox    = view.querySelector('#seZeilen');

  // ============================================================
  // ZUSTAND
  // ============================================================
  const zustand = {
    klasse: '',
    gruppe: 'ausdauer',
    uebung: '',
    nurOffene: false,
    zieleOffen: false,
    zeileZiel: null,     // Teilnehmer-ID, deren Zielwerte aufgeklappt sind
    frei: {},            // Teilnehmer-ID -> true: Konflikt ausdrücklich freigegeben
    override: {},        // Teilnehmer-ID -> abweichende Übung für diese Zeile
    uebungGewechselt: false
  };

  // ============================================================
  // HILFSFUNKTIONEN
  // ============================================================
  function esc(text) {
    return String(text ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const uebungsName = (key) => EXERCISE_LABELS[key] || key;

  // In der Datenbank steht "maennlich" (ohne Umlaut, siehe PERFORMANCE_DATA) –
  // angezeigt wird es ausgeschrieben.
  const geschlechtText = (g) => (g === 'maennlich' ? 'männlich' : g);

  // Alle Übungen, die die DOSB-Tabelle diesem Kind in dieser Gruppe anbietet.
  function tabelleFuer(kind, gruppe) {
    const alter = calculateAgeForYear(kind.birth_year);
    const gruppeAlter = getAgeGroup(alter);
    if (!gruppeAlter) return null;
    return PERFORMANCE_DATA[kind.gender]?.[gruppeAlter]?.[gruppe] || null;
  }

  // Die Übungsdefinition – oder null, wenn die Tabelle sie für dieses Kind
  // nicht führt (z.B. Schlagball 80g bei Jungen ab 12). Kein eigenes Regelwerk:
  // es wird schlicht nachgesehen, ob der Schlüssel existiert.
  function uebungFuer(kind, gruppe, uebungKey) {
    return tabelleFuer(kind, gruppe)?.[uebungKey] || null;
  }

  function kinderDerKlasse() {
    return participants
      .filter(p => p.class_name === zustand.klasse)
      .sort((a, b) =>
        (a.last_name || '').localeCompare(b.last_name || '', 'de') ||
        (a.first_name || '').localeCompare(b.first_name || '', 'de'));
  }

  // Welche Übung ist für diese Zeile maßgeblich – die klassenweite oder eine
  // pro Zeile abweichend gewählte?
  const uebungDerZeile = (kind) => zustand.override[kind.id] || zustand.uebung;

  // Alle Übungen, die mindestens einem Kind der Klasse angeboten werden.
  function uebungenDerKlasse() {
    const keys = [];
    kinderDerKlasse().forEach(kind => {
      const tabelle = tabelleFuer(kind, zustand.gruppe);
      if (tabelle) Object.keys(tabelle).forEach(k => { if (!keys.includes(k)) keys.push(k); });
    });
    return keys;
  }

  // Vorbelegung: was in dieser Klasse und Gruppe schon am häufigsten erfasst
  // ist. So läuft niemand in einen Konflikt, der eine Stunde fortsetzt.
  // Erst wenn dort nichts steht, greifen die Voreinstellungen aus app.js.
  function vorbelegteUebung() {
    const zaehlung = {};
    kinderDerKlasse().forEach(kind => {
      const ex = kind.results?.[zustand.gruppe]?.exercise;
      if (ex) zaehlung[ex] = (zaehlung[ex] || 0) + 1;
    });

    const haeufigste = Object.entries(zaehlung).sort((a, b) => b[1] - a[1])[0];
    if (haeufigste) return haeufigste[0];

    const moeglich = uebungenDerKlasse();
    const gemerkt = (STANDARD_UEBUNGEN[zustand.gruppe] || []).find(k => moeglich.includes(k));
    return gemerkt || moeglich[0] || '';
  }

  function istTurnen(kind) {
    return uebungFuer(kind, zustand.gruppe, uebungDerZeile(kind))?.type === 'turnen';
  }

  // Der gespeicherte Wert zählt nur, wenn er zur aktuell gewählten Übung gehört.
  function gespeicherterWert(kind) {
    const eintrag = kind.results?.[zustand.gruppe];
    if (!eintrag) return null;
    return eintrag.exercise === uebungDerZeile(kind) ? eintrag : null;
  }

  function hatKonflikt(kind) {
    const eintrag = kind.results?.[zustand.gruppe];
    return !!eintrag
        && eintrag.exercise !== uebungDerZeile(kind)
        && !zustand.frei[kind.id];
  }

  // Einzeldisziplin: 1/2/3 Punkte entsprechen Bronze/Silber/Gold.
  const MEDAILLEN = { 1: '🥉 Bronze', 2: '🥈 Silber', 3: '🥇 Gold' };

  function punkteText(punkte) {
    if (punkte === null || punkte === undefined) return '';
    if (punkte === 0) return '0 Punkte';
    return `${MEDAILLEN[punkte]} · ${punkte} ${punkte === 1 ? 'Punkt' : 'Punkte'}`;
  }

  // Kurzform für die Unterzeile einer normalen Eingabezeile
  function punkteKurz(punkte) {
    if (punkte === null || punkte === undefined) return '';
    const symbol = punkte === 0 ? '' : MEDAILLEN[punkte].split(' ')[0] + ' ';
    return `${symbol}${punkte} Pkt`;
  }

  function einheitText(wert, exercise) {
    if (exercise.unit === 'min:sec') return String(wert);
    return `${String(wert).replace('.', ',')} ${exercise.unit}`;
  }

  function zielwerteHtml(exercise) {
    if (!exercise || exercise.type === 'turnen') return '';
    return `<div class="se-werte">
      <span>🥉 ${esc(einheitText(exercise.bronze, exercise))}</span>
      <span>🥈 ${esc(einheitText(exercise.silber, exercise))}</span>
      <span>🥇 ${esc(einheitText(exercise.gold, exercise))}</span>
    </div>`;
  }

  // ============================================================
  // RENDERN
  // ============================================================
  // Vollständiges Neuzeichnen passiert nur bei Bedienelementen. Nach dem
  // Speichern wird ausschließlich die betroffene Zeile angefasst – sonst
  // würde beim Tippen auf das nächste Feld der Fokus wegfliegen.

  function reiterZeichnen() {
    reiterBox.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => `
      <button type="button" data-gruppe="${key}" aria-pressed="${key === zustand.gruppe}">
        <span class="ic">${cat.icon}</span>${esc(cat.label)}
      </button>`).join('');
  }

  function uebungenZeichnen() {
    const keys = uebungenDerKlasse();
    if (!keys.includes(zustand.uebung)) zustand.uebung = vorbelegteUebung();
    uebungSelect.innerHTML = keys
      .map(k => `<option value="${esc(k)}" ${k === zustand.uebung ? 'selected' : ''}>${esc(uebungsName(k))}</option>`)
      .join('') || '<option value="">Keine Übung verfügbar</option>';
  }

  function zieleZeichnen() {
    const kinder = kinderDerKlasse();
    const probe = kinder.find(k => uebungFuer(k, zustand.gruppe, zustand.uebung));
    const turnen = probe && uebungFuer(probe, zustand.gruppe, zustand.uebung)?.type === 'turnen';

    if (turnen) {
      zieleBox.innerHTML = `<div class="se-ziele-box">
        <div class="se-ziele-kopf statisch">🎯 Gerätturnen wird mit 0–3 bewertet – keine Zielwerte</div>
      </div>`;
      return;
    }

    // Nur die Alters-/Geschlechtskombinationen, die in dieser Klasse vorkommen.
    const kombis = [];
    kinder.forEach(kind => {
      const schluessel = `${kind.gender}|${getAgeGroup(calculateAgeForYear(kind.birth_year))}`;
      if (!kombis.some(k => k.schluessel === schluessel)) kombis.push({ schluessel, kind });
    });

    const zeilen = kombis.map(({ kind }) => {
      const alterGruppe = getAgeGroup(calculateAgeForYear(kind.birth_year));
      const exercise = uebungFuer(kind, zustand.gruppe, zustand.uebung);
      const wer = `${esc(alterGruppe.replace('-', '–'))} J. · ${esc(geschlechtText(kind.gender))}`;
      return `<div class="se-ziel-zeile">
        <span class="se-ziel-wer">${wer}</span>
        ${exercise ? zielwerteHtml(exercise) : '<span class="se-ziel-fehlt">nicht in der Tabelle</span>'}
      </div>`;
    }).join('');

    zieleBox.innerHTML = `<div class="se-ziele-box">
      <button type="button" class="se-ziele-kopf" id="seZieleKopf" aria-expanded="${zustand.zieleOffen}">
        <span>🎯 Zielwerte · ${esc(uebungsName(zustand.uebung))}</span>
        <span aria-hidden="true">${zustand.zieleOffen ? '▾' : '▸'}</span>
      </button>
      ${zustand.zieleOffen ? `<div class="se-ziele-liste">${zeilen}</div>` : ''}
    </div>`;
  }

  function zeileHtml(kind) {
    const uebungKey = uebungDerZeile(kind);
    const exercise  = uebungFuer(kind, zustand.gruppe, uebungKey);
    const alter     = calculateAgeForYear(kind.birth_year);
    const name      = `${esc(kind.last_name)}, ${esc(kind.first_name)}`;
    const zielOffen = zustand.zeileZiel === kind.id;

    const kopf = `<button type="button" class="se-name" data-ziel="${kind.id}"
        aria-expanded="${zielOffen}" title="Zielwerte für ${name}">${name}</button>`;

    // Konflikt: andere Übung gespeichert. Gesperrt bis zum ausdrücklichen Ersetzen.
    if (hatKonflikt(kind)) {
      const alt = kind.results[zustand.gruppe];
      // Was der gespeicherte Wert wert IST, entscheidet darüber, ob man ihn
      // ersetzen will. Dafür die Übung nachschlagen, die dort steht - nicht
      // die gerade ausgewählte.
      const altExercise = uebungFuer(kind, zustand.gruppe, alt.exercise);
      const altWert = altExercise ? einheitText(alt.value, altExercise) : alt.value;
      const altPunkte = altExercise ? calculatePoints(alt.value, altExercise) : null;
      const bewertung = altExercise
        ? punkteText(altPunkte)
        : 'Punkte nicht berechenbar (Übung fehlt in der Tabelle)';

      return `
        <div class="se-zeile gesperrt markiert" data-id="${kind.id}">
          <div class="se-wer">
            ${kopf}
            <div class="se-sub">🔒 ${esc(uebungsName(alt.exercise))} · ${esc(altWert)}</div>
          </div>
          <div class="se-platzhalter">—</div>
          <div class="se-status"></div>
          <div class="se-ersetzen">
            <span class="se-bewertung">${esc(bewertung)}</span>
            <button type="button" data-ersetzen="${kind.id}">Ersetzen</button>
          </div>
        </div>`;
    }

    const gespeichert = gespeicherterWert(kind);
    const wert = gespeichert ? gespeichert.value : '';
    const punkte = wert && exercise ? calculatePoints(wert, exercise) : null;

    // Übung existiert für dieses Kind nicht – eigenes Dropdown nur hier.
    if (!exercise) {
      const optionen = (tabelleFuer(kind, zustand.gruppe)
        ? Object.keys(tabelleFuer(kind, zustand.gruppe))
        : []).map(k => `<option value="${esc(k)}">${esc(uebungsName(k))}</option>`).join('');

      return `
        <div class="se-zeile markiert" data-id="${kind.id}">
          <div class="se-wer">
            ${kopf}
            <div class="se-sub flag">⚠ ${alter} J. · ${esc(uebungsName(uebungKey))} steht hier nicht in der Tabelle</div>
          </div>
          <div class="se-platzhalter">—</div>
          <div class="se-status"></div>
          <select class="se-override" data-override="${kind.id}" aria-label="Übung für ${name}">
            <option value="">– andere Übung wählen –</option>
            ${optionen}
          </select>
        </div>`;
    }

    const abweichend = !!zustand.override[kind.id];
    const geraet = exercise.type === 'turnen' ? ` · 🤸 ${esc(exercise.geraet)}` : '';
    const sub = `<div class="se-sub">${alter} J.${geraet}${abweichend ? ' · ' + esc(uebungsName(uebungKey)) : ''}`
      + (punkte !== null ? `<span class="pkt"> · ${esc(punkteKurz(punkte))}</span>` : '')
      + `</div>`;

    // Gerätturnen wird bewertet, nicht gemessen: vier Knöpfe statt Tastatur.
    if (exercise.type === 'turnen') {
      const knoepfe = [0, 1, 2, 3].map(n => `
        <button type="button" data-note="${kind.id}" data-wert="${n}"
                aria-pressed="${String(wert) === String(n)}"
                aria-label="${n} Punkte für ${name}">${n}</button>`).join('');
      return `
        <div class="se-zeile turnen" data-id="${kind.id}">
          <div class="se-wer">${kopf}${sub}</div>
          <div class="se-noten">${knoepfe}</div>
          <div class="se-status ${wert !== '' ? 'ok' : ''}">${wert !== '' ? '✓' : ''}</div>
          ${zielOffen ? '<div class="se-werte">Bewertung 0–3 · keine Zielwerte</div>' : ''}
        </div>`;
    }

    const platzhalter = exercise.unit === 'min:sec' ? 'MM:SS' : exercise.unit;
    return `
      <div class="se-zeile" data-id="${kind.id}">
        <div class="se-wer">${kopf}${sub}</div>
        <input class="se-wert" type="text" data-wert-fuer="${kind.id}"
               inputmode="${exercise.unit === 'min:sec' ? 'text' : 'decimal'}"
               placeholder="${esc(platzhalter)}" value="${esc(wert)}"
               aria-label="Leistung ${name}">
        <div class="se-status ${wert ? 'ok' : ''}">${wert ? '✓' : ''}</div>
        ${zielOffen ? zielwerteHtml(exercise) : ''}
      </div>`;
  }

  function zeilenZeichnen() {
    const kinder = kinderDerKlasse();

    if (kinder.length === 0) {
      zeilenBox.innerHTML = `<div class="se-leer">Keine Teilnehmer in dieser Klasse.</div>`;
      zaehlerBox.textContent = '';
      return;
    }

    const erfasst = kinder.filter(k => gespeicherterWert(k)).length;
    zaehlerBox.textContent = `${kinder.length} Kinder · ${erfasst} erfasst`;

    const sichtbar = zustand.nurOffene
      ? kinder.filter(k => !gespeicherterWert(k) && !hatKonflikt(k))
      : kinder;

    if (sichtbar.length === 0) {
      zeilenBox.innerHTML = `<div class="se-leer">Alle Kinder sind erfasst. 🎉</div>`;
      return;
    }

    // Beim Gerätturnen nach Gerät gruppieren: In einer Klasse kommen zwei
    // Altersgruppen und damit zwei Geräte vor. Man turnt nacheinander.
    const turnen = sichtbar.some(k => istTurnen(k));
    if (!turnen) {
      zeilenBox.innerHTML = sichtbar.map(zeileHtml).join('');
      return;
    }

    const gruppen = new Map();
    sichtbar.forEach(kind => {
      const geraet = uebungFuer(kind, zustand.gruppe, uebungDerZeile(kind))?.geraet || '—';
      if (!gruppen.has(geraet)) gruppen.set(geraet, []);
      gruppen.get(geraet).push(kind);
    });

    zeilenBox.innerHTML = [...gruppen].map(([geraet, liste]) => `
      <div class="se-geraet">🤸 ${esc(geraet)} · ${liste.length} ${liste.length === 1 ? 'Kind' : 'Kinder'}</div>
      ${liste.map(zeileHtml).join('')}`).join('');
  }

  function render() {
    titel.textContent = `📋 Sammelerfassung · ${zustand.klasse}`;
    reiterZeichnen();
    uebungenZeichnen();
    zieleZeichnen();

    const hinweise = [];
    if (zustand.uebungGewechselt) {
      hinweise.push('Übung gewechselt. Schon gespeicherte Werte bleiben unangetastet – '
                  + 'betroffene Kinder erscheinen als gesperrte Zeile.');
    }
    if (typeof currentUserRole !== 'undefined' && currentUserRole === 'examiner') {
      hinweise.push('Als Prüfer siehst du nur Teilnehmer deiner zugewiesenen Klassen.');
    }
    meldungBox.innerHTML = hinweise.map(h => `<div class="se-hinweis">${esc(h)}</div>`).join('');

    nurOffeneBtn.setAttribute('aria-pressed', String(zustand.nurOffene));
    zeilenZeichnen();
  }

  // ============================================================
  // EINE ZEILE AKTUALISIEREN (ohne Neuzeichnen der ganzen Liste)
  // ============================================================
  function zeileVon(id) {
    return zeilenBox.querySelector(`.se-zeile[data-id="${id}"]`);
  }

  function statusSetzen(id, art, zeichen, meldung) {
    const zeile = zeileVon(id);
    if (!zeile) return;

    const statusDiv = zeile.querySelector('.se-status');
    statusDiv.className = 'se-status ' + (art || '');
    statusDiv.textContent = zeichen || '';

    zeile.classList.toggle('fehler', art === 'err');
    zeile.querySelector('.se-meldung')?.remove();

    if (meldung) {
      const div = document.createElement('div');
      div.className = 'se-meldung ' + (art === 'err' ? 'err' : 'warn');
      div.textContent = meldung;
      zeile.appendChild(div);
    }
  }

  // Punktevorschau in der Unterzeile, während getippt wird
  function punkteZeigen(kind, roh) {
    const zeile = zeileVon(kind.id);
    if (!zeile) return;
    const exercise = uebungFuer(kind, zustand.gruppe, uebungDerZeile(kind));
    const sub = zeile.querySelector('.se-sub');
    if (!sub || !exercise) return;

    // Der Trenner steht mit im span, sonst sammeln sich " · " bei jedem Tippen an.
    sub.querySelector('.pkt')?.remove();
    if (roh === '') return;

    const span = document.createElement('span');
    span.className = 'pkt';
    span.textContent = ` · ${punkteKurz(calculatePoints(roh, exercise))}`;
    sub.appendChild(span);
  }

  // ============================================================
  // SPEICHERN – pro Feld, über die Datenbankfunktion set_result
  // ============================================================
  async function speichere(kind, roh) {
    const uebungKey = uebungDerZeile(kind);
    const exercise  = uebungFuer(kind, zustand.gruppe, uebungKey);

    if (!exercise) {
      statusSetzen(kind.id, 'err', '⚠', 'Diese Übung führt die Tabelle für dieses Kind nicht.');
      return;
    }

    // Erst korrigieren, dann urteilen – dieselbe Reihenfolge wie in
    // pruefeEingabefeld(). WICHTIG: pruefeLeistung liefert den Vorschlag
    // ZUSAMMEN mit status 'fehler' ("3,47" ist ein Fehler MIT Korrektur).
    // Wer hier zu früh abbricht, verliert die automatische Korrektur.
    let pruefung = pruefeLeistung(roh, exercise);

    if (pruefung.vorschlag) {
      roh = pruefung.vorschlag;
      const feld = zeileVon(kind.id)?.querySelector('.se-wert');
      if (feld) feld.value = roh;
      punkteZeigen(kind, roh);
      pruefung = pruefeLeistung(roh, exercise);   // nach der Korrektur neu bewerten
    }

    if (pruefung.status === 'fehler') {
      statusSetzen(kind.id, 'err', '⚠', pruefung.meldung);
      return;
    }

    statusSetzen(kind.id, 'laeuft', '…');

    const { error } = await db.rpc('set_result', {
      p_participant: kind.id,
      p_gruppe:      zustand.gruppe,
      p_exercise:    uebungKey,
      p_value:       roh
    });

    if (error) {
      // Wert bleibt im Feld stehen, damit nichts verloren geht.
      console.error('[Sammelerfassung] Speichern fehlgeschlagen:', error);
      statusSetzen(kind.id, 'err', '⚠', 'Nicht gespeichert: ' + error.message);
      return;
    }

    // Lokalen Stand nachziehen, damit die Klassenansicht beim Zurückspringen
    // stimmt, ohne alle Teilnehmer neu zu laden (das wären 28 Runden pro Stunde).
    kind.results = kind.results || {};
    if (roh === '') delete kind.results[zustand.gruppe];
    else kind.results[zustand.gruppe] = { exercise: uebungKey, value: roh };

    // Unplausible Werte blockieren nicht – Ausnahmeleistungen gibt es –, aber
    // sie bleiben sichtbar markiert. Eine Rückfrage pro Zeile wäre bei 28
    // Kindern unbenutzbar; die Prüf-Ansicht fängt sie ohnehin später auf.
    if (pruefung.status === 'warnung') {
      statusSetzen(kind.id, 'warn', '✓', pruefung.meldung);
    } else {
      statusSetzen(kind.id, 'ok', roh ? '✓' : '');
    }

    punkteZeigen(kind, roh);
    zaehlerAktualisieren();
  }

  function zaehlerAktualisieren() {
    const kinder = kinderDerKlasse();
    const erfasst = kinder.filter(k => gespeicherterWert(k)).length;
    zaehlerBox.textContent = `${kinder.length} Kinder · ${erfasst} erfasst`;
  }

  const kindMit = (id) => participants.find(p => p.id === id);

  // ============================================================
  // BEDIENUNG (Delegation – die Zeilen werden neu gezeichnet)
  // ============================================================
  zeilenBox.addEventListener('click', (e) => {
    const zielBtn = e.target.closest('[data-ziel]');
    if (zielBtn) {
      // Immer nur eine Zeile offen – zwei Zielwertblöcke helfen niemandem.
      zustand.zeileZiel = zustand.zeileZiel === zielBtn.dataset.ziel ? null : zielBtn.dataset.ziel;
      zeilenZeichnen();
      return;
    }

    const ersetzen = e.target.closest('[data-ersetzen]');
    if (ersetzen) {
      const kind = kindMit(ersetzen.dataset.ersetzen);
      const alt = kind?.results?.[zustand.gruppe];
      if (!kind || !alt) return;
      const weiter = confirm(
        `Für ${kind.first_name} ${kind.last_name} ist bereits `
        + `${uebungsName(alt.exercise)} mit ${alt.value} gespeichert.\n\n`
        + `Beim nächsten Eintrag wird dieser Wert ersetzt. Fortfahren?`
      );
      if (weiter) {
        zustand.frei[kind.id] = true;
        zeilenZeichnen();
      }
      return;
    }

    const note = e.target.closest('[data-note]');
    if (note) {
      const kind = kindMit(note.dataset.note);
      if (!kind) return;
      const bisher = gespeicherterWert(kind)?.value ?? '';
      // Nochmal auf dieselbe Note tippen nimmt die Bewertung zurück.
      const neu = String(bisher) === note.dataset.wert ? '' : note.dataset.wert;

      note.closest('.se-noten').querySelectorAll('button').forEach(b =>
        b.setAttribute('aria-pressed', String(b.dataset.wert === neu)));

      speichere(kind, neu);
    }
  });

  zeilenBox.addEventListener('input', (e) => {
    const feld = e.target.closest('[data-wert-fuer]');
    if (!feld) return;
    const kind = kindMit(feld.dataset.wertFuer);
    if (kind) punkteZeigen(kind, feld.value.trim());
  });

  // Gespeichert wird beim Verlassen des Feldes – nicht beim Tippen.
  zeilenBox.addEventListener('focusout', (e) => {
    const feld = e.target.closest('[data-wert-fuer]');
    if (!feld) return;
    const kind = kindMit(feld.dataset.wertFuer);
    if (!kind) return;

    const roh = feld.value.trim();
    const bisher = gespeicherterWert(kind)?.value ?? '';
    if (roh === bisher) return;          // nichts geändert, nichts schreiben
    speichere(kind, roh);
  });

  zeilenBox.addEventListener('change', (e) => {
    const auswahl = e.target.closest('[data-override]');
    if (!auswahl) return;
    const id = auswahl.dataset.override;
    if (auswahl.value) zustand.override[id] = auswahl.value;
    else delete zustand.override[id];
    zeilenZeichnen();
  });

  reiterBox.addEventListener('click', (e) => {
    const knopf = e.target.closest('[data-gruppe]');
    if (!knopf) return;
    zustand.gruppe = knopf.dataset.gruppe;
    zustand.uebung = '';
    zustand.frei = {};
    zustand.override = {};
    zustand.zeileZiel = null;
    zustand.uebungGewechselt = false;
    render();
  });

  uebungSelect.addEventListener('change', () => {
    zustand.uebung = uebungSelect.value;
    zustand.frei = {};
    zustand.override = {};
    zustand.zeileZiel = null;
    zustand.uebungGewechselt = true;
    render();
  });

  zieleBox.addEventListener('click', (e) => {
    if (!e.target.closest('#seZieleKopf')) return;
    zustand.zieleOffen = !zustand.zieleOffen;
    zieleZeichnen();
  });

  nurOffeneBtn.addEventListener('click', () => {
    zustand.nurOffene = !zustand.nurOffene;
    nurOffeneBtn.setAttribute('aria-pressed', String(zustand.nurOffene));
    zeilenZeichnen();
  });

  // ============================================================
  // ANSICHT EIN-/AUSBLENDEN (gleiches Muster wie pruefung.js)
  // ============================================================
  async function zeigen() {
    const klasse = classFilter.value;
    if (!klasse || klasse === 'NO_CLASS') return;

    zustand.klasse = klasse;
    zustand.gruppe = 'ausdauer';
    zustand.uebung = '';
    zustand.nurOffene = false;
    zustand.zieleOffen = false;
    zustand.zeileZiel = null;
    zustand.frei = {};
    zustand.override = {};
    zustand.uebungGewechselt = false;

    // Einmal frisch laden, damit man nicht auf einem alten Stand tippt, wenn
    // parallel jemand anderes an derselben Klasse gearbeitet hat.
    await loadParticipants();

    listView.classList.add('hidden');
    view.classList.remove('hidden');
    headerActions.classList.add('hidden');
    render();
  }

  function verbergen() {
    view.classList.add('hidden');
    listView.classList.remove('hidden');
    headerActions.classList.remove('hidden');
    // participants ist lokal schon nachgezogen – renderList() zeigt den
    // aktuellen Stand, ohne dass nochmal geladen werden muss.
    if (typeof renderList === 'function') renderList();
  }

  btn.addEventListener('click', zeigen);
  closeBtn.addEventListener('click', verbergen);
})();
