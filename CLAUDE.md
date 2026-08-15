# DSA-PWA – Sportabzeichen-Verwaltung

Progressive Web App zur Verwaltung und automatischen Auswertung des Deutschen
Sportabzeichens (DSA) an einer Schule. Nutzer sind Sportlehrer*innen, die
Leistungen von Schüler*innen (8–19 Jahre) in 4 Disziplingruppen erfassen.

- **Live-URL:** https://agentkramer.github.io/sportabzeichen/
- **Repo:** https://github.com/agentkramer/sportabzeichen

## Stack

- Vanilla HTML/CSS/JavaScript (kein Framework, bewusste Entscheidung)
- Supabase (PostgreSQL) als Backend, Zugriff über Supabase-Client/REST-API
- Hosting: GitHub Pages (nur statische Dateien, kein eigenes Backend)
- PWA mit Service Worker (aktuell v44 – Version bei jedem Deployment hochzählen,
  sonst greift der Cache nicht neu; hält sich hartnäckig, im Zweifel Hard-Reload
  oder Service Worker in den DevTools abmelden)
- Keep-Alive gegen die Supabase-Pausierung (Free Tier pausiert nach 7 Tagen
  Inaktivität) läuft über einen externen Cronjob bei **cron-job.org**:
  `POST /rest/v1/rpc/keep_alive_ping` (Header `apikey`, Body `{}`), täglich,
  mit aktivierter Fehlerbenachrichtigung. Die Funktion liest `participants` und
  schreibt eine Statuszeile fort (siehe `sql/009_keepalive_neu.sql`).
  Kontrolle: `select * from public.keep_alive_status;` – `last_ping` sollte
  keine 24 Stunden alt sein.
- **Zwei Lehren aus zwei Pausierungen:** (1) Ein reiner *Lese*-Ping genügt
  nicht – als `anon` liefert er wegen RLS ein leeres Ergebnis und zählte
  offenbar nicht als Aktivität; es braucht einen Schreibvorgang. (2) Der
  frühere GitHub-Actions-Workflow wurde von GitHub nach 60 Tagen ohne Commit
  automatisch abgeschaltet. Beide Ausfälle blieben lange unbemerkt – der
  stille Ausfall ist das eigentliche Risiko, deshalb die Benachrichtigung.

## Datenstruktur

Tabelle `participants`:
- `id`, `external_id`, `first_name`, `last_name`, `birth_year` (ggf. `birth_date`),
  `class_name`, `gender`
- `results` (JSONB): `{ ausdauer: {exercise: "lauf_800", value: "3:45"}, kraft: {...}, ... }`
- **Wichtig:** Fehlende Disziplinen sind `undefined`, nicht `0` – das ist
  Absicht und wird in der Punktelogik so ausgewertet.
- Der Rohwert wird als **Text** gespeichert, so wie eingetippt (`"3:45"`,
  `"3,45"`). Das ist der Grund für die Eingabeprüfung (siehe unten).
- Turnen-Sonderfall: subjektive Bewertung 0–3 statt Leistungstabelle,
  z.B. `{ type: "turnen", geraet: "Barren" }`
- Punkteberechnung nach offiziellen DOSB-Leistungstabellen (alters- und
  geschlechtsabhängig), umgesetzt in `calculatePoints` / `getParticipantPoints`.

Tabelle `profiles` (Multi-User, seit Phase 2):
- `id` (= `auth.users.id`), `email`, `role` (`admin` | `examiner`), `classes`
  (`text[]`, Klassen-Zuordnung für Examiner), `created_at`
- Wird per DB-Trigger automatisch angelegt, sobald ein neuer Supabase-Auth-
  User entsteht (Standardrolle `examiner`, keine Klassen)
- Rolle/Klassen werden in der App selbst im Admin-Panel (👥-Button im Header,
  nur für `admin` sichtbar) zugewiesen – Accounts (E-Mail/Passwort) legt man
  weiterhin manuell im Supabase-Dashboard an (Authentication → Users)
- Row Level Security: `admin` hat vollen Zugriff auf `participants`,
  `examiner` sieht/bearbeitet nur Teilnehmer der eigenen `classes` und darf
  nicht löschen; Teilnehmer ohne Klasse sind nur für `admin` sichtbar
