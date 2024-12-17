const removeTrailingZeros = (str: string) => {
  return str.replace(/(\.0)+$/, '')
}

const arrayStartsWith = (arr: number[], prefix: number[]) => {
  return prefix.every((v, i) => v === arr[i])
}

const groupNestedList = <T extends Record<string, unknown>>(list: T[], key: keyof T) => {
  const normalized = list.map((item) => ({
    ...item,
    _levels: removeTrailingZeros(String(item[key])).split('.').map(Number)
  }))

  type Nested = T & {
    _levels: number[]
    children: Nested[]
  }

  const findChildren = (target: Nested): Nested => {
    const children = normalized.filter(
      (item) =>
        arrayStartsWith(item._levels, target._levels) && item._levels.length > target._levels.length
    )
    return {
      ...target,
      children: children.map(findChildren)
    }
  }

  const heads = normalized.filter((item) => item._levels.length === 2)
  const nestedList = heads.map(findChildren)

  return nestedList
}

export { groupNestedList }
