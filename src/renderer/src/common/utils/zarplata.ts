import type { RelationTreeNode } from '@/common/lib/tree/relation-tree'
import type { Vacant } from '@/common/models/vacant'

export const getVacantRayon = (vacant: RelationTreeNode<Vacant, number | null>) => {
  let rayon = ''

  for (let i = 0; i < vacant.parents?.length; i++) {
    const parent = vacant.parents[i]
    rayon += parent.name
    rayon += ' '
  }

  return rayon + vacant.name
}
