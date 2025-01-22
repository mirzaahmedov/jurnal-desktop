import type { ColumnDef } from '@/common/components'
import type { MO7Rasxod } from '@/common/models'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

const queryKeys = {
  getAll: 'jur7_rasxod/all',
  get: 'jur7_rasxod/get',
  create: 'jur7_rasxod/create',
  update: 'jur7_rasxod/update',
  delete: 'jur7_rasxod/delete'
}

const defaultValues: RasxodFormType = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  opisanie: '',
  doverennost: '',
  kimdan_id: 0,
  childs: [
    {
      naimenovanie_tovarov_jur7_id: 0,
      kol: 0,
      sena: 0,
      summa: 0,
      debet_schet: '',
      debet_sub_schet: '',
      kredit_schet: '',
      kredit_sub_schet: '',
      data_pereotsenka: ''
    }
  ]
}

const RasxodChildFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.number(),
    kol: z.number(),
    sena: z.number(),
    summa: z.number().min(1),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    data_pereotsenka: z.string()
  })
)
const RasxodFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    doverennost: z.string().optional(),
    kimdan_id: z.number(),
    childs: z.array(RasxodChildFormSchema)
  })
)
type RasxodFormType = z.infer<typeof RasxodFormSchema>
type RasxodChildFormType = z.infer<typeof RasxodChildFormSchema>

const columns: ColumnDef<MO7Rasxod>[] = [
  {
    key: 'doc_num',
    header: '№ документа'
  },
  {
    key: 'doc_date',
    header: 'Дата документа',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'kimdan_name',
    header: 'Кимдан'
  },
  {
    key: 'kimga_name',
    header: 'Кимга'
  },
  {
    numeric: true,
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описание'
  }
]

export { queryKeys, defaultValues, columns, RasxodFormSchema, RasxodChildFormSchema }
export type { RasxodFormType, RasxodChildFormType }
