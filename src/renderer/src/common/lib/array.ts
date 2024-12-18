const removeTrailingZeros = (str: string) => {
  return str.replace(/(\.0)+$/, '')
}

const arrayStartsWith = (arr: number[], prefix: number[]) => {
  return prefix.every((v, i) => v === arr[i])
}

export { removeTrailingZeros, arrayStartsWith }
