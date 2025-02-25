import { z } from 'zod'

export const IznosProductFormSchema = z.object({
  id: z.number(),
  name: z.string().optional().nullable(),
  group_name: z.string().optional().nullable(),
  iznos_foiz: z.number().optional().nullable(),
  inventar_num: z.string(),
  serial_num: z.string(),
  eski_iznos_summa: z.coerce.number(),
  iznos_summa: z.coerce.number(),
  summa: z.coerce.number(),
  year: z.number(),
  month: z.number(),
  kol: z.number(),
  sena: z.number(),
  new_summa: z.coerce.number(),
  responsible_id: z.number()
})
export const IznosFormSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  products: z.array(IznosProductFormSchema)
})
export type IznosProductFormValues = z.infer<typeof IznosProductFormSchema>
export type IznosFormValues = z.infer<typeof IznosFormSchema>

export const defaultValues: IznosFormValues = {
  year: 2025,
  month: 2,
  products: [
    {
      id: 0,
      eski_iznos_summa: 0,
      iznos_summa: 0,
      summa: 0,
      new_summa: 0,
      name: '',
      kol: 0,
      sena: 0,
      year: 0,
      month: 0,
      group_name: '',
      iznos_foiz: 0,
      responsible_id: 0,
      serial_num: '',
      inventar_num: ''
    }
  ]
}
