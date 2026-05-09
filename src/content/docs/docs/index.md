---
title: Documentation
description: Documentation overview for Ultraviolet.
---

Ultraviolet is a general-purpose programming language for AI-written code that humans can review.

The language is designed to make generated code performant, safe, and auditable, and to make the important mistakes visible when generated code misses that bar. Source form is part of the design: contracts, modal states, permissions, keys, concurrency, and CPU/GPU execution choices are meant to stay local enough for review.

<aside class="docs-status">
  <strong>Public alpha documentation.</strong>
  <span>The specification is authoritative. The compiler, runtime, and <code>uv</code> tool are evolving toward that specification.</span>
</aside>

## Start here

- [Why Ultraviolet](/docs/why-ultraviolet/) explains the AI-agent auditability hook.
- [Quickstart](/docs/quickstart/) introduces the repository, manifest, first source file, and current command surface.
- [First program](/docs/first-program/) walks through the executable entrypoint and `Context`.
- [Build the compiler](/docs/build-the-compiler/) summarizes the alpha bootstrap path.
- [Specification](/docs/specification/) publishes the full generated website edition of the language specification.

## Main surfaces

<div class="feature-grid">
  <a class="feature-card" href="/docs/modal-programming/">
    <strong>Modal programming</strong>
    <span>Organize code around states, transitions, protocols, resources, and lifecycle-specific operations.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/contracts/">
    <strong>Contracts</strong>
    <span>Write source-level preconditions, postconditions, invariants, and foreign contracts.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/permissions/">
    <strong>Permissions</strong>
    <span>Separate access, mutation, aliasing, and responsibility with `const`, `shared`, `unique`, and `move`.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/key-system/">
    <strong>Key system</strong>
    <span>Coordinate shared access with language-level keys and conflict checks.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/structured-concurrency/">
    <strong>Structured concurrency</strong>
    <span>Keep parallel, async, dispatch, synchronization, and race behavior visible in source.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/cpu-gpu-programming/">
    <strong>CPU/GPU programming</strong>
    <span>Write CPU and GPU work in one programming language through execution domains.</span>
  </a>
</div>

## Documentation map

- [AI-Written Code Review](/docs/ai-written-code-review/) covers the review model for AI-written source.
- [Modal Programming](/docs/modal-programming/) covers the primary programming style.
- [Core Language Surfaces](/docs/core-language/) covers contracts, permissions, keys, structured concurrency, CPU/GPU programming, and explicit effects.
- [Using the Toolchain](/docs/toolchain/) covers manifests, commands, diagnostics, tests, and build notes.
- [Reference](/docs/reference/) links to the generated specification, grammar, diagnostic index, runtime surface, ABI notes, and compiler architecture.

<section class="newsletter-card docs-newsletter newsletter-card-compact" aria-labelledby="docs-updates-heading">
  <div class="newsletter-copy">
    <h2 id="docs-updates-heading">Get Ultraviolet updates</h2>
    <p>Public alpha notes, compiler progress, CPU/GPU language work, documentation releases, and AI-generated-source research updates.</p>
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
