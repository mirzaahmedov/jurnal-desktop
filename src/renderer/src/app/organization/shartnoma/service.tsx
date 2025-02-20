import type {
  SpravochnikDialogProps,
  SpravochnikHookOptions,
  SpravochnikTableProps
} from '@/common/features/spravochnik'
import type { Shartnoma } from '@/common/models'

import { GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { formatDate } from '@renderer/common/lib/date'
import { CopyPlus } from 'lucide-react'
import { ZodIssueCode, z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './config'
import { ShartnomaForm } from './details/shartnoma-form'

export const shartnomaService = new CRUDService<Shartnoma, ShartnomaFormValues>({
  endpoint: APIEndpoints.shartnoma
}).use(budjet())

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
    yillik_oylik: z.boolean().optional(),
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
  const organization = params?.organ_id ? Number(params.organ_id) : 0

  const original = state?.original as Shartnoma

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Добавить договор</DialogTitle>
        </DialogHeader>
        <div className="px-1 w-full overflow-hidden">
          <ShartnomaForm
            dialog={false}
            organization={organization}
            original={original}
            onSuccess={() => onOpenChange?.(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
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
      customActions={(row) => (
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
      title: 'Выберите договор',
      endpoint: APIEndpoints.shartnoma,
      columnDefs: shartnomaColumns,
      service: shartnomaService,
      queryKeys: shartnomaQueryKeys,
      Dialog: ShartnomaSpravochnikDialog,
      CustomTable: ShartnomaSpravochnikTable,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
