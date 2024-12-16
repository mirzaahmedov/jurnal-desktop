export type Autocomplete<T extends string | number | symbol> = T | Omit<string, T>
