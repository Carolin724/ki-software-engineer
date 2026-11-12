---
name: requirements-updater
description: Gleiche nach Implementierung und gegebenenfalls Refactoring die Lieferung mit vorhandenen Akzeptanzkriterien ab und aktualisiere die lokale Anforderungsdatei mit Nachweisen und offenen Punkten. Verwende den Skill zum ausdruecklich beauftragten Anforderungsabschluss.
---

# Requirements Updater

Workshop-Grundlage: [re-updater](https://github.com/workshops-de/ki-software-engineer/blob/16df2060389baac88b21ad50de4340050bbad750/.claude/skills/re-updater/SKILL.md).

## Anforderung und Evidenz laden

- Lies vorhandene Projektregeln, README.md, Git-Status und die urspruengliche
  `requirements/<nummer>.md`. Nutze bei Bedarf context-recovery. Frage nach der
  fehlenden Nummer; bei fehlender Datei melde die Luecke und erfinde keinen Ersatz.
- Pruefe Implementierung, betroffene Routen, Komponenten und Tests. Die Workshop-
  Referenz nennt einen vorausgehenden UI/UX-Schritt; setze keinen hier nicht
  vorhandenen Skill voraus. Entscheidend sind nachgewiesene Kriterien.
- Ordne jedem Kriterium konkrete Implementierungsstellen und Verifikation zu.
  Ein erfolgreicher Build, ein alter Bericht oder ein bestehendes Haekchen allein
  belegen kein erfuelltes fachliches Kriterium.

## Lieferung verifizieren

- Ermittle Befehle und Voraussetzungen aus package.json, angular.json und
  playwright.config.ts. Fuehre relevante vorhandene Tests und `npm run build`
  aus; pruefe bei finalem Gesamtabschluss alle relevanten Browserprojekte mit
  `npx playwright test --reporter=line`. Dokumentiere jede Einschraenkung.
- Pruefe fuer `npm test` zuerst die Ausfuehrbarkeit: hier ist ein Karma-Ziel
  konfiguriert, aber die benoetigten Karma/Jasmine-Abhaengigkeiten sind nicht
  vollstaendig deklariert. Ein fehlgeschlagener Start ist kein bestandener Test.
  Nutze bei ausfuehrbarem Ziel einen beendenden Lauf wie `npm test -- --watch=false`.
- Playwright startet Angular auf Port 4200 und hat keine aktive baseURL.
  Unterscheide fachliche App-Tests, gemockte API-Antworten, echte API-Pruefungen
  und externe Beispieltests. Chromium allein belegt nicht Firefox und WebKit.
- Repariere in diesem Abschlussauftrag weder Anwendung noch Tests, Konfiguration,
  Abhaengigkeiten oder Dienste. Melde fehlende Browser, Build-Probleme und andere
  Blockaden mit betroffenem Befehl und Ursache; verschweige keine fehlenden Laeufe.

## Bestehende Datei aktualisieren

- Erhalte Story, Umfang und Wortlaut der vereinbarten Kriterien. Markiere `[x]`
  nur bei belegter Erfuellung. Lasse offene Kriterien als `[ ]` mit Begruendung;
  korrigiere nachweislich ueberholte Statusangaben und erlaeutere die Korrektur.
- Fuege einen knappen Implementierungs- und Verifikationsbericht hinzu: betroffene
  Dateien, Kriterienzuordnung, tatsaechliche Befehle und Ergebnisse sowie offene
  Punkte. Unterscheide fehlende Umsetzung von fehlender Verifikation.
- Melde vollstaendigen Abschluss nur, wenn alle Kriterien belegt und relevante
  Pruefungen bestanden sind. Andernfalls berichte den Teilstand und konkrete Luecken.
- Nenne im Ergebnis Anforderungspfad, User Story, Anzahl erfuellter Kriterien,
  gelieferte Funktionen und verbleibende Aufgaben. Aendere nur die betroffene
  Anforderungsdatei; keine Workflows, Secrets, Commits, Pushes oder PRs und kein
  Schliessen von GitHub-Issues als Teil dieses Skills.
