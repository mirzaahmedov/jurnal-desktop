import { z } from 'zod'

export const MaterialCreateProvodkaFormSchema = z.object({
  responsible_id: z.number().min(1),
  group_jur7_id: z.number().min(1),
  doc_date: z.string().nonempty(),
  iznos_start: z.string().optional(),
  doc_num: z.string().nonempty(),
  name: z.string().nonempty(),
  edin: z.string().nonempty(),
  kol: z.number().gt(0),
  summa: z.number().gt(0),
  inventar_num: z.string().optional(),
  serial_num: z.string().optional(),
  eski_iznos_summa: z.number().optional()
})
export const MaterialCreateFormSchema = z.object({
  data: z.array(MaterialCreateProvodkaFormSchema)
})

export type MaterialCreateProvodkaFormValues = z.infer<typeof MaterialCreateProvodkaFormSchema>
export type MaterialCreateFormValues = z.infer<typeof MaterialCreateFormSchema>

export const defaultValues: MaterialCreateFormValues = {
  data: [
    {
      responsible_id: 0,
      group_jur7_id: 0,
      doc_date: '',
      iznos_start: '',
      doc_num: '',
      name: '',
      edin: '',
      kol: 0,
      summa: 0,
      inventar_num: '',
      serial_num: '',
      eski_iznos_summa: 0
    }
  ]
}
