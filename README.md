# sportabzeichen

Progressive Web App zur Verwaltung und automatischen Auswertung des Deutschen
Sportabzeichens an einer Schule. Vanilla HTML/CSS/JavaScript, Supabase als
Backend, Hosting über GitHub Pages.

- **Live:** https://agentkramer.github.io/sportabzeichen/
- **Architektur und Entscheidungen:** [CLAUDE.md](CLAUDE.md)
- **Datenbankschema:** [`sql/`](sql/) – die Dateien sind Dokumentation, sie
  werden von Hand im Supabase SQL Editor ausgeführt

Privates, nicht-kommerzielles Projekt. Kein Angebot des Landes Niedersachsen
oder einer Schule.

## Lokal starten

Nicht über `file://` öffnen – seit dem Login wird `localStorage` für die
Supabase-Session gebraucht, was über `file://` unzuverlässig ist.

```bash
python3 -m http.server 8765
```

Dann http://localhost:8765/ aufrufen. (Entspricht `.claude/launch.json`.)

## Rechtstexte

`impressum.html` und `datenschutz.html` liegen neben der App und sind
**ohne Login** erreichbar. Sie laden kein JavaScript und kein Supabase,
benutzen aber dieselbe `styles.css` – es gibt also nur eine Datei zu pflegen.

Der Footer mit „Impressum · Datenschutz" steht in `index.html` bewusst
**außerhalb** von `#appContent`. Läge er darin, wäre er vor dem Login
unsichtbar – also genau dort, wo man ihn am ehesten sucht.

Wenn sich an den Datenflüssen etwas ändert, muss `datenschutz.html` mit.
Betroffen sind insbesondere:

| Was sich ändert | Abschnitt in `datenschutz.html` |
|---|---|
| neues Feld in `participants` | 3.1 |
| neuer `localStorage`-Schlüssel | 7. |
| neue externe Ressource (CDN, Schrift, iframe) | 3.4 und 4. |
| neuer Dienst (KI-API, Mailversand, Statistik) | 3.4, 4. und 5. |
| Registrierung wird geöffnet | 3.4 |

## Keine externen Ressourcen

Die Seite lädt **nichts** von fremden Servern. Das war nicht immer so: bis
Oktober 2026 hingen in `index.html` ein `<link>` auf `fonts.googleapis.com`
und ein `<script src>` auf `cdn.jsdelivr.net`. Beides übertrug bei jedem
Seitenaufruf die IP-Adresse der Lehrkraft an ein fremdes Unternehmen, und das
Skript war zusätzlich unversioniert (`@supabase/supabase-js@2`) – es holte
also jede neue 2.x ungefragt, inklusive einer womöglich kompromittierten.

Jetzt liegt beides im Repo:

| Ordner | Inhalt |
|---|---|
| `vendor/` | `supabase-js-2.118.0.js` – das UMD-Bündel, Version im Dateinamen |
| `fonts/` | IBM Plex Sans v23, zwei `woff2`-Dateien (Latin und Latin-Ext) |

Es sind zwei Schriftdateien statt acht, weil IBM Plex Sans als Variable Font
kommt: eine Datei deckt den Bereich 100–700 ab. Zusammen 68 KB; der Service
Worker cacht sie mit, die App sieht offline also aus wie online.

**Kein Build-Schritt.** Bewusst kein `package.json`, kein `node_modules`, kein
`npm run`-Schritt vor dem Deployment: GitHub Pages liefert die Dateien direkt
aus, wie alles andere hier auch. Erneuert wird von Hand, selten, nach der
folgenden Anleitung.

### Fremde Bibliotheken und Schriften erneuern

**Supabase-Client.** Neue Version prüfen, holen, einbinden:

```bash
curl -s https://registry.npmjs.org/@supabase/supabase-js | python3 -c "import sys,json;print(json.load(sys.stdin)['dist-tags']['latest'])"
```

```bash
V=2.118.0; curl -sS -L -o "vendor/supabase-js-$V.js" "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@$V/dist/umd/supabase.js"
```

Danach an **drei** Stellen den Dateinamen mitziehen und die alte Datei löschen:

