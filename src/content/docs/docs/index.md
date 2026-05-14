---
title: Documentation
description: Documentation overview for Ultraviolet.
---

Ultraviolet is a high-visibility, general-purpose programming language for humans and AI.

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
- [Specification](/docs/specification/) publishes the generated website edition of the language specification, including the complete chapter and section outline.

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
    <span>Coordinate `shared` access with key paths, modes, scopes, static proofs, and runtime synchronization.</span>
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

## How the surfaces compose

Ultraviolet's review model is built from a few connected facts. Permissions determine whether a value is read-only, exclusive, or `shared`. The key system defines synchronization and conflict behavior for `shared` access. Structured concurrency creates the parallel, dispatch, spawn, async, sync, and race contexts where those key rules still apply. Capability-bearing values gate external effects. Contracts state the preconditions, postconditions, invariants, and foreign obligations that generated and handwritten code must satisfy.

## Documentation map

- [AI-Written Code Review](/docs/ai-written-code-review/) covers the review model for AI-written source.
- [Specification](/docs/specification/) is the generated normative language reference.
- [Specification Reading Guide](/docs/reference/specification-reading-guide/) explains how to use the generated spec pages.
- [Modal Programming](/docs/modal-programming/) covers the primary programming style.
- [Core Language Surfaces](/docs/core-language/) covers contracts, permissions, keys, structured concurrency, CPU/GPU programming, and explicit effects.
- [Using the Toolchain](/docs/toolchain/) covers manifests, commands, diagnostics, tests, and build notes.
- [Reference](/docs/reference/) links to runtime surface, ABI notes, compiler architecture, and public documentation traceability.

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
