import { Font } from '@react-pdf/renderer'

import TinosBold from '@/common/assets/fonts/Tinos/TinosBold.ttf?url'
import TinosBoldItalic from '@/common/assets/fonts/Tinos/TinosBoldItalic.ttf?url'
import TinosItalic from '@/common/assets/fonts/Tinos/TinosItalic.ttf?url'
import TinosRegular from '@/common/assets/fonts/Tinos/TinosRegular.ttf?url'

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
