import type { UseFormReturn } from 'react-hook-form'

import { useTranslation } from 'react-i18next'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

export interface BankCardFormProps {
  form: UseFormReturn<any>
}
export const BankCardForm = ({ form }: BankCardFormProps) => {
  const { t } = useTranslation()

  return (
    <div
      className="relative rounded-2xl px-4 shadow-xl font-sans flex flex-col gap-6 my-8 w-full max-w-[450px]"
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
        color: 'white',
        minHeight: '240px',
        overflow: 'hidden'
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="2"
              fill="#3b82f6"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#dots)"
        />
      </svg>
      <Fieldset
        name={t('bank_card')}
        className="gap-6 relative z-10"
        legendProps={{
          className: 'text-white font-bold uppercase tracking-wide mb-2 text-lg drop-shadow'
        }}
      >
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('bank')}
                labelProps={{ className: 'font-semibold text-white text-sm mb-1' }}
              >
                <Input
                  {...field}
                  value={field.value ?? ''}
                  className="w-full bg-white/20 text-white border-none rounded-md px-3 py-2 placeholder-white/70 focus:bg-white/30 focus:ring-2 focus:ring-blue-200"
                />
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="raschetSchet"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('card_number')}
                labelProps={{ className: 'font-semibold text-white text-sm mb-1' }}
              >
                <Input
                  {...field}
                  value={field.value ?? ''}
                  className="w-full bg-white/20 text-white border-none rounded-md px-3 py-2 placeholder-white/70 focus:bg-white/30 focus:ring-2 focus:ring-blue-200 tracking-widest"
                />
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="fioDop"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('fio')}
                labelProps={{ className: 'font-semibold text-white text-sm mb-1' }}
              >
                <Input
                  {...field}
                  className="w-full bg-white/20 text-white border-none rounded-md px-3 py-2 placeholder-white/70 focus:bg-white/30 focus:ring-2 focus:ring-blue-200"
                />
              </FormElement>
            )}
          />
        </div>
      </Fieldset>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-blue-400/40 to-blue-900/10 rounded-full blur-2xl z-0" />
    </div>
  )
}
