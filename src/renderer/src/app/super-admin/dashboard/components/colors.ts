export const generateColors = (count: number) => {
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360
    colors.push(`hsl(${hue}, 40%, 60%)`)
  }
  return colors
}
