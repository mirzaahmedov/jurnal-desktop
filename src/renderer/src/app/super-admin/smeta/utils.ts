import { arrayStartsWith, removeTrailingZeros } from '@renderer/common/lib/array'

import type { Smeta } from '@renderer/common/models'

type TreeNode = Smeta & {
  _levels: number[]
  _included?: boolean
  children: TreeNode[]
}

const treeFromArray = (list: (Smeta & { _included?: boolean })[]) => {
  let minLevel = Infinity

  const normalized = list.map((item) => {
    item._included = false

    const levels = removeTrailingZeros(item.father_smeta_name).split('.').map(Number)
    if (levels.length < minLevel) {
      minLevel = levels.length
    }

    return {
      ...item,
      children: [],
      _levels: levels
    }
  })

  const findChildren = (parent: TreeNode): TreeNode => {
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

    return {
      ...parent,
      children
    }
  }

  const nodes = normalized.filter((item) => {
    if (item._levels.length === minLevel) {
      item._included = true
      return true
    }
    return false
  })

  const tree = nodes.map(findChildren)

  tree.push(...normalized.filter((item) => !item._included))

  return tree
}

export { treeFromArray }
