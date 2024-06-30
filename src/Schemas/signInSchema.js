import { z } from "zod";

let credentials = username || email;

const signUpSchema = z.object({
  credentials: z.string().min(4, {message: "Username must be at 4 characters long"}).min(0, {message: "Username can't be empty"}).max(50, { message: "Username is too long" }).trim(),
  password: z.string().min(8, {message: "Password must be at 8 characters long"}).min(0, {message: "Username can't be empty"}).max(20, { message: "Password is too long" }).trim(),
  confirmPassword: z.string().min(8, {message: "Password must be at 8 characters long"}).min(0, {message: "Username can't be empty"}).max(20, { message: "Password is too long" }).trim(),
});

export default signUpSchema;
