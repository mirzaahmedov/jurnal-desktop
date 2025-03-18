export const predefinedColors = [
  '#007BFF', // Blue (Accent)
  '#28A745', // Green
  '#FFC107', // Yellow
  '#DC3545', // Red
  '#6610F2', // Purple
  '#17A2B8', // Cyan
  '#FF851B', // Orange
  '#20C997', // Teal
  '#E83E8C', // Pink
  '#6C757D' // Gray
]

export const getRandomColor = (existingColors: string[]) => {
  let color: string
  do {
    const hue = Math.floor(Math.random() * 360) // Full color range
    const saturation = Math.floor(Math.random() * 30) + 60 // 60-90%
    const lightness = Math.floor(Math.random() * 30) + 40 // 40-70%
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  } while (existingColors.includes(color)) // Ensure uniqueness
  return color
}

export const getColors = (count: number) => {
  const colors = Array.from<string>({ length: count })

  for (let i = 0; i < colors.length; i++) {
    if (i < predefinedColors.length) {
      colors[i] = predefinedColors[i]
      continue
    }
    colors[i] = getRandomColor(colors)
  }

  return colors
}
