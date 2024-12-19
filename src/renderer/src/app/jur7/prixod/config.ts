import type { ColumnDef } from '@/common/components'
import type { MO7Prixod } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

const queryKeys = {
  getAll: 'jur7_prixod/all',
  get: 'jur7_prixod/get',
  create: 'jur7_prixod/create',
  update: 'jur7_prixod/update',
  delete: 'jur7_prixod/delete'
}

const defaultValues: PrixodFormType = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  j_o_num: '',
  opisanie: '',
  doverennost: '',
  kimdan_id: 0,
  kimga_id: 0,
  id_shartnomalar_organization: 0,
  childs: [
    {
      naimenovanie_tovarov_jur7_id: 0,
      kol: 0,
      sena: 0,
      summa: 0,
      iznos: false,
      debet_schet: '',
      debet_sub_schet: '',
      kredit_schet: '',
      kredit_sub_schet: '',
      data_pereotsenka: ''
    }
  ]
}

const PrixodChildFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.number(),
    kol: z.number(),
    sena: z.number(),
    summa: z.number(),
    iznos: z.boolean(),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    data_pereotsenka: z.string()
  })
)
const PrixodFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    j_o_num: z.string(),
    opisanie: z.string().optional(),
    doverennost: z.string().optional(),
    kimdan_id: z.number(),
    kimga_id: z.number(),
    id_shartnomalar_organization: z.number().optional(),
    childs: z.array(PrixodChildFormSchema)
  })
)
type PrixodFormType = z.infer<typeof PrixodFormSchema>
type PrixodChildFormType = z.infer<typeof PrixodChildFormSchema>

const columns: ColumnDef<MO7Prixod>[] = [
  {
    key: 'doc_num',
    header: '№ документа'
  },
  {
    key: 'doc_date',
    header: 'Дата документа'
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
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описание'
  }
]

export { queryKeys, defaultValues, columns, PrixodFormSchema, PrixodChildFormSchema }
export type { PrixodFormType, PrixodChildFormType }
