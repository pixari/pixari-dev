---
title: "Writing Better RFCs and Design Docs"
pubDate: "2023-03-12"
tags: ["Engineering", "Leadership"]
excerpt: "RFCs and design docs that get read and get feedback: structure, audience, and how to make decisions instead of endless discussion."
---

RFCs (Request for Comments) and design docs are how engineering teams align on the “what” and “why” before writing code. Done well, they reduce rework and create a record of decisions. Done poorly, they sit unread or trigger endless debate. Here’s how to write **better RFCs and design docs** that get read, get feedback, and lead to decisions.

## Why Write Them at All?

- **Alignment:** Everyone works from the same understanding of the problem and the approach.
- **Async review:** People can respond in their own time, including across time zones.
- **Memory:** Later you have a record of why you chose X and what you rejected.
- **Onboarding:** New joiners (and future you) can understand the system without digging through code and chat.

The goal is a shared decision, not a perfect document. Write for clarity and decision-making, not for length.

## Structure That Works

**1. Context and problem.**  
What’s the situation? What’s broken or missing? One to three short paragraphs. If the reader doesn’t understand the problem, the rest won’t land.

**2. Goals and non-goals.**  
What must this achieve? What are we explicitly not doing? Non-goals prevent scope creep and endless “what about X?” tangents.

**3. Proposed approach.**  
What do we want to do? Describe the solution in enough detail that reviewers can evaluate it. Use diagrams, examples, or pseudocode where they help. Call out the main tradeoffs.

**4. Alternatives considered.**  
What else did we think about? Why did we reject it? This shows you’ve done the work and gives critics a place to engage (“you considered Y—here’s why I still prefer it”) instead of reopening everything.

**5. Open questions.**  
What do you still need input on? List specific questions so people know where to focus. “Do we need to support X from day one?” is better than “thoughts?”

**6. Success and rollout.**  
How will we know it worked? What’s the rollout plan? This ties the doc to outcomes and reduces “nice idea, but how do we ship it?”

Keep it as short as the problem allows. Long docs get skimmed or skipped.

## Write for Your Audience

- **Peers and reviewers:** They need enough technical detail to challenge assumptions and spot gaps. Include the “why” so they can suggest alternatives on the same criteria.
- **Stakeholders (product, other teams):** They care about impact, scope, and timeline. A short summary at the top (problem, approach, ask) helps. Deep technical sections can be optional reading.
- **Future readers:** Assume someone will read this in a year. Spell out context and decision; avoid “we all know” shortcuts.

If one doc can’t serve everyone, add a one-page summary and link to the full RFC for those who need depth.

## Driving to a Decision

**Set a deadline.**  
“Feedback by Friday; we decide Monday.” Without a cutoff, discussion drifts.

**Make the decision explicit.**  
After the review period, publish the outcome: “We’re going with Option A because X. We’re not doing B for now because Y.” Put that in the doc or in a follow-up. Don’t leave “we discussed it” as the only record.

**Capture dissent.**  
If someone disagrees with the final call, record it: “We chose A. Jane preferred B because of Z; we accepted the tradeoff because…” That preserves context and shows the decision was considered.

**Close the loop.**  
When the work is done, add a short “What happened” section: what you built, what you learned, what you’d do differently. That turns the RFC into a living record.

## What to Avoid

- **Writing a novel.** If it’s more than a few pages, consider splitting or moving detail to appendices.
- **Vague open questions.** “Thoughts?” doesn’t guide reviewers. “Do we need to support X in v1?” does.
- **Skipping alternatives.** Without “what we considered and why we didn’t,” you’ll rehash the same debate in comments.
- **No owner or deadline.** Someone should own the doc and the decision; otherwise it floats forever.

Better RFCs and design docs are clear, scoped, and built for decision-making. Use a simple structure, write for your audience, and close with an explicit decision and follow-up—then they’ll actually get read and used.
