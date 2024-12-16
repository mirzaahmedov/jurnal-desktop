import { useSpravochnik } from '@/common/features/spravochnik'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { SpravochnikFields, SpravochnikField } from '@/common/features/spravochnik/components'
import { Form } from '@/common/components/ui/form'
import { Podotchet } from '@/common/models'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const TestPage = () => {
  const [podotchet, setPodotchet] = useState<Podotchet>()

  const form = useForm({
    defaultValues: {
      podotchet: podotchet?.id
    }
  })

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: podotchet?.id,
      onChange: (_, podotchet) => {
        setPodotchet(podotchet)
      }
    })
  )

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <div className="w-full max-w-3xl">
        <Form {...form}>
          <SpravochnikFields name="Подотчетное лицо" error={true} message={'Hello world'}>
            <div className="grid grid-cols-2 gap-10">
              <SpravochnikField
                label="Имя"
                formElementProps={{
                  direction: 'column',
                  controlled: false
                }}
                getInputValue={(podotchet) => podotchet?.name || ''}
                {...podotchetSpravochnik}
              />
              <SpravochnikField
                label="Район"
                formElementProps={{
                  direction: 'column',
                  controlled: false
                }}
                getInputValue={(podotchet) => podotchet?.rayon || ''}
                {...podotchetSpravochnik}
              />
            </div>
          </SpravochnikFields>
        </Form>
      </div>
    </div>
  )
}

export { TestPage }
