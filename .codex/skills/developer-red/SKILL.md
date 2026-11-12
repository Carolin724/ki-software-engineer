---
name: developer-red
description: Erstelle auf ausdruecklichen Wunsch Playwright-UI-Tests aus bestaetigten BookMonkey-Anforderungen und weise die TDD-RED-Phase nach. Verwende den Skill vor developer-green, ohne fehlendes Produktverhalten bereits zu implementieren.
---

# Developer Red

Workshop-Grundlage: [se-red](https://github.com/workshops-de/ki-software-engineer/blob/16df2060389baac88b21ad50de4340050bbad750/.claude/skills/se-red/SKILL.md).

## Auftrag vorbereiten

- Lies vorhandene AGENTS.md, README.md, Anforderungen, betroffene Quellen und
  Tests. Pruefe Git-Status und erhalte bestehende Aenderungen.
- Benoetigt werden eine User Story mit pruefbaren Akzeptanzkriterien und der
  betroffene Funktionsbereich. Lade bei bekannter Nummer die Datei unter
  `requirements/`; nutze bei Bedarf context-recovery. Klaere fehlenden Kontext.
- Frage nach der maximalen Anzahl neuer UI-Tests, sofern nicht bereits angegeben.
  Empfiehl fuer den Workshop zunaechst einen Test und warte auf die Antwort.
- Die Workshop-Vorlage sieht einen `feature/`-Branch vor. Beachte den aktuellen
  Auftrag und vorhandene Branch-Arbeit; wechsle oder erstelle keinen Branch ohne
  entsprechenden Auftrag. Ein Branch ist keine Voraussetzung fuer RED.

## UI-Tests schreiben

- Verwende `@playwright/test` und sprechende Dateien unter `tests/**/*.spec.ts`.
  Ordne jeden Test einem bestaetigten Kriterium zu; benenne ihn nach
  `given ... when ... then ...`. Halte das vereinbarte Testlimit ein.
- Teste sichtbares Nutzerverhalten mit konkreten Assertions. URL- oder
  Parameterpruefungen allein ersetzen keinen UI-Verhaltenstest.
- Nutze bevorzugt `getByRole` und `getByLabel`, bei Bedarf vorhandene Test-IDs.
  Keine fragilen CSS-Klassen, festen Wartezeiten oder erfundenen Locators.
- Lies `playwright.config.ts`: aktuell `testDir: './tests'`, webServer via
  `npm start` auf Port 4200, aber keine aktive `baseURL`. Verwende deshalb
  absolute URLs wie `http://localhost:4200/`; passe die Konfiguration nicht an.
- Isoliere die Buch-API bei Bedarf mit `page.route` vor der Navigation und
  passenden Fixtures fuer `http://localhost:4730/books`. Erhalte die tatsaechlichen
  Datentypen, etwa getrennte `id`/`isbn` und Preise als Zeichenketten. Kennzeichne
  gemockte Tests; sie belegen keinen laufenden echten API-Dienst.
- Aendere nur benoetigte Tests und Testdaten. Erhalte vorhandene Specs und
  Erwartungen. Kein Produktionscode, keine kuenstlichen Fehler, skip/only oder
  abgeschwaechte Assertions, um RED herzustellen.

## RED nachweisen

- Fuehre gezielt `npx playwright test tests/<datei>.spec.ts --project=chromium --reporter=line`
  aus. Melde RED nur bei einem nachvollziehbaren Fehlschlag wegen des noch
  fehlenden geforderten Verhaltens. Bereits erfuellte Kriterien bleiben gruen.
- Syntaxfehler, falsche Fixtures, fehlende Browser, Abhaengigkeiten oder Dienste
  sind keine fachliche RED-Evidenz. Melde solche Blockaden getrennt; installiere
  keine Frameworks und aendere keine Testkonfiguration ohne passenden Auftrag.
- `tests/example.spec.ts` prueft die externe Playwright-Website, nicht BookMonkey;
  `tests-examples/` liegt ausserhalb des konfigurierten Testverzeichnisses.
- Das Karma-Ziel in angular.json belegt keine vollstaendige Installation der
  Karma/Jasmine-Abhaengigkeiten. Fuehre keine neue Unit-Test-Infrastruktur ein.
- Uebergib Kriterienzuordnung, Testdateien, Befehl, tatsaechliches Ergebnis und
  verbleibende Luecken an GREEN. Ein Chromium-Lauf belegt nicht Firefox/WebKit.
  Keine Workflow- oder Secret-Aenderungen, Commits, Pushes oder PRs.
