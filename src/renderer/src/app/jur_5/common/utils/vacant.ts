import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'

export const getVacantRayon = (vacant: VacantTreeNode) => {
  let rayon = ''
  vacant?.parents.forEach((parent) => {
    rayon += parent.name + ' '
  })
  rayon += vacant?.name ?? ''
  return rayon
}
