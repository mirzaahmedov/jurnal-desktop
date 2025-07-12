import { z } from "zod";

export const BankCardFormSchema = z.object({
    bank: z.string().nonempty(),
    cardNumber: z.string().min(16).max(16),
    cardHolder: z.string().min(2).max(100),
})
export type BankCardFormValues = z.infer<typeof BankCardFormSchema>;

export const defaultValues: BankCardFormValues = {
    bank: '',
    cardNumber: '',
    cardHolder: '',
}