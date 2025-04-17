import TinosBold from '@public/fonts/Tinos/TinosBold.ttf'
import TinosBoldItalic from '@public/fonts/Tinos/TinosBoldItalic.ttf'
import TinosItalic from '@public/fonts/Tinos/TinosItalic.ttf'
import TinosRegular from '@public/fonts/Tinos/TinosRegular.ttf'
import { Font } from '@react-pdf/renderer'

let fontsRegistered = false

export const registerFonts = () => {
  if (fontsRegistered) {
    return
  }
  Font.register({
    family: 'Tinos',
    fonts: [
      {
        src: TinosRegular
      },
      {
        src: TinosItalic,
        fontStyle: 'italic'
      },
      {
        src: TinosBold,
        fontWeight: 'bold'
      },
      {
        src: TinosBoldItalic,
        fontWeight: 'bold',
        fontStyle: 'italic'
      }
    ]
  })
  Font.registerHyphenationCallback((word) => [word])
  fontsRegistered = true
}
