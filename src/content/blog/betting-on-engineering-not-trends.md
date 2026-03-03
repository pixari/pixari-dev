---
title: "Betting on Engineering, Not Trends"
pubDate: "2025-11-19"
tags: ["Engineering", "AI"]
excerpt: "The AI hype will fade but the tech won't. How to prepare your engineering practices and codebase for what comes next—without buying the noise."
---

Look, I get it. You’re tired of the noise. I am too.

Open X, Threads, or LinkedIn right now, and it’s a barrage of "AI is replacing engineers tomorrow" or "Here are the 10 AI tools you need to survive." It feels frantic. It feels like a bubble. And let’s be real: it probably is.

Most of the wrapper startups we see today will vanish. The hype cycle is going to crash, and a lot of the "visionaries" currently flooding your feed will move on to the next shiny thing.

But here is the pragmatic truth we need to accept: **the bubble will explode, but the tech is not going anywhere.**

When the dust settles, the big players (the OpenAIs, the Anthropics, the Googles) and the core models will still be here. They will be faster, smarter, and cheaper. At that point, the noise will die down, and trust will return to the market.

But if you wait until that moment of stability to adapt your engineering practices, you’ve already lost. Competitors who are refactoring their codebases _now_ will have an unassailable velocity advantage.

So, how do we prepare without falling for the hype?

## Engineering for Context: The "Junior" Heuristic

Preparing for an AI future isn't about forcing your team to use AI coding assistants if they hate them. It’s about structuring your codebase so that agents, whether they are copilots today or autonomous agents tomorrow, can understand, navigate, and modify it safely.

I look at it this way: **treat the AI like a very fast, very eager Junior Engineer who has zero context on the project history.**

To make that Junior Engineer successful, you need:

- **Context-Rich Documentation:** In the past, we wrote docs for humans, relying on "tribal knowledge" to fill the gaps. That doesn’t work anymore. Docs are now the "context window" for the AI. If it’s not written down, the AI hallucinates.

- **A Spec-Driven Approach:** We need to get better at writing requirements. If you can articulate exactly what a feature does in a spec, an AI can implement 80% of it. If the spec is vague, the code will be a mess.

- **High Test Coverage:** This is non-negotiable. You cannot trust AI-generated code without a robust suite of automated tests to verify it immediately. The AI _will_ lie to you; the test suite is the only thing that keeps it honest.

- **Standardized Interfaces:** Consistent API structures and strict typing (TypeScript, Rust, Go) reduce the wiggle room for error. They provide the "guardrails" the AI needs to stay on track.

## Structural Solidity: Optimizing for Locality

This is where I might lose the "Clean Code" purists, but we need to have a hard conversation about **DRY (Don't Repeat Yourself)** versus **Context**.

For years, we aggressively deduplicated code. We extracted every shared bit of logic into `utils`, `helpers`, and abstract base classes. We optimized for the smallest possible footprint.

**In an AI world, that approach is a liability.**

When an AI agent tries to fix a bug or implement a feature, it is limited by its context window. If to understand `Function A`, the AI has to read a file in `utils`, a type definition in `types`, and a base class in `core`, it will lose the thread. It gets "distracted" by the noise of the entire repo.

We need to shift our optimization target:

- **Colocation is King:** Keep the data structures, the logic, and the tests as close together as possible. If that means duplicating a small helper function so a module is self-contained, do it.

- **Isolation over Abstraction:** Ideally, you should be able to feed a single file to an LLM and have it possess 100% of the context needed to refactor it. If the file relies on "magic" global state or implicit framework injections, the AI will hallucinate.

- **Explicit Inputs/Outputs:** We need to write "boring" code. Clever one-liners and metaprogramming are hard for AIs to parse reliably. Explicit, verbose flow control is safer.

We aren't just writing for humans to read anymore; we are writing for machines to ingest.

## The Zero-Risk Strategy: Good Practices are Universal

Here is the best part.

Let’s play devil’s advocate. Let’s say the skeptics are right. Let's say the AI bubble bursts so hard that we go into an AI winter for ten years.

What are you left with if you follow this advice?

1. A codebase with incredible test coverage.

3. Documentation that actually explains how things work.

5. A highly modular, decoupled architecture.

7. Strict, clear specifications.

**That sounds like a dream codebase to me.**

You don't have to "bet the farm" on a new technology. All these improvements are valuable _without_ the AI. It reduces technical debt, makes onboarding new (human) hires easier, and makes the system more robust.

It is a win-win. Your team doesn't have to fear they are wasting time chasing a fad; they are simply enforcing high standards that happen to be the prerequisites for automation.

## The "Junior Engineer" Test

If you want to start applying this tomorrow, don't overhaul your whole system. Just apply this mental model to your next Pull Request:

1. **The "Explicit" Check:** Is this code "clever" (relying on implicit magic) or is it "obvious" (explicit and readable)? **In the age of AI, obvious wins every time.**

3. **The Isolation Check:** If a new hire (or an AI agent) looked at _only_ this file, would they have enough context to fix a bug, or would they need to dig through five other folders?

5. **The Spec Check:** Does the PR description explain the _intent_ clearly enough that you could generate a test case from the text alone?

## The Future: Stability Creates Speed

However, I’m betting the tech _will_ stick around. And when it matures, it will act as a massive **amplifier**.

If your codebase is a tangled mess of spaghetti code, AI is dangerous. It will help you generate more mess, faster than you ever thought possible. It will amplify your confusion and your technical debt until the system collapses under its own weight.

But if you have invested in these structural foundations? AI will amplify your velocity. It will amplify your team's creativity. It will remove the drudgery and leave the interesting engineering problems for your people to solve.

The bubble might burst, but the engineering principles that survive it will be stronger than ever.
