---
title: "Building Global Crisis Monitor: A Real-Time Geopolitical Intelligence Dashboard"
pubDate: "2026-03-06"
tags: ["Engineering", "Personal", "AI"]
excerpt: "I built a system that ingests 80+ news feeds, clusters them with embeddings, synthesises events with AI, and surfaces a live map and briefings-plus auto-publishing to X and Threads."
---

**Global Crisis Monitor** is a personal, artistic project. I built it in a period when wars that once felt distant became part of everyday conversation-appearing in feeds and notifications alongside everything else. There is something disorienting about that: a bombing in a city you can name, a ceasefire that collapsed overnight, a famine declared-and then, scrolling past it, an advertisement. The architecture of attention flattens everything into the same urgency and the same forgettability.

I wanted to refuse that flattening. Not a feed aggregator; a single surface where the signals are collected, held together, and given weight. So I built an ingester that turns 80+ RSS feeds into structured geopolitical events, and a dashboard that shows them on a map, in a feed, and in AI-generated briefings every twenty minutes. **It is not an answer. It is not even a good map.** It is the act of not looking away-run as software, updated continuously, rendered in the dark.

Here’s how it works and why I built it this way.

## The Problem: Too Many Feeds, Too Much Noise

Quality outlets-Reuters, BBC, Al Jazeera, The Guardian, Chatham House, UN agencies, investigative orgs like ICIJ and ProPublica-publish constantly. Reading them one by one is overwhelming. The same event shows up in five different articles with five different headlines. I wanted **one event, one place**, with a map and a sense of severity.

So the goal became: **ingest many feeds → group articles about the same real-world event → synthesise one structured event per cluster → geolocate it, score it, and serve it in a dashboard and in periodic briefings.**

## Two Pieces: Ingester and Dashboard

The system splits into two deployable parts that share a Postgres database.

**1. Global Threat Ingester** - A [Hono](https://hono.dev) microservice running on [Vercel](https://vercel.com) serverless (Bun). It exposes cron-triggered endpoints:

- **`/api/ingest`** - Fetches 80+ RSS feeds in parallel, embeds every article with `text-embedding-3-small`, clusters by cosine similarity (threshold 0.82), then sends each cluster to the LLM (e.g. GPT-4o-mini) to produce a single event: title, summary, location, impact score 0–100, categories, people, organisations. New events are checked against existing ones via vector similarity (0.88); above that we update the existing event (merge sources, refresh `lastSeenAt`) instead of inserting duplicates. Locations are geocoded (Nominatim, cached in a `GeoCache` table) and the event is written to Postgres with its own embedding for future deduplication.

- **`/api/enrich`** - Runs after ingest. It collects every distinct entity from `locationName`, `people`, and `entities` across events, looks up missing ones in the Wikipedia REST API, and stores short extracts and thumbnails in `WikiEntity` so the dashboard can show context without hammering Wikipedia on every page load.

- **`/api/report`** - Used for observability and diagnostics (e.g. per-feed status, cluster counts, errors). Logs and metrics go to [Axiom](https://axiom.co) so I can trace ingest runs and spot failures without digging through Vercel logs.

Authentication for these endpoints is Bearer token (`CRON_SECRET`); if it’s not set, the ingest/enrich/report routes return 500 so they can’t be called by mistake in production.

**2. Global Threat Dashboard** - A [Next.js](https://nextjs.org) app (App Router), also hosted on [Vercel](https://vercel.com), that reads from the same Postgres via Prisma. It only considers events in a **48-hour rolling window** (e.g. “live” last 24h, “archive” 24–48h). The home page is a bento-style layout: map (with markers by impact and “flash” events in the last six hours), event feed, and intelligence briefs. There are pages for `/news` (searchable archive), `/news/[slug]` (event detail with JSON-LD NewsArticle), `/briefings` and `/briefings/[slug]` (AI-generated crisis briefings), and `/sources` (list of RSS sources and credibility weights).

Each source in `feeds.json` has a **credibility weight** (0–1). The LLM’s confidence score is scaled by the average weight of the articles in the cluster, so high-quality outlets (e.g. UN, Reuters, Chatham House) lift confidence; random blogs don’t.

## Why Embeddings Before the LLM

My first approach was to batch articles (e.g. 25 at a time) and send each batch to the LLM. That created duplicate events: the same incident in different batches became two events, and I was left with a fragile title-Jaccard deduplication step.

The current pipeline **clusters by embedding similarity first**. Articles about the same event sit close in vector space even when the wording differs (“Kyiv power grid struck” vs “Ukraine capital hit by overnight attack”). So we embed everything, run a greedy cosine cluster (0.82), and only then send each cluster to the LLM. One cluster → one synthesis call → one event. Deduplication across runs is then a clean vector search on stored event embeddings (0.88 threshold): match → update; no match → insert.

## Briefings and Social

Every 20 minutes a job generates a new **Briefing**: narrative summary of the current window, key events, and entity context. That briefing is stored, rendered at `/briefings/[slug]`, and **automatically published to [X (Twitter)](https://x.com/glob_crisis_mtr) and Threads** so the project can have a public presence without manual posting. You can follow the feed at [@glob_crisis_mtr](https://x.com/glob_crisis_mtr).

## What I’d Do Differently (and What I’m Happy With)

- **Scale of sources:** 80+ feeds is a lot. Timeouts (e.g. 10s per feed) and parallel fetch keep runs bounded; failed feeds are logged and don’t block the rest. I’d consider a priority tier (e.g. wire services first) if I needed to squeeze run time further.

- **Enrichment:** Wikipedia lookups are rate-limited (e.g. 150ms between requests) and results are cached forever in `WikiEntity`. That keeps enrichment idempotent and respectful of the API.

- **Transparency:** The dashboard and the `llms.txt`-style doc state clearly that events are AI-synthesised, impact scores are estimates, and the site isn’t affiliated with any government or intelligence body. I kept that visible on purpose.

- **Stack:** The ingester and dashboard both run on **Vercel** (serverless + cron), code lives on **GitHub**, and observability (ingest runs, errors, diagnostics) goes to **Axiom**. Hono + Next.js + Prisma with one shared DB gave a clear boundary between “cron jobs that write” and “app that reads”-and I can deploy from a single push.

If you’re building something that needs to turn many documents into one structured view-whether news, support tickets, or internal reports-the pattern is the same: **embed → cluster → synthesise once per cluster → deduplicate across time with vectors.** Global Crisis Monitor is that pattern applied to geopolitical news, with a map and a briefing engine on top.

The impulse behind it is something closer to **cartography as witness**. Maps have always been partial-shaped by who drew them, what they chose to include, what they left out. This one is no different. But the act of drawing, of aggregating, of refusing to look away, still feels like it means something.
