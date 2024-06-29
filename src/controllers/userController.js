import { userModel } from "../models/userModel.js";
import signUpSchema from "../Schemas/signUpSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/customApiError.js";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req, res) => {
  try {
  const { username, fullName, email, password, avatar } = await req.body;
  let user = {
    username,
    fullName,
    email,
    password,
    avatar
  };
  var validatedUser = signUpSchema.parse(user);
  } catch (error) {
   throw new ApiError(400, error.errors[0].message, error);
  }
  try {
    const { username, fullName, email, password, avatar } = validatedUser;
    const isUsernameUnique = await userModel.findOne({ username });
    if (isUsernameUnique) {
      return res.status(400).json(ApiError(400, "Username already exists"));
    }
    const isEmailUnique = await userModel.findOne({ email });
    if (isEmailUnique) {
      return res.status(400).json(ApiError(400, "Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      avatar
    });
    await createdUser.save();
    return res.status(200).json(createdUser);
  } catch (err) {
    throw new ApiError(500, "User Creation Failed", err);
  }
});
