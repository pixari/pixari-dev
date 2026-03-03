---
title: "Technical Debt: When to Pay It Down vs When to Live With It"
pubDate: "2023-08-22"
tags: ["Engineering", "Leadership"]
excerpt: "Not all technical debt should be repaid. A practical framework for when to refactor, when to document and contain, and when to leave it alone."
---

Technical debt is one of those phrases that gets thrown around whenever code is messy, tests are missing, or a system is hard to change. The default response is often “we need to pay it down.” But **not all technical debt needs to be repaid**—and treating it that way can burn time and slow delivery without real benefit.

Here’s a practical way to decide: when to pay down technical debt, when to contain it, and when to leave it alone.

## What Counts as Technical Debt?

Technical debt is the implied cost of shortcuts: we ship faster today in exchange for more effort or risk later. It shows up as:

- **Legacy code** that’s hard to read or change
- **Missing or flaky tests** that make refactors risky
- **Outdated dependencies** or deprecated APIs
- **Inconsistent patterns** across the codebase
- **Documentation gaps** that force people to reverse-engineer behavior

Some of this is intentional and reasonable; some is accidental. What matters is how you **classify and act** on it.

## A Simple Framework: Impact vs Cost

Before scheduling a “debt sprint,” ask two questions:

**1. What is the impact of leaving this debt in place?**  
Does it block features, cause outages, slow onboarding, or increase bug rate? Or does it mainly annoy engineers who have to work in that area?

**2. What is the cost of paying it down?**  
How much time and risk? Will the refactor touch many call sites? Do we have tests to protect behavior? Is the area stable or changing every sprint?

- **High impact, reasonable cost** → Plan to pay it down. This is the debt that hurts delivery or stability; fixing it usually pays off.
- **High impact, high cost** → Contain first. Add tests, document boundaries, isolate the area so it doesn’t spread. Then chip away or replace in stages.
- **Low impact, low cost** → Fix when you’re already in the area. No big initiative needed.
- **Low impact, high cost** → **Leave it.** Document it, add a comment or ADR so the next person knows why it’s there, and move on. Spending months “cleaning” code that rarely changes is a poor use of engineering time.

## When to Pay Down Technical Debt

Prioritize paying down debt when:

- **It blocks roadmap work** or makes every change in that area slow and risky.
- **It causes production issues** or makes incidents hard to diagnose and fix.
- **It slows hiring or onboarding** because the system is incomprehensible without tribal knowledge.
- **The cost of change is about to go up** (e.g. a dependency is end-of-life, or the team is about to grow and touch this code a lot).

In those cases, allocate time explicitly. Call it “stability,” “foundation,” or “debt paydown”—but get it on the plan and protect it from being dropped when deadlines loom.

## When to Live With It (and Document It)

Some debt is in low-traffic, stable areas. Nobody is extending that code; the main risk is someone refactoring it “while they’re there” and breaking something.

For that kind of debt:

- **Document it.** A short ADR or comment: “This is legacy; we’re not refactoring it unless we have a product reason to touch it.”
- **Contain it.** Avoid spreading the same patterns into new code. Use clear boundaries (APIs, modules) so the mess doesn’t leak.
- **Don’t promise to fix it “someday.”** “Someday” rarely comes and creates guilt. Be explicit: “We’re not fixing this now; here’s why.”

That’s not laziness—it’s prioritization. Engineering time is finite; spending it on low-impact cleanup means not spending it on features or high-impact debt.

## How to Explain This to Product and Stakeholders

Non-engineers often hear “technical debt” and think “engineers want to rewrite everything.” Frame it in outcomes:

- “This debt is slowing feature X and causing incidents; paying it down will reduce risk and speed up the next quarter.”
- “This other debt is in code we rarely touch; we’re documenting it and not touching it unless we have a product reason.”

Tie paydown to **delivery and stability**, not to “clean code” in the abstract. That makes the tradeoff clear and builds trust when you do ask for time to fix the stuff that actually matters.

Technical debt is a tradeoff, not a sin. Use impact and cost to decide when to pay it down, when to contain it, and when to leave it alone—and you’ll ship more and stress less.
