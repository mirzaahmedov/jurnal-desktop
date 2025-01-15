import type { Shartnoma } from '@/common/models'
import type { SpravochnikDialogProps, SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { budjet } from '@/common/features/crud/middleware'
import { extendObject } from '@/common/lib/utils'
import { shartnomaColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { ShartnomaForm } from './details/shartnoma-form'
import { shartnomaQueryKeys } from './constants'

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
    summa: z.coerce.number(),
    pudratchi_bool: z.boolean(),
    grafik_year: z.number().optional(),
    yillik_oylik: z.boolean()
  })
)
export type ShartnomaFormValues = z.infer<typeof ShartnomaFormSchema>

const ShartnomaDialog = ({ open, onOpenChange, params }: SpravochnikDialogProps) => {
  const organization = params?.organization ? Number(params.organization) : 0
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
          onSuccess={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export const createShartnomaSpravochnik = (config: Partial<SpravochnikHookOptions<Shartnoma>>) => {
  return extendObject(
    {
      title: 'Выберите договор',
      endpoint: APIEndpoints.shartnoma,
      columns: shartnomaColumns,
      service: shartnomaService,
      queryKeys: shartnomaQueryKeys,
      Dialog: ShartnomaDialog,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
