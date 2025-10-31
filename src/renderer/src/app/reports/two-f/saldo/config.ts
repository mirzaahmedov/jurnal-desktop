import { z } from 'zod'

export const TwoFSaldoFormSchema = z.object({
  year: z.number(),
  smetas: z.array(
    z.object({
      smeta_id: z.number(),
      smeta_number: z.string(),
      jur3a_akt_avans: z.number(),
      jur1_jur2_rasxod: z.number(),
      bank_prixod: z.number()
    })
  )
})
export type TwoFSaldoFormValues = z.infer<typeof TwoFSaldoFormSchema>
