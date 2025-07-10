export interface CalcRoadSummaArgs {
  distanceKM: number
  minimumWageSumma: number
}
export const calcRoadSumma = ({ distanceKM, minimumWageSumma }: CalcRoadSummaArgs) => {
  return distanceKM * (minimumWageSumma * 0.001)
}

export interface CalcDailySummaArgs {
  minimumWageSumma: number
  daysCount: number
}
export const calcDailySumma = ({ minimumWageSumma, daysCount }: CalcDailySummaArgs) => {
  return minimumWageSumma * 0.1 * daysCount
}
