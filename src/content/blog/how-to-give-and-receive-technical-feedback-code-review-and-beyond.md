---
title: "How to Give and Receive Technical Feedback (Code Review and Beyond)"
pubDate: "2024-04-03"
tags: ["Engineering", "Leadership"]
excerpt: "Technical feedback in code reviews and design discussions builds quality and trust when done well. A practical guide to giving and receiving it."
---

Technical feedback—in code reviews, design docs, and architecture discussions—is how engineering teams improve quality and align on standards. Done poorly, it feels like criticism or nitpicking; done well, it raises the bar and builds trust. Here’s how to **give and receive technical feedback** effectively, in code review and beyond.

## Why Technical Feedback Matters

- **Quality:** Catches bugs, improves design, and keeps the codebase consistent.
- **Learning:** Junior and senior engineers alike learn from clear, constructive feedback.
- **Alignment:** Shared norms and patterns emerge when feedback is consistent and reasoned.

The goal is a culture where feedback is expected, specific, and focused on the work—not the person.

## How to Give Technical Feedback

### Be Specific and Actionable

Avoid: “This could be better.”  
Better: “This function is doing parsing and validation; splitting it would make both easier to test and reuse.”

Tie feedback to **concrete outcomes**: testability, readability, performance, or maintainability. That makes it easier to accept and act on.

### Separate Style from Substance

**Substance:** correctness, design, security, performance. These are worth insisting on (with explanation).  
**Style:** formatting, naming preferences. Prefer automation (linters, formatters) and team-wide style guides so code review isn’t a battleground for taste.

If you do comment on style, frame it as “our standard” or “consistency with the rest of the codebase,” not “I don’t like it.”

### Ask Questions Before Demands

“What was the reason for handling errors here this way?” opens a conversation. “You must use X” can feel like a decree. Questions invite context and often surface better solutions together.

### Praise What Works

Call out clear code, good tests, and smart simplifications. Positive feedback makes critical feedback easier to hear and shows what “good” looks like.

### Choose the Right Channel

- **Code review:** Comments on the change. Keep it concise; use threads for longer discussion.
- **Design / architecture:** Often better in a call or a dedicated doc so you can iterate without blocking the PR.
- **Patterns and norms:** Document in ADRs or team guides so feedback can reference “our decision” instead of personal preference.

## How to Receive Technical Feedback

### Assume Good Intent

Assume the reviewer wants to improve the work and the codebase. If something sounds harsh, re-read it as “here’s a risk” or “here’s an alternative” before responding defensively.

### Clarify Before Defending

If feedback is unclear, ask: “Can you give an example of how you’d structure this?” or “What problem do you see with the current approach?” Understanding the concern often makes the fix obvious—or gives you a chance to explain and align.

### Distinguish Preference from Requirement

Not every comment is a blocker. If you disagree on a preference (e.g. naming, structure), you can say “I’ll change it for consistency” or “I’d like to keep it because X; open to your call.” For requirements (correctness, security, maintainability), take it seriously and fix or discuss with the team.

### Thank and Act

Acknowledge feedback and either make the change or explain why you didn’t. That closes the loop and signals that you take review seriously. Follow up on questions so reviewers don’t have to chase.

## Code Review and Beyond

Technical feedback isn’t limited to PRs. Use the same principles when:

- **Reviewing design docs or RFCs:** Be specific, ask questions, separate style from substance.
- **Discussing architecture:** Focus on tradeoffs and outcomes; avoid “my way vs your way” and aim for “what best serves the system and the team.”
- **Mentoring:** Frame feedback as “here’s what I’d consider” and “here’s why,” so the other person can learn the reasoning, not just the rule.

Good technical feedback is clear, constructive, and tied to outcomes. When giving it, be specific and kind; when receiving it, assume intent and engage. Over time, that builds a culture where feedback improves both the code and the team.
