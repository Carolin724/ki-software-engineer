---
name: requirements-interviewer
description: Fuehre auf ausdruecklichen Wunsch ein schrittweises Anforderungsinterview und speichere User Story, pruefbare Akzeptanzkriterien und technische Hinweise unter requirements/. Verwende den Skill vor der Implementierung zur Anforderungserhebung.
---

# Requirements Interviewer

Workshop-Grundlage: [re-reporter](https://github.com/workshops-de/ki-software-engineer/blob/16df2060389baac88b21ad50de4340050bbad750/.claude/skills/re-reporter/SKILL.md).

## Interview

- Lies vorhandene Projektregeln, README.md und relevante Anforderungen. Pruefe
  betroffenen Code und Konfigurationen, bevor du technische Gegebenheiten behauptest.
- Klaere zuerst Problem, betroffene Rolle, Ziel und Nutzen. Frage schrittweise
  nach Normalablauf, Fehlern, leeren Zustaenden, Validierung und Abgrenzung.
- Nutze bereits beantwortete Fragen. Stelle wenige gezielte Fragen pro Runde
  und warte auf Antworten, wenn davon verbindliche Kriterien abhaengen.
- Klaere relevante technische Grenzen, Daten/API-Vertraege, Barrierefreiheit,
  Abhaengigkeiten und Zeitvorgaben. Erfinde keine zusaetzlichen Pflichtanforderungen.
- Fasse Umfang und offene Punkte zusammen. Kennzeichne Vorschlaege und Annahmen;
  behandle sie erst nach Bestaetigung als vereinbarte Anforderungen.

## Ergebnis speichern

- Verwende die Workshop-Struktur mit den Abschnitten `Business Context`,
  `User Story`, `Acceptance Criteria` und `Technical Advice`.
- Formuliere die Story als Rolle, gewuenschte Faehigkeit und Nutzen.
- Schreibe jedes Akzeptanzkriterium als eigene offene Checkbox `- [ ]` mit
  beobachtbarem Ergebnis, bevorzugt in Given/When/Then-Form. Technische Hinweise
  bleiben von verbindlichen Kriterien getrennt; offene Fragen bleiben sichtbar.
- Ermittle alle vorhandenen numerischen Markdown-Dateinamen unter
  `requirements/`. Waehle die naechste freie Nummer oberhalb der groessten
  vorhandenen Nummer, beginnend mit 1. Speichere als `requirements/<nummer>.md`
  und verwende den Anforderungstitel als Dokumentueberschrift.
- Lege `requirements/` bei Bedarf an. Pruefe direkt vor dem Schreiben erneut,
  dass der Zielpfad frei ist; ueberschreibe keine bestehende Anforderung.
- Berichte Pfad, Story und offene Fragen. Beginne keine Implementierung und
  aendere weder Anwendungscode noch Testkonfiguration, Workflows oder Secrets.
  Erstelle keine Commits, Pushes, PRs oder GitHub-Issues als Teil des Interviews.