- Schema-Änderungen an der DB liegen dokumentiert (aber nicht automatisch
  ausführbar) unter `sql/*.sql` – im Supabase SQL Editor manuell ausführen.
  **Weil das von Hand passiert, können Datei und Datenbank auseinanderlaufen.**
  `sql/008_ist_stand_pruefen.sql` liest den tatsächlichen Stand aus (reine
  Leseabfragen) – nach jeder Schema-Änderung einmal laufen lassen und
  abgleichen. Genau so wurden zwei Abweichungen gefunden: das Altersconstraint
  aus Phase 1, das den Import blockierte, und die nie angelegte Keep-Alive-
  Tabelle aus `004`. Dateien mit dem Hinweis „NICHT AUSFÜHREN" (`001`, `004`)
  beschreiben Bestand, sind also keine Migrationen.

## Datenschutz

Es werden Schülerdaten verarbeitet (Name, Geburtsdatum/-jahr, Klasse, Geschlecht).
Supabase-Projekt läuft in der EU-Region (Frankfurt) für DSGVO-Konformität.
Keine Noten oder Gesundheitsdaten im engeren Sinne, aber sensibel genug für
sorgfältigen Umgang (RLS, keine Klartext-Secrets im Repo).

## Stand des Projekts

**Phase 1 (abgeschlossen):** Teilnehmerverwaltung, Leistungserfassung in allen
4 Disziplingruppen, automatische Punkteberechnung, Klassen-Filter, Live-Suche,
CSV Import/Export, PWA/Service Worker, Loading-Animation.

**Phase 2 (abgeschlossen):** Multi-User & Authentifizierung, in Vanilla JS
(kein Framework-Wechsel geplant).
1. ✅ Supabase Auth einrichten + Login-Seite
2. ✅ Rollen in der DB definieren (admin / examiner) – Tabelle `profiles`
3. ✅ Row Level Security in Supabase (Examiner sieht nur eigene Klassen)
4. ✅ UI je nach Rolle anpassen + Admin-Panel für Rollen/Klassen-Zuweisung
5. ✅ Admin-Exportfunktion (CSV-Export berücksichtigt aktiven Filter,
   listet offene Disziplinen pro Teilnehmer)

Bewusst zurückgestellt: vollständige In-App-Account-Erstellung (E-Mail+
Passwort) würde eine Supabase Edge Function + Service-Role-Key erfordern –
Accounts werden weiterhin manuell im Supabase-Dashboard angelegt.

**Nach dem ersten Aktionstag (14.08.2026):** Datenqualität. Beim Übertragen der
handschriftlichen Listen entstanden Fehleingaben, vor allem `3,47` statt `3:47`
beim 800m-Lauf. `calculatePoints` hat solche Werte als Sekunden gelesen – aus
einer 3:47er-Zeit wurden 3,47 Sekunden und damit klaglos Gold. Drei Baustellen,
eine gemeinsame Regel:

1. **`pruefeLeistung(value, exercise)` in `app.js`** ist die einzige Quelle für
   „ist diese Eingabe plausibel?" und liefert `ok` / `warnung` / `fehler` plus
   optional einen Korrekturvorschlag. `min:sec` verlangt zwingend einen
   Doppelpunkt (Sekunden ≥ 60 sind ein Tippfehler); Zahlwerte werden gegen einen
   großzügigen Bereich aus den Tabellenwerten geprüft (Bronze/4 bis Gold×3),
   damit `345` statt `3,45` Meter auffällt. Bewusst großzügig – eine Warnung,
   die zu oft kommt, wird ignoriert.
2. **Live im Formular:** Fehler blockieren das Speichern, Warnungen brauchen
   eine Bestätigung, eindeutige Tippfehler werden beim Verlassen des Feldes
   sichtbar korrigiert (`3,47` → `3:47`, `347` → `3:47`).
3. **`calculatePoints` gibt bei einer `min:sec`-Angabe ohne Doppelpunkt 0
   Punkte** statt einer erfundenen Medaille. Alt-Datensätze fallen dadurch auf
   0 – gewollt, sie tauchen dann in der Prüf-Ansicht auf.

**Phase 3 (optional, noch kein festgelegter Zeitpunkt):** Multi-Tenancy für
mehrere Schulen.

## Prüf-Ansicht (`pruefung.js`)

