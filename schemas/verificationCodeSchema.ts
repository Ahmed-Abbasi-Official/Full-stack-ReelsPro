import * as z from 'zod/v4'

export const verificationSchema = z.object({
    code:z.string()
    .min(6,"Code must be 6 digits")
})