---
title: Documentation
description: Documentation overview for Ultraviolet.
---

<p class="ddp-kicker">Docs / Start here</p>

Ultraviolet is currently in alpha. The specification is the source of truth, and the reference implementation is evolving toward it.

The current documentation is focused on the public alpha path: how to follow the compiler, build the project as it becomes public, run first examples, and read the language specification.

## Start here

<ul class="ddp-doc-list">
  <li><a href="/docs/why-ultraviolet/">Why Ultraviolet</a> — explains the AI-agent auditability hook.</li>
  <li><a href="/docs/quickstart/">Quickstart</a> — tracks the install, build, and run path.</li>
  <li><a href="/docs/build-the-compiler/">Build the compiler</a> — collects build notes and troubleshooting.</li>
  <li><a href="/docs/first-program/">First program</a> — introduces the first example shape.</li>
  <li><a href="/docs/specification/">Specification</a> — links to the formal language specification.</li>
</ul>

## Current status

<aside class="ddp-status-panel">
  <p class="k">Status</p>
  <p class="t">Currently in alpha.</p>
  <p class="d">A bootstrap compiler exists, and the clean public build/check path is being stabilized. Documentation will stabilize alongside the public compiler, examples, diagnostics, and CI.</p>
</aside>

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
    <span>Separate access, mutation, aliasing, and responsibility with <code>const</code>, <code>shared</code>, <code>unique</code>, and <code>move</code>.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/key-system/">
    <strong>Key system</strong>
    <span>Coordinate <code>shared</code> access with key paths, modes, scopes, static proofs, and runtime synchronization.</span>
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
