import { userModel } from "../models/userModel.js";
import signUpSchema from "../Schemas/signUpSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/customApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/customApiResponse.js";
import bcrypt from "bcryptjs";
import { LoginSchema } from "../Schemas/LoginSchema.js";
import jwt from "jsonwebtoken";

export const generateRefreshAndAccessToken = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return {
    accessToken,
    refreshToken
  };
};

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
  }
  try {
    let { username, password, confirmPassword } = validatedUser;
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    confirmPassword = null;
    const checkUsernameUnique = await userModel
      .findOne({ username })
      .select("-password -refreshToken");
    if (!checkUsernameUnique) {
      throw new ApiError(404, "Username not exists");
    }
    const user = await userModel.findOne({ username });
    const comparedPassword = await user.checkPassword(password);
    console.log(comparedPassword);
    if (!comparedPassword) {
      throw new ApiError(401, "Password is incorrect");
    }
    const tokens = await generateRefreshAndAccessToken(user._id);
    const { accessToken, refreshToken } = tokens;
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true
      })
      .json(
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

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const data = req.user;
    if (!data) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await userModel.findByIdAndUpdate(
      data._id,
      {
        $set: {
          refreshToken: undefined
        }
      },
      {
        new: true
      }
    );
    const options = {
      httpOnly: true,
      secure: true
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse({
          status: 200,
          data: {
            user
          },
          success: true,
          message: "Logout successful"
        })
      );
  } catch (error) {}
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const webrefreshToken = req.cookies.refreshToken;
    const token = jwt.verify(
      "refreshToken",
      webrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await userModel.findOne({ _id: token._id });
    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }
    if (webrefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expiered either used");
    }
    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
      user._id
    );
    const options = {
      httpOnly: true,
      secure: true
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse({
          status: 200,
          data: null,
          success: true,
          message: "Successfully new token created"
        })
      );
  } catch (error) {
    throw new ApiError(400, error.message, error);
  }
});

export const updateCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { password, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(401, "New password doesn't match");
    }
    const user = req.user;
    const cheackedPass = await user.checkPassword(password);
    if (!cheackedPass) {
      throw new ApiError(401, "Invalid Password");
    }
    user.password = cheackedPass;
    user.save({ validateBeforeSave: false });
  } catch (err) {
    throw new ApiError(err.status, err.message);
  }
});
