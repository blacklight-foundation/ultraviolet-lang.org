---
title: Documentation
description: Documentation overview for Ultraviolet.
---

Ultraviolet is currently in alpha. The specification is the source of truth, and the reference implementation is evolving toward it.

The current documentation is focused on the public alpha path: how to follow the compiler, build the project as it becomes public, run first examples, and read the language specification.

## Start here

- [Quickstart](/docs/quickstart/) tracks the install/build/run path.
- [Build the compiler](/docs/build-the-compiler/) collects build notes and troubleshooting.
- [First program](/docs/first-program/) introduces the first example shape.
- [Specification](/docs/specification/) links to the formal language specification.

## Current status

<aside class="docs-status">
  <strong>Currently in alpha.</strong>
  <span>A bootstrap compiler exists, and the clean public build/check path is being stabilized. Documentation will stabilize alongside the public compiler, examples, diagnostics, and CI.</span>
</aside>

<section class="newsletter-card docs-newsletter newsletter-card-compact" aria-labelledby="docs-updates-heading">
  <div class="newsletter-copy">
    <h2 id="docs-updates-heading">Get Ultraviolet updates</h2>
    <p>Public alpha notes, compiler progress, funding milestones, and LLM-generated-source research updates.</p>
  </div>
  <form class="newsletter-form" data-newsletter-form action="/api/subscribe" method="post" novalidate>
    <input type="hidden" name="source" value="docs" />
    <label for="docs-newsletter-email">Email address</label>
    <div class="newsletter-row">
      <input id="docs-newsletter-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />
      <input class="newsletter-honeypot" name="company" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <button type="submit">Subscribe</button>
    </div>
    <p class="newsletter-note">You will receive a confirmation email. Unsubscribe anytime.</p>
    <p class="newsletter-status" data-newsletter-status aria-live="polite" aria-atomic="true"></p>
  </form>
</section>
