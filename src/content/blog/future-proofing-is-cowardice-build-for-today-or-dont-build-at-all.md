---
title: "Build for Today or Don't Build at All"
pubDate: "2025-11-27"
tags: ["Engineering"]
excerpt: "Future-proof architecture often hides fear of shipping. Why building for today beats hedging with abstraction—and how to ship without the vanity."
---

Show me a "future-proof" architecture, and I'll show you a team that's too scared to ship.

We've normalized a culture of architectural vanity. We praise the engineer who spends weeks decoupling business logic, implementing hexagonal architecture, and spinning up a Kafka cluster for a feature that _hasn't earned its first user yet_.

We call this "robustness." We call it "scalability." We call it "best practice."

Let's call it what it actually is: **Cowardice.**

## The "What If" Safety Blanket

Engineers love abstraction because it feels safe.

We build generic repositories "in case we switch databases." We design plugin architectures "in case the business pivots." We break applications into microservices "in case we need to scale independently."

This isn't strategy. It's **hedging**.

You are terrified of making a wrong decision, so you build a system that avoids making _any_ concrete decision. You create a maze of interfaces and adapters, a technical "Route A / Route B" slide deck, so that you can never be blamed for picking the wrong path.

But this optionality isn't free. It's a tax. Every layer of abstraction you add is a tax on velocity. Every "future-proof" mechanism you build is technical debt you are paying interest on _before you_'_ve even taken out the loan_.

## Cosplaying as Big Tech

Designing for a million users when you have ten isn't engineering; it's **LARPing**.

It's "Resume-Driven Development." You want to play with the big toys (Kubernetes, GraphQL federation, Event Sourcing) because they look good on a CV, not because they solve the business problem in front of you.

This is the architectural equivalent of a consultant flooding the room with "exploratory routes." It feels productive, but it's actually paralysis. You are spending 80% of your energy solving problems you _hope_ to have in two years, rather than the problems you _actually_ have today.

## The Courage to Commit

Real engineering leadership requires **strategic judgment**. It means looking at the terrifying ambiguity of a new product and saying:

> _"We are building this as a monolith. We are hard-coupling the database. We are not building an API gateway yet. We are doing this because speed is the only feature that matters right now."_

Does this carry risk? **Yes.** If you succeed and hit 10 million users, will you have to rewrite it? **Yes.**

**Good.**

Rewriting code because you succeeded is a trophy, not a failure. It means you survived long enough to have scaling problems. If you build the "perfect" architecture for a product that fails to launch because you spent six months configuring the service mesh, your future-proofing was worthless. You future-proofed a corpse.

## Write Code to be Deleted, Not Extended

The biggest lie in software engineering is that we are building cathedrals. We aren't. We are building tents.

When you "future-proof" by creating complex interfaces and abstractions, you aren't making the code higher quality. **You are cementing it.** You are weaving your assumptions so deeply into the codebase that removing them later becomes impossible.

The "Senior" engineer tries to write code that can handle every future requirement without changing (the Open/Closed Principle dogma). The **Strategic** engineer writes code that is so simple and isolated that it can be completely deleted and replaced in an afternoon.

**Coupling is not the enemy. Complexity is.**

I would rather have a monolith with hard-coded logic that I can understand and delete in 10 minutes than a "decoupled" microservice mesh that requires three cross-functional teams to refactor.

If you can't point to a feature and say, _"I could burn this down and rewrite it in two days"_ you haven't future-proofed anything. You've just built a legacy trap.

## Stop Hedging. Start Building.

The "Senior" engineer optimizes for safety. The **Lead** optimizes for value.

- **Stop** abstracting third-party libraries "just in case" they change. If they change, `Find & Replace` exists.

- **Stop** micro-servicing by default. Distributed systems are a complexity nightmare; earn the right to use them by hitting a wall with your monolith first.

- **Stop** selling options to the business.

Pick a direction. Hard-code the decision. Own the consequences. If you aren't willing to rewrite your code later, you shouldn't be writing it now.

And when you do accumulate debt — because you will — [not all of it needs to be repaid](/not-all-technical-debt-needs-to-be-repaid/). Some debt is a scar worth keeping.
