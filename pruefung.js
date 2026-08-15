// ============================================================
// DATENPRÜFUNG – gesammelte Sichtung aller eingetragenen Leistungen
// ============================================================
//
// Anlass: Aktionstag 2026. Beim Übertragen der handschriftlichen Listen sind
// Eingaben in falscher Syntax entstanden – vor allem "3,47" statt "3:47" beim
// 800m-Lauf. Solche Werte fallen in der Teilnehmerliste nicht auf, weil dort
// nur die Punkte stehen. Diese Ansicht zeigt genau die Fälle, in denen der
// eingetragene Rohwert nicht zur Übung passt oder unplausibel ist – und lässt
// sie an Ort und Stelle korrigieren, ohne jeden Teilnehmer einzeln zu öffnen.
//
// Die eigentliche Prüflogik steht bewusst NICHT hier, sondern in app.js
// (pruefeLeistung / pruefeTeilnehmer). Dieselbe Logik prüft auch live im
// Eingabeformular und füllt die Spalte "Auffälligkeiten" im CSV-Export –
// eine Regel, drei Anzeigeorte.
//
// ------------------------------------------------------------
// KOMPLETT ENTFERNEN – 3 Schritte:
//   1. In index.html die Zeile <script src="pruefung.js"></script> löschen
//   2. Diese Datei löschen
//   3. In sw.js 'pruefung.js' aus urlsToCache entfernen + CACHE_NAME hochzählen
// (Die Live-Prüfung im Formular und die Export-Spalte bleiben davon unberührt.)
// ------------------------------------------------------------

