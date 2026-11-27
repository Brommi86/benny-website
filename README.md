# benny-website – müller.architekten, Heilbronn

Redesign der Website von **müller.architekten.PartGmbB**: Startseite, fünf Projektseiten, Impressum und Datenschutz als statische HTML-Seiten.

## Ansehen

Repository herunterladen und `index.html` im Browser öffnen (Chrome, Edge oder Safari empfohlen). Für den Livebetrieb den kompletten Inhalt auf einen Webserver hochladen – ein Build-Schritt ist nicht nötig.

## Aufbau

| Datei / Ordner | Inhalt |
|---|---|
| `index.html` | Startseite |
| `projekt-*.html` | Projektseiten (Armsündersteige, Münzing Chemie, ERF Medien, Schweinsbergweg, Weingut Albrecht-Kiessling) |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `bilder/` | Fotos (WebP/JPG) und Logo |
| `assets/runtime.js` | kleines Skript für Menü, Filter, Galerie, Aufklapper und Formular |

Jede Seite enthält den vorgerenderten Inhalt (für Suchmaschinen sofort lesbar) und zusätzlich die Vorlage in `<template id="tpl">`, aus der `runtime.js` die interaktiven Teile aufbaut.

## Vor dem Livegang

1. **Kontaktformular**: prüft Pflichtfelder, verschickt aber noch nichts – Versand anbinden (z. B. PHP-Mailer oder Formulardienst).
2. **Datenschutzerklärung**: nur Gliederung mit Platzhaltern `[ … ]` – Volltext ergänzen.
3. **Impressum**: Registergericht fehlt (Platzhalter); alle Angaben rechtlich prüfen.
4. **Projektseiten**: Platzhalter „[Projektbeschreibung vom Büro ergänzen]“ ersetzen.
5. **Auszeichnung** „Beispielhaftes Bauen 2015–2020“ beim Weingut bestätigen oder entfernen.
6. **Schriften** (Archivo, Inter) werden von Google Fonts geladen – datenschutzfreundlicher selbst hosten.
7. **Zahlen prüfen**: 57 Projekte, 34 Wettbewerbe, „seit 1989“, Leistungsphasen 1–9.

## Hinweise

- Die Scroll-Effekte nutzen moderne CSS-Funktionen; in Firefox erscheinen die Inhalte ohne diese Effekte.
- Bei aktivierter Systemeinstellung „Bewegung reduzieren“ läuft die Seite ohne Animationen.
