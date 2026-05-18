---
title: "1.4 Normative References"
description: "1.4 Normative References from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "conformance-and-notation"
specSection: "14-normative-references"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/conformance-and-notation/">1. Conformance and Notation</a>
  <span>Conformance and Notation</span>
</div>

## 1.4 Normative References

**NormativeRefs.**
This specification relies on the following external documents:

| Reference | Document                                                           | Usage                                                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [RFC2119] | RFC 2119: Key words for use in RFCs to Indicate Requirement Levels | Normative keyword interpretation (§1.3)                                                   |
| [UNICODE] | The Unicode Standard, Version 15.0.0                               | Source text encoding (§4.1), identifier normalization (§4.1.6), escape sequences (§4.2.6) |
| [IEEE754] | IEEE 754-2019: Standard for Floating-Point Arithmetic              | Float literal semantics (§16.1), float type representation (§24.2.1)                      |
| [LLVM21]  | LLVM Language Reference Manual, Version 21                         | Backend target and IR requirements (§24.1, §24.7)                                         |

**Reference Details.**
[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997. https://www.rfc-editor.org/rfc/rfc2119

[UNICODE] The Unicode Consortium. The Unicode Standard, Version 15.0.0, (Mountain View, CA: The Unicode Consortium, 2022). https://www.unicode.org/versions/Unicode15.0.0/

[IEEE754] IEEE. "IEEE Standard for Floating-Point Arithmetic," IEEE Std 754-2019, July 2019.

[LLVM21] LLVM Project. "LLVM Language Reference Manual," Version 21. https://llvm.org/docs/LangRef.html

**Conformance.**
A conforming implementation MUST implement the features of the referenced standards as specified in this document. Where this specification differs from a referenced standard, this specification takes precedence.
