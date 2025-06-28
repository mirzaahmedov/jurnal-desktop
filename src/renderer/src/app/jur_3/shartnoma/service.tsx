import type {
  SpravochnikDialogProps,
  SpravochnikHookOptions,
  SpravochnikTableProps
} from '@/common/features/spravochnik'
import type { Shartnoma } from '@/common/models'

import { t } from 'i18next'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ZodIssueCode, z } from 'zod'

import { GenericTable } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Button } from '@/common/components/ui/button'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { formatDate } from '@/common/lib/date'
import { capitalize } from '@/common/lib/string'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { ShartnomaColumns } from './columns'
import { ShartnomaQueryKeys } from './config'
import { ShartnomaForm } from './details/shartnoma-form'

export const ContractService = new CRUDService<Shartnoma, ShartnomaFormValues>({
  endpoint: ApiEndpoints.shartnoma
})
  .use(budjet())
  .use(main_schet())

export const ShartnomaGrafikFormSchema = z
  .object({
    id: z.number().optional(),
    oy_1: z.number(),
    oy_2: z.number(),
    oy_3: z.number(),
    oy_4: z.number(),
    oy_5: z.number(),
    oy_6: z.number(),
    oy_7: z.number(),
    oy_8: z.number(),
    oy_9: z.number(),
    oy_10: z.number(),
    oy_11: z.number(),
    oy_12: z.number(),
    smeta_id: z.number().min(1),
    sub_schet: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (
      [
        values.oy_1,
        values.oy_2,
        values.oy_3,
        values.oy_4,
        values.oy_5,
        values.oy_6,
        values.oy_7,
        values.oy_8,
        values.oy_9,
        values.oy_10,
        values.oy_11,
        values.oy_12
      ].every((value) => !value)
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Required',
        path: ['oy_1']
      })
    }
  })
export const ShartnomaFormSchema = withPreprocessor(
  z.object({
    spravochnik_organization_id: z.number(),
    doc_num: z.string(),
    doc_date: z.string().transform((date) => formatDate(date)),
    opisanie: z.string().optional(),
    pudratchi_bool: z.boolean(),
    grafik_year: z.number().optional(),
    grafiks: z.array(ShartnomaGrafikFormSchema)
  })
)
export type ShartnomaFormValues = z.infer<typeof ShartnomaFormSchema>
export type ShartnomaGrafikFormValues = z.infer<typeof ShartnomaGrafikFormSchema>

const ShartnomaSpravochnikDialog = ({
  open,
  onOpenChange,
  params,
  state
}: SpravochnikDialogProps) => {
  const { t } = useTranslation()

  const organization = params?.organ_id ? Number(params.organ_id) : 0
  const original = state?.original as Shartnoma

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-8xl">
          <DialogHeader>
            <DialogTitle>
              {capitalize(t('create-something', { something: t('shartnoma') }))}
            </DialogTitle>
          </DialogHeader>
          <div className="px-1 w-full overflow-hidden overflow-y-auto scrollbar">
            <ShartnomaForm
              dialog={false}
              organId={organization}
              original={original}
              onSuccess={() => onOpenChange?.(false)}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const ShartnomaSpravochnikTable = ({
  setState,
  dialogToggle,
  ...props
}: SpravochnikTableProps<Shartnoma>) => {
  return (
    <GenericTable
      {...props}
      actions={(row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            setState?.({
              original: row
            })
            dialogToggle?.open()
          }}
        >
          <CopyPlus className="size-4" />
        </Button>
      )}
    />
  )
}

export const createShartnomaSpravochnik = (config: Partial<SpravochnikHookOptions<Shartnoma>>) => {
  return extendObject(
    {
      title: t('shartnoma'),
      endpoint: ApiEndpoints.shartnoma,
      columnDefs: ShartnomaColumns,
      service: ContractService,
      queryKeys: ShartnomaQueryKeys,
      Dialog: ShartnomaSpravochnikDialog,
      CustomTable: ShartnomaSpravochnikTable,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
