export type ReletionTreeNode<T, I> = T & {
  children: ReletionTreeNode<T, I>[]
  path: I[]
  parents: ReletionTreeNode<T, I>[]
}

export type PreprocessFn = <T, I>(arrays: ReletionTreeNode<T, I>[]) => ReletionTreeNode<T, I>[]

export interface ArrayToTreeByRelationsArgs<T, I> {
  array: T[]
  getId: (item: T) => I
  getParentId: (item: T) => I
  preprocessors?: PreprocessFn[]
}
export const arrayToTreeByReletions = <T extends object, I = unknown>({
  array,
  getId,
  getParentId,
  preprocessors = []
}: ArrayToTreeByRelationsArgs<T, I>) => {
  if (!array || !Array.isArray(array)) {
    return []
  }

  let normalized = array.map(
    (item) =>
      ({
        ...item,
        children: [],
        path: [],
        parents: []
      }) as ReletionTreeNode<T, I>
  )

  preprocessors.forEach((fn) => {
    normalized = fn(normalized)
  })

  const root = normalized.filter((item) => !getParentId(item))
  const nodes = [...root]

  while (nodes.length > 0) {
    const node = nodes.shift()!
    const children = normalized.filter((item) => {
      if (getParentId(item) === getId(node)) {
        item.path.push(...node.path, getId(node))
        item.parents.push(...node.parents, node)
        return true
      }
      return false
    })
    node.children = children
    nodes.push(...children)
  }

  return root
}
