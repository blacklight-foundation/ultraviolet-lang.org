# Ultraviolet Language Website

This repository contains the public website for Ultraviolet.

Ultraviolet is a systems programming language for LLM-generated code humans can still review.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Newsletter Signup

The site uses a Cloudflare Pages Function at `/api/subscribe` to add
subscribers to Buttondown. Configure this secret in Cloudflare Pages:

```txt
BUTTONDOWN_API_KEY
```

If you use a Buttondown platform key that manages multiple newsletters, also
set `BUTTONDOWN_CONTEXT` to the newsletter username.

For local Pages Function testing, create `.dev.vars` from `.dev.vars.example`
and run:

```bash
npm run pages:dev
```

## Deployment

The site is intended to deploy on Cloudflare Pages.

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```
