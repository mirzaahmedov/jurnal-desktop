import { Spravochnik } from './dialog'
import { SpravochnikStore, useSpravochnikStore } from './store'

export const SpravochnikProvider = () => {
  const { spravochniks, close } = useSpravochnikStore() as SpravochnikStore<{
    id: number
  }>

  return spravochniks.map((spravochnik) => {
    return (
      <Spravochnik
        key={spravochnik.id}
        spravochnik={spravochnik}
        close={close}
      />
    )
  })
}
