import { userModel } from "../models/userModel.js";
import signUpSchema from "../Schemas/signUpSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/customApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/customApiResponse.js"

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
    confirmPassword = null
    const isUsernameUnique = await userModel.findOne({ username });
    if (isUsernameUnique) {
      return res.status(400).json(ApiError(400, "Username already exists"));
    }
    const isEmailUnique = await userModel.findOne({ email });
    if (isEmailUnique) {
      return res.status(400).json(ApiError(400, "Email already exists"));
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }
    console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage  = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
      throw new ApiError(400, "Avatar can't be uploaded")
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
    const confirmUser = await userModel.findOne( createdUser._id ).select("-password -refreshToken");
    if(!confirmUser){
      throw new ApiError(404, "User creation failed")
    }
    return res.status(201).json(
      new ApiResponse({
        status: 201,
        data: confirmUser,
        success: true,
        message: "User created successfully",
      })
    );
  } catch (err) {
    throw new ApiError(500, err.message, err);
  }
});
