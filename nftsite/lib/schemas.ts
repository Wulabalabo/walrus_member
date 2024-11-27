import * as z from "zod"

export const joinFormSchema = z.object({
  link: z.string().url({
    message: "Please enter a valid URL.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
})

export type JoinFormValues = z.infer<typeof joinFormSchema> 
