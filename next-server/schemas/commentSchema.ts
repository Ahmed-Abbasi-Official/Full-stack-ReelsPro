import * as z from 'zod/v4'

export const commentSchema = z.object({
    comment:z.string()
    .min(1,"Give me atleast one character")
    .max(30,"comment must be less than 30 words")
})