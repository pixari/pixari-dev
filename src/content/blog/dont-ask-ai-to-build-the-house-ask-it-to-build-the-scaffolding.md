---
title: "Don't ask AI to build the house. Ask it to build the scaffolding."
pubDate: "2025-11-30"
tags: ["AI", "Engineering"]
excerpt: "The real value of AI in development isn't production code—it's support code: tooling, tests, and scaffolding that gets you to the hard part faster."
---

The noise level in our industry right now is deafening.

Open any feed and you are bombarded with the same existential binary: **Will AI replace us, or will we become ten times faster?** Are we obsolete, or are we supercharged?

It’s exhausting.

While everyone is arguing about whether an LLM can architect a scalable microservice (it can't, it lacks taste), I’m finding the real value is much closer to the ground. **It's in the dirt of the daily work**.

We are too focused on AI writing _production_ code. We are ignoring its profound ability to write _support_ code. The code that helps us understand what we are building.

### The friction of abstraction

Recently, I was working on a complex dynamic layout system for a frontend application. It was heavy on algorithms and calculations. The math worked on paper, but in frontend development, you cannot fully abstract yourself away from the browser.

You can have flawless specs and 100% unit test coverage, but eventually, those pixels have to hit the screen. There is a friction between the logic in your head and the reality of the rendering engine. I needed to _see_ the math working. I needed to test the performance in a real environment, not just a simulated one.

In the old days, meaning two years ago, I would have slogged through with `console.log` surgery, or perhaps spent two days reluctantly building a subpar internal test bench, resenting the time taken away from the "real" feature.

This time, **I treated AI not as a replacement junior developer, but as an eager assistant with infinite patience for tedious tasks**.

## Building the jig

In woodworking, you often build a "jig." It's a temporary tool, a piece of scrap wood clamped in a specific way, that guides your saw so you can make a perfect, repeatable cut on the expensive furniture wood. The jig isn't the product. It exists only to ensure the quality of the product.

**I asked the AI to build me a jig.**

I prompted it to generate a standalone visualization tool for my layout algorithms. It didn't need to be performant. It didn't need clean code. It just needed to take my inputs and render them visually in real-time so I could stress-test the browser performance.

It spat out a React app that did exactly that.

_A disposable tool, built in minutes, providing visual confirmation of complex logic._

Suddenly, I wasn't just relying on abstract tests. I had a tactile, visual feedback loop. I could drag sliders, change inputs, and watch my layout engine react instantly. I validated the PoC in five minutes with this tool that my unit tests might have missed for weeks.

### The Art of the "Dirty" Prompt

The hardest part of this workflow was convincing myself to lower the bar. As engineers, and especially as frontend architects, we are trained to obsess over things such as component isolation, prop drilling, and re-render optimization.

But for a jig, those are obstacles.

To get a useful tool in 5 minutes instead of 5 hours, you have to explicitly tell the AI to ignore the rules. I didn't ask for a scalable architecture; I asked for a sandbox.

My prompt looked something like this:

> _"Create a React component that visualizes this layout algorithm. I will paste the algorithm logic below. Give me a canvas on the left and a set of sliders on the right to control variables X, Y, and Z. Use inline styles for everything. Put it all in one file. No external dependencies besides React."_

By explicitly asking for "inline styles" and "one file," I signaled that I didn't care about the linter. I just wanted to see the math work. The result was a messy, monolithic component that I would never ship to production, but it allowed me to debug the feature instantly.

## The Economics of "Disposable Code"

We have a deep-seated instinct to hoard code. We treat every function we write as an asset that needs to be preserved, tested, and maintained.

But as I've said before: **Code is not an asset. Code is a liability.** Every line you keep is a line you have to debug in six months.

This is why we rarely built these "Jigs" in the past. **The ROI didn't make sense**. You couldn't justify spending four hours building a custom visualization tool just to solve a problem that would take six hours to brute-force. The cost of the "scaffolding" was too high relative to the value of the building.

AI has fundamentally broken this equation. It has collapsed the manufacturing cost of code to near zero.

If generating a visualization tool takes five minutes of prompting and zero minutes of maintenance (because you delete it immediately), the ROI becomes infinite. You get all the value of the insight, the visual confirmation, the performance metrics, the edge-case discovery, without paying the long-term tax of technical debt.

### Extract wisdom, delete syntax

The code for that visualization tool was terrible. It was full of hacks and shortcuts. And it was absolutely valuable.

Its value lies in the fact that it was disposable. I used it to build the feature, and then I threw it away.

This is the healthiest relationship we can have with AI right now. Stop asking it to build the cathedral. Ask it to build the scaffolding so you can climb up and do the work yourself, safely.
