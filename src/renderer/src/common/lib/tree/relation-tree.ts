export type ReletionTreeNode<T> = T & {
  children: ReletionTreeNode<T>[]
}

export type PreprocessFn = <T>(arrays: ReletionTreeNode<T>[]) => ReletionTreeNode<T>[]

export interface ArrayToTreeByRelationsArgs<T> {
  array: T[]
  getId: (item: T) => unknown
  getParentId: (item: T) => unknown
  preprocessors?: PreprocessFn[]
}
export const arrayToTreeByReletions = <T extends object>({
  array,
  getId,
  getParentId,
  preprocessors = []
}: ArrayToTreeByRelationsArgs<T>) => {
  if (!array || !Array.isArray(array)) {
    return []
  }

  let normalized = array.map(
    (item) =>
      ({
        ...item,
        children: []
      }) as ReletionTreeNode<T>
  )

  preprocessors.forEach((fn) => {
    normalized = fn(normalized)
  })

  const root = normalized.filter((item) => !getParentId(item))
  const nodes = [...root]

  while (nodes.length > 0) {
    const node = nodes.shift()!
    const children = normalized.filter((item) => getParentId(item) === getId(node))
    node.children = children
    nodes.push(...children)
  }

  return root
}
