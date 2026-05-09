---
title: Contracts
description: Preconditions, postconditions, invariants, and foreign contracts in Ultraviolet.
---

Contracts make source promises explicit. They are one of the main surfaces reviewers inspect when judging generated code.

## Contract clauses

Procedure contracts use `|:` followed by a precondition, a postcondition, or both.

```text
public procedure divide(numerator: i32, denominator: i32) -> i32
|: denominator != 0
{
    return numerator / denominator
}
```

```text
public procedure clamp(value: i32, min: i32, max: i32) -> i32
|: min <= max => @result >= min && @result <= max
{
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}
```

The specification defines contract bodies as pure boolean predicate expressions.

## What contracts give reviewers

Contracts answer three review questions:

- What must the caller provide?
- What must the callee preserve or return?
- Which generated assumptions are checked by the language rather than hidden in comments?

## Related surfaces

Contracts connect directly to modal programming. A transition can promise a target state, and invariants can describe facts that hold across modal states.

Contracts also appear at foreign boundaries, where Ultraviolet has to preserve layout, ABI, unwind, and capability rules across external calls.

## Specification

- [15. Procedures and Contracts](/docs/specification/procedures-and-contracts/)
- [22.5 Derive Targets and Contracts](/docs/specification/compile-time-execution-and-metaprogramming/)
- [23.6 Foreign Contracts](/docs/specification/foreign-function-interface/)
