import { z } from "zod";

const signUpSchema = z.object({
  username: z.string().min(4, {message: "Must be at 4 characters long"}).max(20, { message: "Username is too long" }).trim(),
  fullName: z.string().min(4, {message: "Must be at 4 characters long"}).max(20, { message: "FullName is too long" }).trim(),
  email: z.string().email().min(6, {message: "Must be at 6 characters long"}).max(20, { message: "Email is too long" }).trim(),

  password: z.string().min(6, {message: "Must be at 6 characters long"}).max(20, { message: "Email is too long" }).trim(),
  avatar: z.string()
});

export default signUpSchema;
