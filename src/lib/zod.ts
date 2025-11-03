import { object, string } from "zod"
 
export const signInSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
})

export const signUpSchema = object({
  name: string().min(1, "Name is required"),
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    
})