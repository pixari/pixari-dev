---
title: "Not All Technical Debt Needs to Be Repaid"
pubDate: "2025-07-11"
tags: ["Engineering"]
---

**Unpopular opinion:** Not all technical debt needs to be repaid.

If you're an engineer, you've probably heard the rallying cry to "eliminate all tech debt!" While the sentiment is admirable, treating every piece of technical debt as a five-alarm fire is a recipe for **paralysis**. It can lead to endless refactoring, slowed feature development, and a team constantly feeling behind. The key isn't to eliminate it all, but to **manage it strategically**.

My personal rule of thumb for navigating technical debt is the "**interest rate**" test. Think of technical debt like financial debt; some debts have a much higher "interest rate" than others, meaning they're costing you more over time.

- **High-Interest Debt:** Is this debt located in a **high-traffic, actively developed part of the codebase**? Is it consistently slowing down new development, making bug fixes more difficult, or introducing significant risk? If so, the interest rate on this debt is exceptionally high. **Pay it down now.** Prioritizing these areas will yield the greatest returns in terms of team velocity and system stability.

- **Low-Interest Debt:** Conversely, is the debt residing in a **stable, rarely-touched module**? Does it reside in a legacy system that's still functional but not actively being enhanced? The interest rate here is likely very low. In these cases, you should **acknowledge it, document it, and then move on to more impactful work.** Spending significant time and resources refactoring perfectly functional, low-impact code is often a misallocation of resources.

**Pragmatic engineering** is about making smart trade-offs, not achieving impossible perfection. It's about understanding that every engineering decision involves balancing speed, quality, and scope. By applying a strategic lens to technical debt, you empower your team to focus on what truly matters, delivering value while keeping your systems maintainable and your team productive.

The flip side of this is equally important: not everything you build needs to be "future-proof." If pragmatic debt management is about choosing what *not* to fix, [build for today](/future-proofing-is-cowardice-build-for-today-or-dont-build-at-all/) is about choosing what *not* to build.

How do you and your team approach technical debt? Do you have a similar prioritization strategy?
