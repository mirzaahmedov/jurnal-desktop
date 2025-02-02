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
import { CopyPlus } from 'lucide-react'
import { z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './constants'
import { ShartnomaForm } from './details/shartnoma-form'

export const shartnomaService = new CRUDService<Shartnoma, ShartnomaFormValues>({
  endpoint: APIEndpoints.shartnoma
}).use(budjet())

export const ShartnomaFormSchema = withPreprocessor(
  z.object({
    spravochnik_organization_id: z.number(),
    doc_num: z.string(),
    doc_date: z.string(),
    smeta_id: z.number(),
    smeta2_id: z.number().optional(),
    opisanie: z.string().optional(),
    summa: z.coerce.number().min(1),
    pudratchi_bool: z.boolean(),
    grafik_year: z.number().optional(),
    yillik_oylik: z.boolean()
  })
)
export type ShartnomaFormValues = z.infer<typeof ShartnomaFormSchema>

const ShartnomaSpravochnikDialog = ({
  open,
  onOpenChange,
  params,
  state
}: SpravochnikDialogProps) => {
  const organization = params?.organization ? Number(params.organization) : 0

  const original = state?.original as Shartnoma

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить договор</DialogTitle>
        </DialogHeader>
        <ShartnomaForm
          organization={organization}
          original={original}
          onSuccess={() => onOpenChange?.(false)}
        />
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
