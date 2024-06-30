import { z } from "zod";

const signUpSchema = z.object({
  username: z.string().min(4, {message: "Username must be at 4 characters long"}).min(0, {message: "Username can't be empty"}).max(20, { message: "Username is too long" }).trim(),
  fullName: z.string().min(4, {message: "FullName be at 5 characters long"}).min(0, {message: "FullName can't be empty"}).max(20, { message: "FullName is too long" }).trim(),
  email: z.string().email().min(6, {message: "Email must be at 6 characters long"}).min(0, {message: "Email can't be empty"}).max(50, { message: "Email is too long" }).trim(),

  password: z.string().min(8, {message: "Password must be at 8 characters long"}).min(0, {message: "Username can't be empty"}).max(20, { message: "Password is too long" }).trim(),
  confirmPassword: z.string().min(8, {message: "Password must be at 8 characters long"}).min(0, {message: "Username can't be empty"}).max(20, { message: "Password is too long" }).trim(),
});

export default signUpSchema;
