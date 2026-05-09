---
title: Source-Native Tests
description: Ultraviolet source-native test attributes and uv test behavior.
---

Ultraviolet includes a source-native test surface built around `[[test]]` procedure attributes and the `uv test` command.

## Test attribute

```text
[[test(name: "example passes")]]
internal procedure examplePasses() -> bool {
    return true
}
```

The attribute parser and semantic model accept ordinary test attributes with optional named arguments.

## Test command

```bash
uv test
uv test Compiler.Tests.Project
```

The test command accepts zero or one positional target. The target model resolves that argument as a host path, assembly name, or module path.

## Review role

Tests are part of the generated-code audit loop. They provide source-level evidence for contracts, diagnostics, manifest rules, parser behavior, and compiler obligations.

## Source references

- `Compiler/Source/Parser/AttributeParser.uv`
- `Compiler/Semantics/Attributes/TestAttributes.uv`
- `Compiler/Driver/CLI/TestCommand.uv`
- `Compiler/Driver/Testing`
