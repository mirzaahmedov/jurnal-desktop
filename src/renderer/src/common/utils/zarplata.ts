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

interface WorkdayStats {
  totalDays: number
  workdays: number
  weekends: number
}

export function getWorkdaysInMonth(
  year: number,
  month: number,
  workWeek: number = 5
): WorkdayStats {
  const daysInMonth = new Date(year, month, 0).getDate()
  let workdays = 0

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()

    if (
      (workWeek === 5 && dayOfWeek !== 0 && dayOfWeek !== 6) ||
      (workWeek === 6 && dayOfWeek !== 0) ||
      workWeek === 7
    ) {
      workdays++
    }
  }

  return {
    totalDays: daysInMonth,
    workdays,
    weekends: daysInMonth - workdays
  }
}
