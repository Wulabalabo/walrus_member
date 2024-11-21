import * as z from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const eventFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.union([
    z.string().url({
      message: "Please enter a valid URL.",
    }),
    z.custom<File>()
      .refine((file) => file instanceof File, "Please upload a file.")
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  ]),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export type EventFormValues = z.infer<typeof eventFormSchema> 