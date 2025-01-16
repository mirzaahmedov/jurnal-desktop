import { arrayStartsWith, removeTrailingZeros } from '@renderer/common/lib/array'

export type TreeNode<T> = T & {
  _levels: number[]
  _included?: boolean
  children: TreeNode<T>[]
}
export type PreprocessFn = <T>(arrays: TreeNode<T>[]) => TreeNode<T>[]

export const buildTreeFromArray = <T extends Record<string, unknown>>(
  array: T[],
  acceccorFn: (item: T) => string,
  ...preprocessors: PreprocessFn[]
) => {
  let minLevel = Infinity

  let normalized = array.map((item) => {
    const levels = removeTrailingZeros(acceccorFn(item)).split('.').map(Number)
    if (levels.length < minLevel) {
      minLevel = levels.length
    }

    return {
      ...item,
      children: [],
      _levels: levels,
      _included: false
    }
  })

  preprocessors.forEach((fn) => {
    normalized = fn(normalized)
  })

  const findChildren = (parent: TreeNode<T>) => {
    const nodes = normalized.filter(
      (item) =>
        arrayStartsWith(item._levels, parent._levels) && item._levels.length > parent._levels.length
    )

    nodes.forEach(findChildren)

    const children = nodes.filter((item) => {
      if (!item._included) {
        item._included = true
        return true
      }
      return false
    })

    parent.children = children
  }

  const nodes = normalized.filter((item) => {
    if (item._levels.length === minLevel) {
      item._included = true
      return true
    }
    return false
  })

  nodes.forEach(findChildren)
  nodes.push(...normalized.filter((item) => !item._included))

  return nodes
}

export const sortElementsByLevels = (a: TreeNode<any>, b: TreeNode<any>) => {
  const levelsA = a._levels
  const levelsB = b._levels
  const length = Math.min(levelsA.length, levelsB.length)
  for (let i = 0; i < length; i++) {
    if (levelsA[i] === levelsB[i]) {
      continue
    }
    return levelsA[i] - levelsB[i]
  }
  return levelsA.length - levelsB.length
}
