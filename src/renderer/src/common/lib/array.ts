export const removeTrailingZeros = (str: string) => {
  return str.replace(/(\.0)+$/, '')
}

export const arrayStartsWith = (arr: number[], prefix: number[]) => {
  return prefix.every((v, i) => v === arr[i])
}

export const splitArrayToChunks = <T>(array: T[], chunkSize: number) => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk: T[] = []
    for (let j = i; j < i + chunkSize && j < array.length; j++) {
      chunk.push(array[j])
    }
    chunks.push(chunk)
  }
  return chunks
}