🔎-Button im Header: listet alle Einträge, deren Rohwert nicht zur Übung passt
oder unplausibel ist – nach Klasse und Teilnehmer sortiert, mit Eingabefeld und
Punkte-Vorschau direkt in der Zeile. Drei Prüfstufen (nur Fehler / plus
unplausible Werte / plus alles mit 0 Punkten). „Alle Vorschläge übernehmen"
schreibt die eindeutigen Korrekturen nach Rückfrage in einem Rutsch (ein Update
pro Teilnehmer, danach einmal neu laden).

Die Prüflogik selbst steht in `app.js`, nicht hier – dieselbe Regel prüft im
Formular, in dieser Ansicht und in der Export-Spalte „Auffälligkeiten".
Entfernen wie beim Aktionstag-Modul: Script-Zeile in `index.html`, Datei,
`urlsToCache` in `sw.js`.

## CSV-Export

Der 💾-Button öffnet seit dem Aktionstag erst eine Spaltenauswahl
(`EXPORT_SPALTEN` in `app.js`, Auswahl wird im `localStorage` gemerkt).
Exportierbar ist alles, was in der DB steht – **inklusive der gewählten Übung
und der eingetippten Rohleistung pro Disziplingruppe**, denn ohne die lässt
sich eine Fehleingabe von außen nicht finden. Optional die Spalte
„Auffälligkeiten" (Klartext aus `pruefeTeilnehmer`). Der Export folgt weiterhin
dem aktiven Filter der Liste.

## Zusatzmodul: Aktionstag-Wertung (`aktionstag.js`)

Schulinterne Zusatzwertung, **unabhängig vom Sportabzeichen**: ermittelt pro
Jahrgangsstufe die drei besten Jungen und Mädchen (🏆-Button im Header).
Verrechnet nicht die DSA-Punkte (0–3 pro Disziplin, viel zu grob für eine
Rangfolge), sondern die **Rohleistungen** aus Sprint, 800m, Ballwurf und
Weitsprung, die am Aktionstag alle Kinder der Jahrgänge 5/6 absolvieren.

- Faktoren stehen im `CONFIG`-Block ganz oben in der Datei und sind so
  gewählt, dass jede Disziplin ~300 Punkte Spanne beisteuert. **Nach dem
  ersten Aktionstag anhand der echten Leistungsspannen nachjustieren** – die
  aktuellen Werte beruhen auf geschätzten Spannen.
- Nur Teilnehmer mit **allen vier** Werten werden gewertet (eine fehlende
  Disziplin würde sonst rechnerisch Punkte bringen).
- Warnt, wenn in einem Jahrgang gemischte Wurfgeräte erfasst sind
  (Schlagball 80g vs. Wurfball 200g – die DOSB-Tabellen wechseln bei Jungen
  ab 12 Jahren das Gerät, die Weiten sind dann nicht vergleichbar).
- Für `examiner` ist die Rangliste durch RLS unvollständig; darauf wird in
  der Ansicht hingewiesen.

**Bewusst als entfernbares Modul angelegt** (falls es sich nicht bewährt):
Button, Ansicht und Styles werden zur Laufzeit selbst erzeugt, `app.js` und
`styles.css` sind unberührt. Entfernen = Script-Zeile in `index.html` löschen,
`aktionstag.js` löschen, Eintrag aus `urlsToCache` in `sw.js` entfernen – und
diesen Abschnitt hier.

## Arbeitsstil

- Bitte auf Deutsch antworten.
- Ich bin Vibecoding-Anfänger (kein professioneller Entwickler). Bitte
  schrittweise anleiten und kurz erklären *warum*, nicht nur *was*.
- Ich implementiere meist selbst nach Anleitung; bei komplexeren Features
  gerne auch vollständige Datei-Vorschläge.
- Lokales Testen läuft über einen kleinen Server (`.claude/launch.json`,
  `python3 -m http.server 8765`), nicht mehr über `file://` – seit dem Login
  wird `localStorage` für die Supabase-Session gebraucht, das über `file://`
  unzuverlässig ist. Zusätzlich live auf GitHub Pages testen.
- Bei jedem Deployment: Service-Worker-Version hochzählen (Cache-Bump nicht
  vergessen).
- Das GitHub Personal Access Token liegt im macOS Keychain als
  maschinenweites Git-Credential (nicht projektspezifisch) – bei
  Auth-Problemen zuerst dort schauen, nicht in den Projekt-Secrets.
