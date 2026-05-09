---
title: First Program
description: First program notes for the Ultraviolet public alpha.
---

<aside class="docs-status">
  <strong>Example status: stabilizing.</strong>
  <span>The first public program will be kept small enough to verify the parser, typechecker, entrypoint handling, and executable output.</span>
</aside>

## Placeholder source

```text
public procedure main(move ctx: Context) -> i32 {
    return 0
}
```

The `Context` parameter is the entry capability bundle for an executable.

## Compile

```bash
# Public alpha compile command placeholder.
./build/uv build examples/first.uv
```

## Run

```bash
# Public alpha run command placeholder.
./build/first
```

## Status note

The canonical first example will be updated when the public compiler and example tree are stabilized.
