import { z } from "zod";


const LoginSchema = z.object({
  username: z.string().min(1, {message: "Username can't be empty"}).min(4, {message: "Username must be at 4 characters long"}).max(20, { message: "Username is too long" }).trim(),
  password: z.string().min(1, {message: "Password can't be empty"}).min(8, {message: "Password must be at 8 characters long"}).max(20, { message: "Password is too long" }).trim(),
  confirmPassword: z.string().min(1, {message: "Confirm Password can't be empty"}).min(8, {message: "Password must be at 8 characters long"}).max(20, { message: "Password is too long" }).trim(),
});

export {LoginSchema};
