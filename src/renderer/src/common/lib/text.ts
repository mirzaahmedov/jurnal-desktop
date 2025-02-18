export const normalizeSpaces = (value?: string) => {
  return value?.replaceAll(/\s/g, ' ')
}
