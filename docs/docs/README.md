# RGC4 Documentation

> Operational documentation for the multi-store Shopify + Next.js + Vercel platform.

## What's here

| Document | Purpose |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | How the system works. Roles of Shopify, Git, Vercel. Data flow. Start here. |
| [`runbooks/new-store.md`](./runbooks/new-store.md) | Step-by-step for standing up a new store end-to-end |
| [`runbooks/daily-operations.md`](./runbooks/daily-operations.md) | Quick recipes for common tasks (update policies, videos, metafields, etc.) |

## How to use these docs

- **New to the system?** Read `ARCHITECTURE.md` first. 20 minutes.
- **Need to launch a new store?** `runbooks/new-store.md` is your checklist.
- **Need to do a common task?** `runbooks/daily-operations.md` — find the section, follow the commands.
- **Starting a new Claude chat to diagnose something?** Paste `ARCHITECTURE.md` at the start. Saves 20 questions of ramp-up.

## Where these docs live

In git, at `docs/` in the project root (`C:\dev\s1\docs`). Treat them like code:
- Changes go through git
- A stale doc is a bug — fix it when you notice

## Document maintenance

When you make a change to production that invalidates a runbook step:

1. Make the change
2. Update the doc *in the same commit* — not "later" (it never happens)
3. If you invent a new runbook (e.g., "how to rotate a Stripe key"), add it to this index

## Conventions

- All paths in runbooks assume Windows PowerShell (since that's your dev environment).
- `sN` is a placeholder for a store ID. Replace with the actual one (e.g., `s4`).
- Commands are in fenced code blocks. Copy them verbatim unless the doc says otherwise.
- "Effort" estimates at the top of runbook sections assume you know where files are. First time through, expect 2-3x longer.
