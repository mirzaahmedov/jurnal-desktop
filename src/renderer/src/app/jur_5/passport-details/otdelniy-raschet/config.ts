import { z } from "zod";

export const OtdelniyRaschetFormSchema = z.object({
    prikazNum: z.string().nonempty(),
    prikazDate: z.string().nonempty(),
    opisanie: z.string().nonempty(),
    forMonth: z.string().nonempty(),
    forYear: z.string().nonempty(),
    summa: z.number().min(1),
    mainZarplataId: z.number().int().positive(),
    vacantId: z.number().int().positive()
})
export type OtdelniyRaschetFormValues = z.infer<typeof OtdelniyRaschetFormSchema>

export const defaultValues: OtdelniyRaschetFormValues = {
    prikazNum: '',
    prikazDate: '',
    opisanie: '',
    forMonth: '',
    forYear: '',
    summa: 0,
    mainZarplataId: 0,
    vacantId: 0
}