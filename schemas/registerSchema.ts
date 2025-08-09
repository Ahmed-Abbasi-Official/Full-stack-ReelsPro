import * as z from "zod/v4";
 
export const usernameValidation = z.object({
  username: z.string()
  .min(3,"Username must be atleast 3 characters")
  .max(8,"Username must be no more than 8 characters")
  .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")
  ,
});

export const registerSchema = z.object({
    email:z.string().email({message:"Invalid Email Address"}),
    password:z.string().min(6,"Password must be atleast 6 characters")
})