1. `index.html` – das `<script src="vendor/…">`
2. `sw.js` – der Eintrag in `urlsToCache`
3. `sw.js` – `CACHE_NAME` hochzählen

Dann anmelden und einen Datensatz speichern. Der Client ist die einzige
Verbindung zur Datenbank – wenn er nicht lädt, lädt gar nichts, das fällt also
sofort auf.

**Schrift.** Selten nötig. Die Google-Fonts-CSS für die gewünschten Schnitte
abrufen (mit Browser-User-Agent, sonst kommt `woff` statt `woff2`), darin die
`woff2`-Adressen für `latin` und `latin-ext` heraussuchen, die beiden Dateien
nach `fonts/` legen und in `styles.css` den Dateinamen sowie die
`unicode-range`-Angaben abgleichen. Die Version (`v23`) steckt im Dateinamen,
damit beim Update auffällt, dass sich etwas geändert hat.

### Prüfen, dass wirklich nichts rausgeht

```bash
grep -rn "https://" index.html impressum.html datenschutz.html styles.css
```

Erwartung: nur `lfd.niedersachsen.de` in `datenschutz.html` (ein Textlink, der
nur beim Anklicken etwas lädt). Zusätzlich in den DevTools unter „Network" nach
dem Neuladen prüfen, dass außer `localhost` nur `*.supabase.co` auftaucht.

## Registrierung ist gesperrt

Eine Selbstregistrierung ist **nicht möglich**. Konten legt die
administrierende Person im Supabase-Dashboard an (Authentication → Users),
Rolle und Klassen werden danach im Admin-Panel (👥) zugewiesen.

Gesperrt wird das an **genau einer Stelle**: im Supabase-Dashboard unter
Authentication ist „Allow new users to sign up" **aus**. Mehr gibt es nicht.
Dass `app.js` kein `signUp()` und kein `signInWithOtp()` enthält, sperrt
*nichts* – der anon-Key ist öffentlich, `POST /auth/v1/signup` kann jeder
aufrufen. Fehlende Oberfläche ist keine Sperre.

`sql/012_registrierung_sperren.sql` beschreibt ein zweites Schloss dahinter
(ein Trigger auf `auth.users`, der nur freigeschaltete Adressen durchlässt),
ist aber **bewusst nicht ausgeführt**: Der Preis wären zwei Schritte bei jedem
neuen Konto. Die Datei erklärt die Abwägung.

Dafür gilt **Abschnitt D** dieser Datei, und der ist jetzt der Ersatz. Ein
einzelner Schalter in einer Weboberfläche fällt lautlos um – in diesem Projekt
ist genau das schon zweimal passiert (Keep-Alive, siehe `sql/009`). Vor und
nach jedem Aktionstag und nach jeder Änderung an den Auth-Einstellungen
nachsehen, ob der Schalter noch aus ist:

```bash
curl -s -X POST 'https://uuawbivebnknxnegrolu.supabase.co/auth/v1/signup' -H "apikey: $ANON_KEY" -H 'Content-Type: application/json' -d '{"email":"kein-gueltiges-format","password":"x"}'
```

Erwartet: `{"code":422,"error_code":"signup_disabled",…}`. Die absichtlich
ungültige Adresse sorgt dafür, dass dabei auch dann kein Konto entsteht, wenn
der Schalter an sein sollte. Kommt stattdessen eine Meldung über die ungültige
Adresse, ist er **an** – dann sofort ausschalten und die Kontenliste prüfen
(Abfrage 1 in `sql/012`).

Ein selbst angelegtes Konto bekäme übrigens Rolle `examiner` ohne Klassen und
sähe durch die Row Level Security keinen einzigen Teilnehmer. Es wäre aber da,
und `datenschutz.html` Abschnitt 3.4 sichert zu, dass es das nicht gibt.

## Bei jedem Deployment

`CACHE_NAME` in `sw.js` hochzählen. Ohne Bump greift der Cache nicht neu und
hält sich hartnäckig – im Zweifel Hard-Reload oder den Service Worker in den
DevTools abmelden.
