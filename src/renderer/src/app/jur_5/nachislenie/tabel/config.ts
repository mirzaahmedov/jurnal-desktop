import { z } from "zod";

export const TabelProvodkaFormSchema = z.object({
    mainZarplataId: z.number(),
    rabDni: z.number(),
    otrabDni: z.number(),
    noch: z.number(),
    prazdnik: z.number(),
    pererabodka: z.number(),
    kazarma: z.number()
})
export const TabelFormSchema = z.object({
    spravochnikBudjetNameId: z.number(),
    mainSchetId: z.number(),
    tabelYear: z.number(),
    tabelMonth: z.number(),
    docNum: z.number(),
    docDate: z.string(),
    tabelChildren: z.array(TabelProvodkaFormSchema)
});
export type TabelFormValues = z.infer<typeof TabelFormSchema>;
export type TabelProvodkaFormValues = z.infer<typeof TabelProvodkaFormSchema>;

export const defaultValues: TabelFormValues = {
    spravochnikBudjetNameId: 0,
    mainSchetId: 0,
    tabelYear: 0,
    tabelMonth: 0,
    docNum: 0,
    docDate: "",
    tabelChildren: [
        {
            mainZarplataId: 0,
            rabDni: 0,
            otrabDni: 0,
            noch: 0,
            prazdnik: 0,
            pererabodka: 0,
            kazarma: 0
        }
    ]
}