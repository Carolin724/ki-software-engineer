---
name: developer-blue
description: Refaktoriere gezielt Angular-Komponenten, Services und Templates im BookMonkey-Projekt nach erfolgreicher GREEN-Phase unter Erhalt des Verhaltens. Verwende den Skill fuer beauftragtes Refactoring, nicht fuer neue Features oder Testinfrastruktur.
---

# Developer Blue

Workshop-Grundlage: [se-blue](https://github.com/workshops-de/ki-software-engineer/blob/16df2060389baac88b21ad50de4340050bbad750/.claude/skills/se-blue/SKILL.md).

## Umfang festlegen

- Lies vorhandene Projektregeln, README.md und gegebenenfalls ARCHITECTURE.md
  sowie REFACTORING.md; letzteres ist kein pauschaler Implementierungsauftrag.
  Pruefe Git-Status und erhalte vorhandene Aenderungen.
- Benoetigt wird eine konkrete Komponente, ein Selektor, Dateipfad oder klar
  abgegrenzter Service. Frage bei fehlendem Ziel danach.
- Verstehe Anforderungen, Datenfluss und Tests. Reproduziere die relevante
  gruene Ausgangsbasis. Klaere fachliche Fehler oder Umgebungsblockaden getrennt,
  bevor du verhaltensaendernde Korrekturen als Refactoring behandelst.
- Liste sinnvolle Extraktionen kleiner praesentationaler Komponenten mit Nutzen
  auf. Frage gemaess Workshop nach der Auswahl, soweit der aktuelle Auftrag diese
  nicht bereits festlegt. Fuehre nur beauftragte Refactorings aus.

## Angular gezielt verbessern

- Erhalte oeffentliche Vertraege, englische UI-Texte und fachliches Verhalten.
  Buchbezogener Code bleibt unter `src/app/books/`, HTTP-Zugriff im `BookApiClient`.
  Keine neuen Stores, Bibliotheken oder Architekturwechsel ohne Bedarf und Auftrag.
- Beachte strikte Typisierung, vermeide `any` und halte eigenstaendige Klassen,
  Funktionen oder Typen in passend benannten Dateien, soweit im Umfang erforderlich.
- Nutze Standalone-Komponenten; Angular 20 benoetigt kein `standalone: true`.
  Entferne `CommonModule` nur, wenn keine seiner Direktiven oder Pipes mehr noetig
  sind. Importiere benoetigte Router-Direktiven gezielt.
- Ersetze im beauftragten Bereich strukturelle Direktiven durch `@if`, `@for`
  und `@switch`; nutze `@empty` fuer leere Listen und stabile Schluessel wie
  `track book.id`. Erhalte Lade-, Leer- und Fehlerzustaende.
- Bevorzuge `inject()` statt Konstruktor-Injektion sowie `input()`/`output()`
  und lokale Signals mit `computed()` fuer abgeleiteten Zustand. Bei einer
  Umstellung muessen Bindungen, Subscription-Lebensdauer und Nebenwirkungen erhalten
  bleiben. Nutze `toSignal` nur mit passendem Initialwert und Injection-Kontext.
- Pruefe OnPush und einfache Klassen-/Style-Bindings im betroffenen Bereich;
  fuehre keine repositoryweite Modernisierung als Nebenarbeit aus.
- Die Workshop-Vorlage setzt einen HTTP-Fehlerinterceptor voraus. Pruefe dessen
  Existenz und Wirkung zuerst. Entferne lokales Fehlerhandling nicht aufgrund
  dieser Behauptung. Klaere eine beabsichtigte Entfernung, wenn sie nicht bereits
  beauftragt ist, und erhalte die Fehleranzeige sowie das Ende des Ladezustands.

## Verhalten absichern

- Fuehre relevante bestehende Tests vor und nach dem Refactoring sowie
  `npm run build` aus. Erhalte fachliche Testaussagen; passe technische Testdetails
  nur bei nachgewiesenem Bedarf an und begruende dies.
- Nutze die tatsaechlichen Konfigurationen: Playwright unter `tests/` mit
  Chromium, Firefox und WebKit; ein einzelnes Projekt belegt nicht alle drei.
  Externe Playwright-Beispieltests sind kein BookMonkey-Verhaltensnachweis.
- Pruefe die Ausfuehrbarkeit des Karma-Ziels und seiner Abhaengigkeiten, statt
  aus `npm test` auf funktionierende Unit-Tests zu schliessen. Melde Blockaden,
  ohne Testkonfiguration oder Abhaengigkeiten eigenmaechtig zu reparieren.
- Berichte Refactoring, erhaltenes Verhalten, Test-/Build-Ergebnisse und Grenzen.
  Keine neuen Features, Workflow- oder Secret-Aenderungen, Commits, Pushes oder PRs.
