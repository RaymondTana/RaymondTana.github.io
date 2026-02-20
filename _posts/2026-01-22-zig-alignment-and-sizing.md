---
title: "Memory Layout in Zig with Formulas"
date: 2026-01-23
categories:
  - Math
  - Programming
tags:
  - Zig
  - Compiler
header:
  og_image: /my_assets/images/zig_logo.jpg
  teaser: /my_assets/images/zig_logo.jpg
---

I was recently encouraged to watch [A Practical Guide to Applying Data Oriented Design (DoD)](https://www.youtube.com/watch?v=IroPQ150F6c) by Andrew Kelley, the creator of [Zig](https://ziglang.org/)[^1]. Just 10 minutes into the talk, I was confronted with a skill I had never formally learned... the arithmetic behind *memory layout* of types. 

Throughout the talk, Andrew tested the audience's ability to compute the alignment and sizes of various types, starting with primitives like `u32` and `bool`, and ending with some more complex structures involving enums, unions, and more. As far as I can tell, the exact rules for computing the alignment and size of a type in Zig are not made explicit in any documentation, but are understood by those *in-the-know*. 

As a late-comer to low-level programming myself, I thought I'd collect here some formulas & explanations I landed on while wrestling with alignment and sizing in Zig. 

## Memory Layout Principles

For any piece of data stored in memory on a computer, the data must have some natural alignment and size dimensions according to its type. Intuitively, its *size* captures how many bytes it would take to specify the information that should be contained in any instance of that type. Whereas, its *alignment* captures the spacing the compiler must obey when choosing valid addresses at which to place data of this type.

I imagine just about any computer science major would have learned the rules of memory layout according to some kind of C-like compiler. I guess the motivation would go something like: "CPUs fetch data from memory in fixed-size blocks of so-many bytes, and performance degrades when data is misaligned. So, compilers automatically pad and align data types." 

In particular, types that don't "fill up" all of the space in memory allocated to them will be padded with extra bits/bytes to make up for the difference. 

Andrew's whole message in his DoD talk centered on designing your data types to take up as little space in memory as possible, which includes reducing the size, alignment, and padding required to represent the same information. 

Probably, the formulas I propose below apply to similar languages beyond Zig and my machine's (Apple) ABI, but I make no claims.

The Zig language exposes two builtin functions relevant to our discussion:
- **[@alignOf](https://ziglang.org/documentation/master/#alignOf)(comptime T: type)**: #bytes required for aligning this type in memory (valid addresses for this type will be multiples of this value);
- **[@sizeOf](https://ziglang.org/documentation/master/#sizeOf)(comptime T: type)**: #bytes for storing the type in memory (including padding).

I'll use the following function `memory_printout` to report these values for any type:
```zig
const std = @import("std");

fn memory_printout(T: type) void {
    std.debug.print("@alignOf( {s} ): {d}\t", .{ @typeName(T), @alignOf(T) });
    std.debug.print("@sizeOf( {s} ): {d}\n", .{ @typeName(T), @sizeOf(T) });
}
```

## Memory Layout Formulas 

To start, one helpful invariant is offered in Zig's documentation. For any type `T`:

$$
\texttt{@sizeOf(T)} \geq \texttt{@alignOf(T)}.
$$

### Primitives

Already, the primitive data types will teach us a good bit about memory layout. Try guessing the results of the following Zig code before looking at the answer:
```zig
pub fn main() void {
    const types = [_]type{ bool, c_char, u8, *u8, u16, u17, i32, f64, usize };
    inline for (types) |T| memory_printout(T);
}
```

<details markdown="1">
  <summary>The Output:</summary>
```zig
@alignOf( bool ): 1       @sizeOf( bool ): 1
@alignOf( c_char ): 1     @sizeOf( c_char ): 1
@alignOf( u8 ): 1         @sizeOf( u8 ): 1
@alignOf( *u8 ): 8        @sizeOf( *u8 ): 8
@alignOf( u16 ): 2        @sizeOf( u16 ): 2
@alignOf( u17 ): 4        @sizeOf( u17 ): 4
@alignOf( i32 ): 4        @sizeOf( i32 ): 4
@alignOf( f64 ): 8        @sizeOf( f64 ): 8
@alignOf( usize ): 8      @sizeOf( usize ): 8
```
</details>

This suggests the following formula for primitive data types:

$$
\texttt{@sizeOf(primitive)} = \texttt{@alignOf(primitive)}.
$$

Most of these make sense. A `c_char` truly requires 8 bits, or 1 byte to specify. 

Whereas, a `bool` comprises a single bit (information-theoretically). But, alignment and size are measured in *whole bytes*, so we should round up to the nearest byte (and pad with 7 bits to fill up that byte). 

Similarly, any unsigned integer `u{b}`, signed integer `i{b}`, or floating-point number `f{b}` contains $b$ bits of information. So, counting in bytes, we will have to round $b / 8$ up, somehow. But, look at `u17`: despite $2 < 17 / 8 \leq 3$, the size of `u17` is not 3 bytes. Instead, it's 4 bytes. In general, alignment and size must be *powers-of-2* bytes. This is another desirable property half-dictated by architecture and half-related to the convenience of powers of two. So, we actually always *round up to the nearest power-of-2 bytes* when converting from bits. 

Let's formalize this conversion from bits to bytes for good:

$$ 
\begin{aligned}
  \texttt{bytes}(\texttt{bits}) &:= \max\left\{1, 2^{\left\lceil\log_2(\frac{\texttt{bits}}{8}) \right\rceil}\right\}.
\end{aligned}
$$

Another consequence of alignment and size being powers of two is the following, stronger invariant. For any type `T`: 

$$
\texttt{@alignOf(T)} \mid \texttt{@sizeOf(T)}.
$$

That is, the size of the type is always a multiple of its alignment.

Next up, depending on your architecture, `usize` will either match `u32` or `u64`. I'm working on a 64-bit machine, so that's why we see its size and alignment as 8 bytes. Moreover, any pointer (such as `*u8`) represents an address, which is guaranteed by Zig to match `usize`. 

For primitive data types, remember: **their size and align values agree and equal the smallest power-of-2 many bytes required to represent that type in memory**.

### Structs

In Zig, a `struct` combines many fields into a single data type. How does memory layout work when many fields are combined together? 

> **Note**: Zig automatically minimizes the memory footprint of a struct by possibly shuffling around its fields. To force the Zig compiler to respect the order of the fields as we've defined them, we may use the `extern` keyword as shown below. Really, this forces the compiler to obey C ABI compatibility. 

First, rest assured that structs add no overhead. That is, if `T` is a type, and we define:
```zig
const struct_T = struct {
  field: T,
};
```
then `@alignOf(struct_T) == @alignOf(T)` and `@sizeOf(struct_T) == @sizeOf(T)`.

Now, when a struct envelops two fields, such as 
```zig
const pair = extern struct {
  a: u8,
  b: u32,
};
```
we should consider the meanings of align and size again:
- The alignment of the struct `pair` should be such that any offset by this alignment value does not break the alignment of its constituent fields `a` and `b`. 
  - Here, field `b` has a stricter alignment of 4 bytes, whereas `a` permits offsets of 1 byte. So, `pair` better also only permit alignments of 4 bytes. 
- The size of the struct `pair` is dictated by its alignment. Its memory will necessarily take up a number of bytes which is a multiple of its alignment. To figure out exactly how many, we iterate through the fields in order, trying our best to greedily pack those fields while still respecting their own alignments. 
  - Here, the size of `a` is just one byte, so it fits into a single memory chunk of size 4 bytes (the alignment of `pair` is 4 bytes), with three bytes to spare. Now, we consider the next field: `b`. As its alignment is 4 bytes, we can only write `b` at an address which is a multiple of its own alignment. The soonest we can accomplish this is by padding three bytes after `a` and writing `b` at the fourth byte. This already places `b` into another 4-byte memory chunk, in which it fits entirely as its size is 4 bytes. So, the total size of `pair` is 8 bytes.

Now, what do you expect the output of the following Zig code to be?
```zig
pub fn main() void {
    memory_printout(ABAB);
    memory_printout(ABBA);
}

const ABAB = extern struct {
    a1: u8,
    b1: u16,
    a2: u8,
    b2: u16,
};

const ABBA = extern struct {
    a1: u8,
    a2: u8,
    b1: u16,
    b2: u16,
};
```

<details markdown="1">
  <summary>The Answer:</summary>
```zig
@alignOf( ABAB ): 2      @sizeOf( ABAB ): 8
@alignOf( ABBA ): 2      @sizeOf( ABBA ): 6
```
</details>

In general, deciding the placement of a struct field follows this rule:
> **Rule**: Each field is placed after the previous field at the next smallest multiple of its own alignment.

In general, the formula for rounding a number $N$ up to the nearest multiple of some other number $m$ looks like:

$$
\texttt{next_mult}(N, m) := \left\lceil \frac{N}{m} \right\rceil \cdot m.\\
$$

Given this, try to follow the next example. We make use of another Zig builtin `@offsetOf(<type>, <field_name>)` to display exactly where each field is placed in memory relative to the beginning address of `S`.
```zig
fn printOffset(T: type, comptime f: [:0]const u8) void {
    std.debug.print("@offsetOf( {s} ) = {d}\n", .{ f, @offsetOf(T, f) });
}

pub fn main() void {
  memory_printout(S);
  printOffset(S, "a");
  printOffset(S, "b");
  printOffset(S, "c");
}

const S = extern struct {
    // align = size = 2
    a: u16,
    // align = 2, size = 6
    b: extern struct { b1: u16, b2: u16, b3: u16 },
    // align = size = 4
    c: u32,
};
```
<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( S ): 4        @sizeOf( S ): 12
@offsetOf( a ) = 0
@offsetOf( b ) = 2
@offsetOf( c ) = 8
```
</details>

In general, alignment for structs is quite simple to formulate:

$$
\texttt{@alignOf(struct)} := \max_{\texttt{fields}} \texttt{@alignOf(field)}.
$$

In contrast, the size of the (externed) struct is more complicated: $\texttt{@sizeOf(struct)}$ is the smallest multiple of $\texttt{@alignOf(struct)}$ many bytes required to fit the fields of a struct (in order) such that:

1. No two fields overlap in memory, and
2. Each field lies at an address which is a multiple of its own alignment: $\texttt{@alignOf(field)}$.

Without the `extern` keyword, Zig minimizes the size of the struct under all permutations of its fields. Zig also offers `packed struct`, which eliminates padding entirely and lays out fields in strict bit-order. While this can reduce memory usage further, it comes with performance trade-offs and restrictions on field access.

> **Bonus question**: Try to explain why the choice to make alignments and sizes be powers of two is vital for these rules to be well-defined for assessing the alignment and size of structs.

### Enums

Under the hood, an enum works on indices, not labels. So, the alignment and size of an enum will equal the minimal number of bytes to express the type of its indices. Suppose `T = enum (u{b}) { ... }` is an arbitrary enum indexed by unsigned integers of type `u{b}`, where `b` is measured in bits. 

> **Note**: we may use the Zig standard library to access the number of options in the enum as follows: `std.meta.fields(T).len`. I'll call this $\texttt{T.len}$, below.

> **Note**: By default, Zig's compiler assigns indices starting at zero and counting up by one. So, by default, Zig sets `b` to $\lceil \log_2 (\texttt{T.len}) \rceil$. 

Then,

$$
\begin{aligned}
\texttt{@alignOf(enum(u{b}))} &= \texttt{@alignOf(u{b})} = \texttt{bytes}(\texttt{b}),\\
\texttt{@sizeOf(enum(u{b}))} &=  \texttt{@sizeOf(u{b})} = \texttt{bytes}(\texttt{b}).
\end{aligned}
$$

We've made use of the $\texttt{bytes}$ function, again[^2].

Example:
```zig
const T_default = enum { a, b, c, d, e };
const T_long = enum(u64) { a, b, c, d, e };

memory_printout(T_default);
memory_printout(T_long);
```
<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( T_default ): 1    @sizeOf( T_default ): 1
@alignOf( T_long ): 8       @sizeOf( T_long ): 8
```
</details>

### Arrays and Slices

For an array in Zig, its alignment inherits from that of its elements, and its size is just length$\times$size of the type:

$$
\begin{aligned}
  \texttt{@alignOf([N]T)} &= \texttt{@alignOf(T)},\\
  \texttt{@sizeOf([N]T)} &= \texttt{N} \cdot \texttt{@sizeOf(T)}.
\end{aligned}
$$

In contrast, a slice in Zig is just a special case of a struct which contains one pointer (`usize`) and a length (`usize`). So,

$$
\begin{aligned}
  \texttt{@alignOf(slice)} &= \texttt{@alignOf(usize)} = 8 \text{ bytes (on 64-bit)},\\
  \texttt{@sizeOf(slice)} &= 2 \cdot \texttt{@sizeOf(usize)} = 16 \text{ bytes (on 64-bit)}.
\end{aligned}
$$

Example (using another builtin `@TypeOf`):
```zig
pub fn main() void {
    memory_printout(@TypeOf(digits_array));
    memory_printout(@TypeOf(digits_slice));
}

const digits_array = [10]u8{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
const digits_slice: []const u8 = digits_array[0..]; 
```
<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( [10]u8 ): 1         @sizeOf( [10]u8 ): 10
@alignOf( []const u8 ): 8     @sizeOf( []const u8 ): 16
```
</details>

### (Untagged) Unions

An untagged, bare union in Zig (accomplished with the `extern` keyword) essentially acts as a switch statement over a number of mutually-exclusive options of various types without the ability to report which option is active. To express a bare union type in memory, we just need enough memory to store the largest option(s). 

$$
\begin{aligned}
  \texttt{@alignOf(bare_union)} &= \max_{\texttt{fields}} \{\texttt{@alignOf(field)}\},\\
  \texttt{@sizeOf(bare_union)} &= \texttt{next_mult} \left(\max_{\texttt{fields}} \{\texttt{@sizeOf(field)} \}, \texttt{@alignOf(bare_union)} \right).
\end{aligned}
$$

However, untagged unions in Zig without the `extern` keyword seem to require extra memory, essentially one more alignment's worth. So, untagged unions should satisfy:

$$
\begin{aligned}
  \texttt{@alignOf(union)} &= \max_{\texttt{fields}} \{\texttt{@alignOf(field)}\},\\
  \texttt{@sizeOf(union)} &= \texttt{next_mult} \left(\max_{\texttt{fields}} \{\texttt{@sizeOf(field)} \}, \texttt{@alignOf(union)} \right) + \texttt{@alignOf(union)}.
\end{aligned}
$$

Example:
```zig
pub fn main() void {
    memory_printout(U_bare);
    memory_printout(U);
}

const U_bare = extern union {
    a: i64,
    b: extern struct { c: i64, d: i64, e: i64 },
};

const U = union {
    a: i64,
    b: struct { c: i64, d: i64, e: i64 },
};
```

<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( U_bare ): 8   @sizeOf( U_bare ): 24
@alignOf( U ): 8        @sizeOf( U ): 32
```
</details>


### Tagged Unions

Tagged unions are unions which use an additional enum to detect which field is active in the union. Alignment for a tagged union must additionally consider the alignment of the tag too, while the size must treat the tag and fields together.

> **Note**: there are no "bare" tagged unions. So, the `extern` keyword doesn't work on tagged unions. 

Suppose `U(E)` is of type `union(enum)`. Then, we can compute the alignment and size of this type depending on those of its union and enum components:

$$
\begin{aligned}
  \texttt{@alignOf(U(E))} &= \max\{\texttt{@alignOf(U)}, \texttt{@alignOf(E)}\},\\
  \texttt{@sizeOf(U(E))} &= \texttt{next_mult} \left(\max_{\texttt{fields}} \{\texttt{@sizeOf(field)} \} + \texttt{@sizeOf(E)}, \texttt{@alignOf(U(E))} \right).
\end{aligned}
$$

Example:

```zig
pub fn main() void {
    memory_printout(UE);
    memory_printout(UF);
    memory_printout(UG);
}

const E = enum { a, b };
const F = enum(u64) { a, b };
const G = enum(u128) { a, b };

const UE = union(E) {
    a: i64, b: struct { c: i64, d: i64 }
};
const UF = union(F) {
    a: i64, b: struct { c: i64, d: i64 }
};
const UG = union(G) {
    a: i64, b: struct { c: i64, d: i64 }
};
```

<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( UE ): 8       @sizeOf( UE ): 24
@alignOf( UF ): 8       @sizeOf( UF ): 24
@alignOf( UG ): 16      @sizeOf( UG ): 32
```
</details>

### ArrayLists and MultiArrayLists

An `ArrayList(T)` in Zig is the standard library's dynamic array implementation. This is comparable to the notions of a "vector" in C++ or a "list" in Python, otherwise understood as the *Array of Structs* (AoS) memory layout. Elements of type `T` are stored contiguously in memory each with their full size and padding.

The `ArrayList(T)` type itself is a struct containing:
- `items`: a slice `[]T`, and
- `capacity`: a `usize`.

So, the `ArrayList(T)` type has a fixed memory footprint:

$$
\begin{aligned}
  \texttt{@alignOf(ArrayList(T))} &= \texttt{@alignOf(usize)} = 8 \text{ bytes (on 64-bit)},\\
  \texttt{@sizeOf(ArrayList(T))} &= 3 \cdot \texttt{@sizeOf(usize)} = \text{24 bytes (on 64-bit)}.
\end{aligned}
$$

However, the *data* that the ArrayList manages lives on the heap. When iterating over an ArrayList, you traverse memory in strides of $\texttt{@sizeOf(T)}$ bytes. The memory consumed by the backing buffer is simply:

$$
\begin{aligned}
  \texttt{buffer_alignment} &= \texttt{@alignOf(T)},\\
  \texttt{buffer_size} &= \texttt{buffer.capacity} \cdot \texttt{@sizeOf(T)}.
\end{aligned}
$$

In contrast, a `MultiArrayList(T)` in Zig follows the *Struct of Arrays* (SoA) memory layout. Instead of storing complete `T` instances contiguously, it stores each field of `T` in its own separate, tightly-packed array.

The `MultiArrayList(T)` type itself is a struct containing:
- `ptr`: a single pointer to the backing buffer,
- `len`: a `usize`,
- `capacity`: a `usize`.

So:

$$
\begin{aligned}
  \texttt{@alignOf(MultiArrayList(T))} &= \texttt{@alignOf(usize)} = 8 \text{ bytes (on 64-bit)},\\
  \texttt{@sizeOf(MultiArrayList(T))} &= 3 \cdot \texttt{@sizeOf(usize)} = 24 \text{ bytes (on 64-bit)}.
\end{aligned}
$$

The backing buffer stores all field arrays contiguously. Padding between fields is not needed; instead, each field array is packed according to the field's alignment. Summing over the fields of $T$, the total buffer size would thus be:

$$
\texttt{buffer_size} = \texttt{buffer.capacity} \cdot \sum_{\texttt{fields}} \texttt{@sizeOf}(\texttt{field}).
$$


Example:
```zig
const std = @import("std");
const ArrayList = std.ArrayList;
const MultiArrayList = std.MultiArrayList;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const T = struct { a: u8, b: u16 };

    var list: ArrayList(T) = .{};
    defer list.deinit(allocator);

    var multiList: MultiArrayList(T) = .{};
    defer multiList.deinit(allocator);

    for (0..10_000) |_| {
        try list.append(allocator, .{ .a = 0, .b = 1 });
        try multiList.append(allocator, .{ .a = 0, .b = 1 });
    }

    memory_printout(T);
    memory_printout(ArrayList(T));
    memory_printout(MultiArrayList(T));
    std.debug.print("list capacity: {d}\n", .{list.capacity});
    std.debug.print("list buffer size: {d}\n", .{list.capacity * @sizeOf(T)});
    std.debug.print("multiList capacity: {d}\n", .{multiList.capacity});
    std.debug.print("multiList buffer size: {d}\n", .{multiList.capacity * (@sizeOf(@FieldType(T, "a")) + @sizeOf(@FieldType(T, "b")))});
}
```

<details markdown="1">
  <summary>Output:</summary>
```zig
@alignOf( T ): 2                  @sizeOf( T ): 4
@alignOf( ArrayList(T) ): 8       @sizeOf( ArrayList(T) ): 24
@alignOf( MultiArrayList(T) ): 8  @sizeOf( MultiArrayList(T) ): 24
list capacity: 12854
list buffer size: 51416
multiList capacity: 11150
multiList buffer size: 33450
```
</details>

## Battle Testing

Let's test our formulas against the video that inspired this post: Andrew Kelley's talk on [DoD](https://www.youtube.com/watch?v=IroPQ150F6c). 

> **Note**: In order to get these examples to actually compile and execute in Zig (0.16.0), I had to throw in some allocators and extra helper methods.

### ArrayList of Monsters ([19:05](https://www.youtube.com/watch?v=IroPQ150F6c))

```zig
const Monster = struct {
  anim: *Animation, 
  kind: Kind,

  const Kind = enum { snake, bat, wolf, dingo, human };
};

var monsters: ArrayList(Monster) = .{};
var i: usize = 0;
while (i < 10_000) : (i += 1) {
  try monsters.append(.{
    .anim = getAnimation(),
    .kind = rng.enumValue(Monster.Kind),
  });
}
```

<details markdown="1">
  <summary>Actual Memory Use:</summary>
```zig
Monster size: 16 bytes 
ArrayList(Monster) size: 24 bytes
monsters size: 160_000 bytes        // Total memory size of 10_000 monsters
```
</details>

Do our formulas agree? 
1. **`Monster` Struct**: 
  - The fields of `Monster` satisfy $\texttt{@alignOf(anim)} = 8$ and $\texttt{@alignOf(kind)} = 1$. So, we expect the alignment of the struct to be $\texttt{@alignOf(Monster)} = 8$. 
  - No matter the ordering, it takes two memory chunks of size 8 bytes to fit these fields (since $\texttt{@sizeOf(anim)} = 8$ and $\texttt{@sizeOf(kind)} = 1$). So, we expect $\texttt{@sizeOf(Monster)} = 16$, exactly as we observed. 
2. **ArrayList(Monster) Type**: as a type, it takes a bit of overhead to specify `ArrayList(Monster)`, since an ArrayList is really a slice `[]Monster` plus a capacity (`usize`). On my 64-bit machine, that adds up to 24 bytes of memory.
3. **`monsters` ArrayList**: remember, ArrayLists act like "arrays of structs".
  - The natural size and alignment of the `Monster` struct dictate the layout of the `monsters` ArrayList. 
  - The size of an ArrayList in memory should equal its length times the size of each `Monster` element type. So, we expect `monsters` to take up $10,000 \times \texttt{@sizeOf(Monster)} = 160,000$ bytes, as observed.

----
**Footnotes**

[^1]: Zig is a modern, C-like programming language which offers a safer, more memory-explicit experience for systems programming, without sacrificing low-level control or C interoperability. Notably, Zig makes it straightforward to manage memory allocation by treating allocators as first-class values rather than hidden globals. Instead of relying on an implicit runtime or a process-wide allocator, you pass explicit allocator objects into the code that needs them. This makes ownership and lifetimes much clearer, encourages you to design APIs around who is responsible for allocating and freeing memory, and makes it easy to swap in custom allocation strategies (e.g., arenas, scratch, tracking, etc.). 

[^2]: Recall: $\displaystyle \texttt{bytes}(\texttt{bits}) := \max(1, 2^{\lceil\log_2(\frac{\texttt{bits}}{8})\rceil})$ whenever $\texttt{bits} > 0$. Otherwise, $\texttt{bytes}(0) = 0$. 