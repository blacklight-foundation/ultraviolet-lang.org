---
title: Documentation
description: Start page for the Ultraviolet documentation.
---

<p class="ddp-kicker">Docs / Start here</p>

Ultraviolet's documentation has one authoritative reference surface: the [Handbook](/docs/handbook/). It is the combined language guide, implementation reference, diagnostics guide, grammar reference, ABI reference, and operational-semantics map.

The pages outside the handbook are intentionally short. Use them to install or build the toolchain, create a first project, and then move into the relevant handbook chapter for exact rules.

## Reading path

<ul class="ddp-doc-list">
  <li><a href="/docs/quickstart/">Quickstart</a> - install the CLI, create the smallest project shape, and run the public command surface.</li>
  <li><a href="/docs/first-program/">First program</a> - inspect a minimal executable manifest and entrypoint.</li>
  <li><a href="/docs/build-the-compiler/">Build the compiler</a> - build the language repository from source.</li>
  <li><a href="/docs/handbook/">Handbook</a> - use the chapter map as the full reference guide.</li>
</ul>

## Handbook Map

The generated handbook follows the language's learning and reference order, from design philosophy through grammar and engineering practice.

<div class="feature-grid">
  <a class="feature-card" href="/docs/handbook/02-conformance-behavior/">
    <strong>Conformance and notation</strong>
    <span>Behavior categories, document conventions, phase ordering, and target assumptions.</span>
  </a>
  <a class="feature-card" href="/docs/handbook/03-project-model/">
    <strong>Projects and compilation</strong>
    <span>Manifests, source roots, assembly loading, output artifacts, and tool resolution.</span>
  </a>
  <a class="feature-card" href="/docs/handbook/09-modal-types/">
    <strong>Modal and special types</strong>
    <span>Modal declarations, state fields, transitions, string and bytes states, pointers, functions, and closures.</span>
  </a>
  <a class="feature-card" href="/docs/handbook/15-procedures-methods/">
    <strong>Procedures and contracts</strong>
    <span>Declarations, receivers, overloads, clauses, verification logic, and entry diagnostics.</span>
  </a>
  <a class="feature-card" href="/docs/handbook/23-key-system/">
    <strong>Key system</strong>
    <span>Key paths, acquisition, conflict detection, nested release, speculative execution, and memory ordering.</span>
  </a>
  <a class="feature-card" href="/docs/handbook/29-grammar-reference/">
    <strong>Grammar reference</strong>
    <span>Complete grammar sections for lexical, type, expression, pattern, statement, declaration, async, metaprogramming, and FFI forms.</span>
  </a>
</div>

## Status

<aside class="ddp-status-panel">
  <p class="k">Public alpha</p>
  <p class="t">The handbook is ahead of the public toolchain.</p>
  <p class="d">When behavior differs, treat the handbook as the intended language contract and the implementation as the moving conformance target.</p>
</aside>

<section class="newsletter-card docs-newsletter newsletter-card-compact" aria-labelledby="docs-updates-heading">
  <div class="newsletter-copy">
    <h2 id="docs-updates-heading">Get Ultraviolet updates</h2>
    <p>Public alpha notes, compiler progress, documentation releases, and AI-generated-source research updates.</p>
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
