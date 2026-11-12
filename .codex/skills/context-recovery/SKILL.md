---
name: context-recovery
description: Stelle Anforderungskontext aus einer nummerierten Markdown-Datei unter requirements/ wieder her. Verwende den Skill zum Laden einer vorhandenen Anforderung vor Interview, Tests, Implementierung oder Abschluss.
---

# Context Recovery

Workshop-Grundlage: [re-context-recovery](https://github.com/workshops-de/ki-software-engineer/blob/16df2060389baac88b21ad50de4340050bbad750/.claude/skills/re-context-recovery/SKILL.md).

- Lies vorhandene Projektregeln wie AGENTS.md und README.md; beachte auch Regeln
  im Verzeichnis der gefundenen Anforderung.
- Verwende die im Auftrag genannte Anforderungsnummer. Fehlt sie, frage gezielt
  danach; leite sie nicht aus Branch-Namen oder der zuletzt bearbeiteten Datei ab.
- Akzeptiere eine positive ganze Zahl als Nummer, keinen frei angegebenen Pfad.
- Suche zuerst `requirements/<nummer>.md`, danach bei Bedarf rekursiv unter
  `requirements/` nach demselben Dateinamen. Verwende vorhandene Suchwerkzeuge.
- Fehlen Verzeichnis oder Datei, melde den konkreten fehlenden Pfad und beende
  die Wiederherstellung. Erstelle keine Ersatzanforderung. Bei mehreren Treffern
  klaere den gemeinten Pfad, statt willkuerlich eine Datei zu waehlen.
- Lies die vollstaendige Datei und darin referenzierte relevante lokale Dokumente.
  Fasse Geschaeftskontext, User Story, Akzeptanzkriterien mit ihrem Status,
  technische Hinweise und offene Fragen zusammen. Nenne den Quellpfad.
- Unterscheide dokumentierte Anforderungen, Annahmen und nachgewiesenen Iststand.
  Ein gesetztes Haekchen allein beweist keinen aktuellen erfolgreichen Testlauf.
- Dieser Skill liest Kontext. Er aendert keine Dateien und startet weder
  Implementierung noch Tests oder GitHub-Aktionen ohne entsprechenden Auftrag.
