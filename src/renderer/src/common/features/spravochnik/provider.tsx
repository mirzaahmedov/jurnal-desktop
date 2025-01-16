import { SpravochnikStore, useSpravochnikStore } from './store'

import { Spravochnik } from './dialog'

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
