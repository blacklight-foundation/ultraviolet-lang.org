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
public procedure main(
    move ctx: Context
) -> i32 {
    return 0
}
```

The `Context` parameter is the entry capability bundle for an executable. Passing it explicitly keeps effect-bearing authority visible in the procedure signature.

## Project file

```toml
[[assembly]]
name = "hello"
kind = "executable"
root = "src"
```

## Check and build

```bash
uv check
uv build
```

## Run

```bash
uv run
```

## CPU and GPU note

The first program stays minimal. Larger programs can use execution-domain capabilities so CPU and GPU work remain part of the same language model.

## Status note

The canonical first example will be updated when the public compiler and example tree are stabilized.
