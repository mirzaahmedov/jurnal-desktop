import { Font } from '@react-pdf/renderer'
import tinos_bold from '@resources/fonts/tinos/tinos-bold.ttf'
import tinos_bold_italic from '@resources/fonts/tinos/tinos-bold-italic.ttf'
import tinos_italic from '@resources/fonts/tinos/tinos-italic.ttf'
import tinos_regular from '@resources/fonts/tinos/tinos-regular.ttf'

let fontsRegistered = false

export const registerFonts = () => {
  if (fontsRegistered) {
    return
  }
  Font.register({
    family: 'Tinos',
    fonts: [
      {
        src: tinos_regular
      },
      {
        src: tinos_italic,
        fontStyle: 'italic'
      },
      {
        src: tinos_bold,
        fontWeight: 'bold'
      },
      {
        src: tinos_bold_italic,
        fontWeight: 'bold',
        fontStyle: 'italic'
      }
    ]
  })
  Font.registerHyphenationCallback((word) => [word])
  fontsRegistered = true
}
