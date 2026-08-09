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
- PWA mit Service Worker (aktuell v41 – Version bei jedem Deployment hochzählen,
  sonst greift der Cache nicht neu; hält sich hartnäckig, im Zweifel Hard-Reload
  oder Service Worker in den DevTools abmelden)
- Keep-Alive gegen die Supabase-Pausierung (Free Tier pausiert nach 7 Tagen
  Inaktivität) läuft über einen externen Cronjob bei **cron-job.org**, der
  `POST /rest/v1/rpc/bump_keepalive` aufruft (Header `apikey`). Der frühere
  GitHub-Actions-Workflow wurde entfernt: GitHub deaktiviert geplante Workflows
  nach 60 Tagen ohne Commit – bei unregelmäßiger Weiterentwicklung also
  unbrauchbar. Ein reiner Lese-Ping auf `participants` reicht übrigens nicht,
  weil er seit RLS als `anon` ein leeres Ergebnis liefert; `bump_keepalive()`
  (siehe `sql/004_keepalive.sql`) erzeugt stattdessen einen echten Schreibvorgang.

## Datenstruktur

Tabelle `participants`:
- `id`, `external_id`, `first_name`, `last_name`, `birth_year` (ggf. `birth_date`),
  `class_name`, `gender`
- `results` (JSONB): `{ ausdauer: {exercise: "lauf_800", value: "3:45"}, kraft: {...}, ... }`
- **Wichtig:** Fehlende Disziplinen sind `undefined`, nicht `0` – das ist
  Absicht und wird in der Punktelogik so ausgewertet.
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
  ausführbar) unter `sql/*.sql` – im Supabase SQL Editor manuell ausführen

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

**Phase 3 (optional, noch kein festgelegter Zeitpunkt):** Multi-Tenancy für
mehrere Schulen.

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
