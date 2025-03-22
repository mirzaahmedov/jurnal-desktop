export interface GetTreeDepthArgs<T> {
  node: T
  getChildren: (node: T) => T[] | undefined
  depth?: number
}
export const getTreeDepth = <T extends object>({
  node,
  getChildren,
  depth = 1
}: GetTreeDepthArgs<T>): number => {
  const children = getChildren(node)
  if (!children || !children.length) {
    return depth
  }

  return Math.max(
    ...children.map((child) =>
      getTreeDepth({
        node: child,
        getChildren,
        depth: depth + 1
      })
    )
  )
}

export interface GetTreeBreadthArgs<T> {
  node: T
  getChildren: (node: T) => T[] | undefined
  breadth?: number
}
export const getTreeBreadth = <T extends object>({
  node,
  getChildren,
  breadth = 1
}: GetTreeBreadthArgs<T>): number => {
  const children = getChildren(node)
  if (!children || !children.length) {
    return breadth
  }

  return children.reduce((acc, child) => {
    const childBreadth = getTreeBreadth({
      node: child,
      getChildren
    })
    return acc + childBreadth
  }, 0)
}
