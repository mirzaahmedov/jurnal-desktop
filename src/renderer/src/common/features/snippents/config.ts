import { z } from 'zod'

export const SnippetSchema = z.object({
  name: z.string().nonempty(),
  content: z.string().nonempty()
})
export type Snippet = z.infer<typeof SnippetSchema>

export const defaultValues: Snippet = {
  name: '',
  content: ''
}
