import { userModel } from "../models/userModel.js";
import signUpSchema from "../Schemas/signUpSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/customApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/customApiResponse.js";
import bcrypt from "bcryptjs";
import {LoginSchema} from "../Schemas/LoginSchema.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, fullName, email, password, confirmPassword } = req.body;
    let user = {
      username,
      fullName,
      email,
      password,
      confirmPassword
    };
    var validatedUser = await signUpSchema.parse(user);
  } catch (error) {
    throw new ApiError(400, error.errors[0].message, error);
  }
  try {
    let { username, fullName, email, password, confirmPassword } =
      validatedUser;
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    confirmPassword = null;
    const isUsernameUnique = await userModel.findOne({ username });
    if (isUsernameUnique) {
      throw new ApiError(400, "Username already exists");
    }
    const isEmailUnique = await userModel.findOne({ email });
    if (isEmailUnique) {
      throw new ApiError(400, "Email already exists");
    }
    let avatarLocalPath; 
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalPath = req.files.avatar[0].path;
    }
    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar can't be uploaded");
    }
    const createdUser = await userModel({
      username,
      fullName,
      email,
      password,
      avatar: avatar?.url,
      coverImage: coverImage?.url || ""
    });
    await createdUser.save();
    const confirmUser = await userModel
      .findOne(createdUser._id)
      .select("-password -refreshToken");
    if (!confirmUser) {
      throw new ApiError(404, "User creation failed");
    }
    return res.status(201).json(
      new ApiResponse({
        status: 201,
        data: confirmUser,
        success: true,
        message: "User created successfully"
      })
    );
  } catch (err) {
    throw new ApiError(500, err.message, err);
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  let validatedUser;
  try {
    const { username, password, confirmPassword } = req.body;
    const user = {
      username,
      password,
      confirmPassword
    };
    validatedUser = await LoginSchema.parse(user);
  } catch (err) {
    throw new ApiError(err.statusCode, err.errors[0].message, err);
  }  try {
    let { username, password, confirmPassword } = validatedUser;
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    confirmPassword = null;
    const checkUsernameUnique = await userModel.findOne({ username });
    if (!checkUsernameUnique) {
      throw new ApiError(404, "Username not exists");
    }
    const comparedPassword = await bcrypt.compare(
      password,
      checkUsernameUnique.password
    );
    if (!comparedPassword) {
     throw new ApiError(400, "Password is incorrect");
    }
    res.status(200).json(
      new ApiResponse({
        status: 200,
        data: {
          user: checkUsernameUnique
        },
        success: true,
        message: "Login successful"
      })
    );
  } catch (err) {
    throw new ApiError(err.statusCode, err.message, err);
  }
});
