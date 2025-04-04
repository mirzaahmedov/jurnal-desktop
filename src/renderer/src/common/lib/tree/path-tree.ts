import { arrayStartsWith, removeTrailingZeros } from '@/common/lib/array'

export type PathTreeNode<T> = T & {
  _path: number[]
  _included?: boolean
  children?: PathTreeNode<T>[]
}
export type PreprocessFn = <T>(arrays: PathTreeNode<T>[]) => PathTreeNode<T>[]

export interface ArrayToTreeByPathKeyArgs<T> {
  array: T[]
  getPathKey: (item: T) => string
  preprocessors?: PreprocessFn[]
}
export const arrayToTreeByPathKey = <T extends object>({
  array,
  getPathKey,
  preprocessors = []
}: ArrayToTreeByPathKeyArgs<T>) => {
  let minDepth = Infinity

  let normalized = array.map((item) => {
    const path = removeTrailingZeros(getPathKey(item)).split('.').map(Number)
    if (path.length < minDepth) {
      minDepth = path.length
    }

    return {
      ...item,
      children: [],
      _path: path,
      _included: false
    } as PathTreeNode<T>
  })

  preprocessors.forEach((fn) => {
    normalized = fn(normalized)
  })

  const findChildren = (parent: PathTreeNode<T>) => {
    const nodes = normalized.filter(
      (item) => arrayStartsWith(item._path, parent._path) && item._path.length > parent._path.length
    )

    nodes.forEach(findChildren)

    const children = nodes.filter((item) => {
      if (!item._included) {
        item._included = true
        return true
      }
      return false
    })

    parent.children = children.length > 0 ? children : undefined
  }

  const nodes = normalized.filter((item) => {
    if (item._path.length === minDepth) {
      item._included = true
      return true
    }
    return false
  })

  nodes.forEach(findChildren)
  nodes.push(...normalized.filter((item) => !item._included))

  return nodes
}

export const sortElementsByPath = (a: PathTreeNode<unknown>, b: PathTreeNode<unknown>) => {
  const pathA = a._path
  const pathB = b._path
  const length = Math.min(pathA.length, pathB.length)
  for (let i = 0; i < length; i++) {
    if (pathA[i] === pathB[i]) {
      continue
    }
    return pathA[i] - pathB[i]
  }
  return pathA.length - pathB.length
}
