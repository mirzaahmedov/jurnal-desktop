export const roundToTwo = (num: number) => {
  const rounded = Math.round((num + Number.EPSILON) * 100) / 100
  return Number(rounded)
}
export const calculateProductSum = (amount: number, price: number, minSumma: number) => {
  const sum = amount * roundToTwo(price)
  return Math.max(sum, minSumma)
}