(function () {
  'use strict';

  // Ohne die Prüffunktionen aus app.js ergibt das Modul keinen Sinn
  if (typeof pruefeTeilnehmer !== 'function') {
    console.warn('[Prüfung] pruefeTeilnehmer() aus app.js nicht gefunden – Modul inaktiv.');
    return;
  }

  const headerActions = document.getElementById('headerActions');
  const main = document.querySelector('.main');
  const listView = document.getElementById('listView');

  if (!headerActions || !main || !listView) {
    console.warn('[Prüfung] Erwartete Elemente nicht gefunden – Modul inaktiv.');
    return;
  }

  // ============================================================
  // STYLES (zur Laufzeit injiziert, styles.css bleibt unberührt)
  // ============================================================
  const style = document.createElement('style');
  style.id = 'pruefungStyles';
  style.textContent = `
    .pr-summe {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    .pr-hinweis {
      background: rgba(180, 83, 9, 0.25);
      border: 1px solid #b45309;
      color: #fcd34d;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .pr-ok {
      text-align: center;
      color: #6ee7b7;
      padding: 2rem 1rem;
      font-size: 1rem;
    }
    .pr-person {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.75rem;
    }
    .pr-person-kopf {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .pr-person-kopf span {
      font-weight: 400;
      color: #94a3b8;
      font-size: 0.8rem;
    }
    .pr-fund {
      border-left: 3px solid #334155;
      padding: 0.5rem 0 0.5rem 0.75rem;
      margin-top: 0.5rem;
    }
    .pr-fund-fehler  { border-left-color: #b91c1c; }
    .pr-fund-warnung { border-left-color: #b45309; }
    .pr-fund-null    { border-left-color: #475569; }
    .pr-fund-titel {
      font-size: 0.8rem;
      color: #cbd5e1;
      margin-bottom: 0.25rem;
    }
    .pr-fund-meldung {
      font-size: 0.75rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 0.5rem;
    }
    .pr-fund-meldung b { color: #f1f5f9; }
    .pr-korrektur {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .pr-korrektur input {
      width: 7rem;
      margin-bottom: 0 !important;
      padding: 0.5rem 0.6rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #f1f5f9;
      font-size: 0.9rem;
    }
    .pr-vorschau {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .pr-vorschau-fehler { color: #fca5a5; }
    .pr-aktionen {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
  `;
  document.head.appendChild(style);

  // ============================================================
  // DOM AUFBAUEN
  // ============================================================
  const btn = document.createElement('button');
  btn.id = 'pruefungBtn';
  btn.className = 'btn btn-secondary btn-icon';
  btn.title = 'Eingaben prüfen';
  btn.textContent = '🔎';
  headerActions.appendChild(btn);

  const view = document.createElement('div');
  view.id = 'pruefungView';
  view.className = 'hidden';
  view.innerHTML = `
    <div class="form-header">
      <h2>🔎 Eingaben prüfen</h2>
      <button id="pruefungCloseBtn" class="close-btn">✕</button>
    </div>

    <div class="form-section">
      <label for="pruefungStufe" style="display:block; margin-bottom:0.5rem; font-size:0.9rem; color:#cbd5e1;">
        🔬 Wie streng soll geprüft werden?
      </label>
      <select id="pruefungStufe">
        <option value="fehler">Nur Fehler (Eingabe passt nicht zur Übung)</option>
        <option value="warnung" selected>Fehler + unplausible Werte</option>
        <option value="null">… zusätzlich alle Einträge mit 0 Punkten</option>
      </select>

      <label for="pruefungKlasse" style="display:block; margin-top:1rem; margin-bottom:0.5rem; font-size:0.9rem; color:#cbd5e1;">
        🎓 Klasse
      </label>
      <select id="pruefungKlasse"></select>
    </div>

    <div id="pruefungInhalt"></div>
  `;
  main.appendChild(view);

  const closeBtn = view.querySelector('#pruefungCloseBtn');
  const stufeSelect = view.querySelector('#pruefungStufe');
  const klasseSelect = view.querySelector('#pruefungKlasse');
  const inhalt = view.querySelector('#pruefungInhalt');

  // ============================================================
  // HILFSFUNKTIONEN
  // ============================================================
  function esc(text) {
    return String(text ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function uebungsName(key) {
    return EXERCISE_LABELS[key] || key;
  }

  // Alle Auffälligkeiten eines Teilnehmers auf der gewählten Prüfstufe.
  // Die eigentliche Prüfung kommt aus app.js; hier kommt nur die Stufe
  // "0 Punkte trotz Eintrag" dazu – die ist kein Fehler, sondern ein
  // Anlass zum Nachschauen (kann auch schlicht eine schwache Leistung sein).
  function funde(p, stufe) {
    const gefunden = pruefeTeilnehmer(p)
      .filter(f => stufe === 'fehler' ? f.status === 'fehler' : true);

    if (stufe === 'null') {
      const punkte = getParticipantPoints(p);
      const schonGemeldet = gefunden.map(f => f.catKey);
      Object.keys(CATEGORIES).forEach(catKey => {
        const eintrag = p.results?.[catKey];
        if (!eintrag?.exercise || eintrag.value === undefined || eintrag.value === '') return;
        if (schonGemeldet.includes(catKey)) return;
        if (punkte[catKey] > 0) return;
        gefunden.push({
          catKey,
          exerciseKey: eintrag.exercise,
          value: eintrag.value,
          status: 'null',
          meldung: 'Eintrag vorhanden, ergibt aber 0 Punkte (unter Bronze). Kann so stimmen – bitte gegen den Zettel prüfen.',
          vorschlag: null
        });
      });
    }

    return gefunden;
  }

  function klassenBefuellen() {
    const vorhanden = [...new Set(participants.map(p => p.class_name).filter(c => c))].sort();
    const vorher = klasseSelect.value;
    klasseSelect.innerHTML = '<option value="">Alle Klassen</option>'
      + vorhanden.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    if (vorher) klasseSelect.value = vorher;
  }

  function gepruefteTeilnehmer() {
    const klasse = klasseSelect.value;
    return klasse ? participants.filter(p => p.class_name === klasse) : participants;
  }

  // ============================================================
  // RENDERING
  // ============================================================
  function renderFund(p, f) {
    const cat = CATEGORIES[f.catKey];
    // Vorbelegt mit dem Korrekturvorschlag, falls es einen eindeutigen gibt –
    // sonst mit dem bisherigen Wert, damit nichts versehentlich verschwindet.
    const vorbelegt = f.vorschlag || f.value;

    return `
      <div class="pr-fund pr-fund-${f.status}" data-id="${esc(p.id)}" data-cat="${f.catKey}">
        <div class="pr-fund-titel">
          ${cat.icon} ${cat.label} – ${esc(uebungsName(f.exerciseKey))}
        </div>
        <div class="pr-fund-meldung">
          Eingetragen: <b>${esc(f.value)}</b> · ${esc(f.meldung)}
        </div>
        <div class="pr-korrektur">
          <input type="text" class="pr-input" value="${esc(vorbelegt)}" autocomplete="off">
          <button class="btn btn-primary btn-small pr-speichern">Übernehmen</button>
          <span class="pr-vorschau"></span>
        </div>
      </div>
    `;
  }

  function render() {
    const stufe = stufeSelect.value;
    const liste = gepruefteTeilnehmer();

    const auffaellig = liste
      .map(p => ({ p, gefunden: funde(p, stufe) }))
      .filter(e => e.gefunden.length > 0)
      .sort((a, b) => (a.p.class_name || '').localeCompare(b.p.class_name || '')
                   || a.p.last_name.localeCompare(b.p.last_name));

    const anzahlFunde = auffaellig.reduce((summe, e) => summe + e.gefunden.length, 0);
    const korrigierbar = auffaellig.reduce(
      (summe, e) => summe + e.gefunden.filter(f => f.vorschlag).length, 0);

    const hinweise = [];
    if (typeof currentUserRole !== 'undefined' && currentUserRole !== 'admin') {
      hinweise.push('⚠️ Du siehst nur Teilnehmer deiner zugewiesenen Klassen – die Prüfung deckt deshalb nicht alle Daten ab.');
    }

    inhalt.innerHTML = `
      ${hinweise.map(h => `<div class="pr-hinweis">${h}</div>`).join('')}
      <div class="pr-summe">
        ${liste.length} Teilnehmer geprüft ·
        <b>${auffaellig.length}</b> mit Auffälligkeiten ·
        <b>${anzahlFunde}</b> ${anzahlFunde === 1 ? 'Eintrag' : 'Einträge'} betroffen
        ${korrigierbar > 0
          ? `<br>${korrigierbar} davon ${korrigierbar === 1 ? 'lässt' : 'lassen'} sich eindeutig korrigieren (Vorschlag steht im Feld).`
          : ''}
      </div>
      ${korrigierbar > 0 ? `
        <div class="pr-aktionen">
          <button id="pruefungAlleBtn" class="btn btn-success btn-small">
            ${korrigierbar === 1 ? 'Vorschlag übernehmen' : `Alle ${korrigierbar} Vorschläge übernehmen`}
          </button>
        </div>` : ''}
      ${auffaellig.length === 0
        ? '<div class="pr-ok">✅ Keine Auffälligkeiten auf dieser Prüfstufe.</div>'
        : auffaellig.map(e => `
            <div class="pr-person">
              <div class="pr-person-kopf">
                ${esc(e.p.first_name)} ${esc(e.p.last_name)}
                <span>${e.p.class_name ? esc(e.p.class_name) + ' · ' : ''}${esc(e.p.gender)} · ${esc(e.p.birth_year)}</span>
              </div>
              ${e.gefunden.map(f => renderFund(e.p, f)).join('')}
            </div>
          `).join('')}
    `;

    inhalt.querySelectorAll('.pr-fund').forEach(verdrahteFund);

    const alleBtn = inhalt.querySelector('#pruefungAlleBtn');
    if (alleBtn) alleBtn.addEventListener('click', () => alleVorschlaegeUebernehmen(auffaellig));
  }

  // Live-Vorschau + Speichern für eine einzelne Korrekturzeile
  function verdrahteFund(fundDiv) {
    const input = fundDiv.querySelector('.pr-input');
    const vorschau = fundDiv.querySelector('.pr-vorschau');
    const speichernBtn = fundDiv.querySelector('.pr-speichern');

    const p = participants.find(x => x.id === fundDiv.dataset.id);
    const catKey = fundDiv.dataset.cat;
    if (!p) return;

    const exercise = uebungVon(p, catKey);

    function aktualisiereVorschau() {
      if (!exercise) { vorschau.textContent = ''; return; }
      const ergebnis = pruefeLeistung(input.value, exercise);
      if (ergebnis.status === 'fehler') {
        vorschau.className = 'pr-vorschau pr-vorschau-fehler';
        vorschau.textContent = '⛔ ' + ergebnis.meldung;
        speichernBtn.disabled = true;
        return;
      }
      vorschau.className = 'pr-vorschau';
      vorschau.textContent = `➜ ${calculatePoints(input.value, exercise)} Punkte`
        + (ergebnis.status === 'warnung' ? ' ⚠️ unplausibel' : '');
      speichernBtn.disabled = false;
    }

    input.addEventListener('input', aktualisiereVorschau);
    speichernBtn.addEventListener('click', () => wertSpeichern(p, catKey, input.value));
    aktualisiereVorschau();
  }

  // ============================================================
  // SPEICHERN
  // ============================================================
  async function wertSpeichern(p, catKey, neuerWert) {
    await saveParticipantToDb({
      ...p,
      results: {
        ...p.results,
        [catKey]: { ...p.results[catKey], value: neuerWert.trim() }
      }
    });
    render();   // participants wurde von saveParticipantToDb neu geladen
  }

  // Sammelkorrektur: nur die eindeutigen Vorschläge (z.B. "3,47" -> "3:47").
  // Bewusst mit Rückfrage und Beispielen – es schreibt in einem Rutsch in
  // viele Datensätze, das soll niemand versehentlich auslösen.
  async function alleVorschlaegeUebernehmen(auffaellig) {
    const aenderungen = [];
    auffaellig.forEach(e => {
      e.gefunden.filter(f => f.vorschlag).forEach(f => {
        aenderungen.push({ p: e.p, catKey: f.catKey, alt: f.value, neu: f.vorschlag });
      });
    });
    if (aenderungen.length === 0) return;

    const beispiele = aenderungen.slice(0, 5)
      .map(a => `• ${a.p.first_name} ${a.p.last_name}: "${a.alt}" → "${a.neu}"`)
      .join('\n');

    const bestaetigt = confirm(
      `${aenderungen.length} Einträge werden korrigiert:\n\n${beispiele}`
      + (aenderungen.length > 5 ? `\n… und ${aenderungen.length - 5} weitere` : '')
      + '\n\nJetzt so speichern?'
    );
    if (!bestaetigt) return;

    // Pro Teilnehmer sammeln, damit jemand mit zwei Fehlern nur einmal
    // geschrieben wird – und am Ende EIN Neuladen statt eines pro Zeile.
    const proTeilnehmer = new Map();
    aenderungen.forEach(a => {
      const bisher = proTeilnehmer.get(a.p.id) || { ...a.p.results };
      bisher[a.catKey] = { ...a.p.results[a.catKey], value: a.neu };
      proTeilnehmer.set(a.p.id, bisher);
    });

    showLoading();
    const fehlgeschlagen = [];
    for (const [id, results] of proTeilnehmer) {
      const { error } = await db.from('participants').update({ results }).eq('id', id);
      if (error) fehlgeschlagen.push(error.message);
    }
    await loadParticipants();
    hideLoading();
    render();

    if (fehlgeschlagen.length > 0) {
      alert(`${fehlgeschlagen.length} Datensätze konnten nicht gespeichert werden:\n`
            + fehlgeschlagen.slice(0, 3).join('\n'));
    }
  }

  // ============================================================
  // ANSICHT EIN-/AUSBLENDEN (gleiches Muster wie showImport/hideImport)
  // ============================================================
  function zeigen() {
    listView.classList.add('hidden');
    view.classList.remove('hidden');
    headerActions.classList.add('hidden');
    klassenBefuellen();
    render();
  }

  function verbergen() {
    view.classList.add('hidden');
    listView.classList.remove('hidden');
    headerActions.classList.remove('hidden');
  }

  btn.addEventListener('click', zeigen);
  closeBtn.addEventListener('click', verbergen);
  stufeSelect.addEventListener('change', render);
  klasseSelect.addEventListener('change', render);
})();
