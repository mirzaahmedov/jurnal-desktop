export type Autocomplete<T extends string | number | symbol> = T | Omit<string, T>

// Step 1: Split string by '.'
type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S]

// Step 2: Convert string to number if needed
type ToIndex<S extends string> = S extends `${infer N extends number}` ? N : S

// Step 3: Recursive path indexing
type PathValue<T, P extends readonly string[]> = P extends [
  infer Head extends string,
  ...infer Tail extends string[]
]
  ? Head extends keyof T
    ? PathValue<T[Head], Tail>
    : ToIndex<Head> extends keyof T
      ? PathValue<T[ToIndex<Head>], Tail>
      : T extends (infer U)[]
        ? ToIndex<Head> extends number
          ? PathValue<U, Tail>
          : never
        : T
  : T

// Step 4: Helper to use dot-path directly
export type DeepValue<T, Path extends string> = PathValue<T, Split<Path, '.'>>
