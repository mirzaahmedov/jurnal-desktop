export const calcSumma = (kol: number, sena: number) => {
  if (typeof kol !== 'number' || typeof sena !== 'number') {
    return 0
  }
  return kol * sena
}
export const calcSena = (summa: number, kol: number) => {
  if (typeof kol !== 'number' || typeof summa !== 'number' || kol === 0) {
    return 0
  }
  return summa / kol
}
