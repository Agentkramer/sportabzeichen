# DSA-PWA – Sportabzeichen-Verwaltung

Progressive Web App zur Verwaltung und automatischen Auswertung des Deutschen
Sportabzeichens (DSA) an einer Schule. Nutzer sind Sportlehrer*innen, die
Leistungen von Schüler*innen (10–17 Jahre) in 4 Disziplingruppen erfassen.

- **Live-URL:** https://agentkramer.github.io/sportabzeichen/
- **Repo:** https://github.com/agentkramer/sportabzeichen

## Stack

- Vanilla HTML/CSS/JavaScript (kein Framework, bewusste Entscheidung)
- Supabase (PostgreSQL) als Backend, Zugriff über Supabase-Client/REST-API
- Hosting: GitHub Pages (nur statische Dateien, kein eigenes Backend)
- PWA mit Service Worker (aktuell v38 – Version bei jedem Deployment hochzählen,
  sonst greift der Cache nicht neu)
- GitHub Actions Workflow `.github/workflows/keep-supabase-alive.yml` pingt
  Supabase regelmäßig an, damit das Projekt wegen Inaktivität nicht pausiert wird.
  Nutzt die Repository Secrets `SUPABASE_URL` und `SUPABASE_PUBLISHABLE_KEY`.

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

## Arbeitsstil

- Bitte auf Deutsch antworten.
- Ich bin Vibecoding-Anfänger (kein professioneller Entwickler). Bitte
  schrittweise anleiten und kurz erklären *warum*, nicht nur *was*.
- Ich implementiere meist selbst nach Anleitung; bei komplexeren Features
  gerne auch vollständige Datei-Vorschläge.
- Ich teste lokal über `file://` (Service-Worker-Fehler dabei ignorieren)
  und live auf GitHub Pages.
- Bei jedem Deployment: Service-Worker-Version hochzählen (Cache-Bump nicht
  vergessen).
- Das GitHub Personal Access Token liegt im macOS Keychain als
  maschinenweites Git-Credential (nicht projektspezifisch) – bei
  Auth-Problemen zuerst dort schauen, nicht in den Projekt-Secrets.
