import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/videoModel.js";
import { userModel } from "../models/userModel.js";
import { ApiError } from "../utils/customApiError.js";
import { ApiResponse } from "../utils/customApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    const videos = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Schema.Types.ObjectId(userId),
          pipeline: [
            {
              $lookup: {
                from: "user",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
              }
            }
          ]
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          createdAt: 1,
          published: 1,
          owner: {
            $arrayElemAt: ["$owner", 0]
          }
        }
      }
    ]);
    res
      .status(200)
      .json(
        new ApiResponse(200, videos, true, "All videos fetched successfully")
      );
  } catch (error) {
    throw new ApiError(error.status, error.message, false);
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if (title.length < 5 || description.length < 5) {
      throw new ApiError(400, "Title and description should be long");
    }
    let thumbnailLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      thumbnailLocalPath = req.files.thumbnail[0].path;
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail can't be uploaded");
    }
    let videoLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
    ) {
      videoLocalPath = req.files.videoFile[0].path;
    }
    if (!videoLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    if (!videoFile) {
      throw new ApiError(400, "Thumbnail can't be uploaded");
    }
    let duration;
    ffmpeg.ffprobe(videoLocalPath, async (err, metadata) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      duration = metadata.format.duration;
      console.log(videoLocalPath);
      // Save video information to the database
      const newVideo = await Video.create({
        videoFile: videoFile?.url,
        duration: duration,
        title,
        description,
        owner: new mongoose.Schema.Types.ObjectId(req.user._id),
        thumbnail: thumbnail?.url,
        isPublished: true
      });
      newVideo.save((err, savedVideo) => {
        if (err) {
          throw new ApiError(500, err.message, false);
        }
        res
          .status(200)
          .json(
            new ApiResponse(200, savedVideo, true, "Video created successfully")
          );
      });
    });
  } catch (error) {
    throw new ApiError(error.status, error.message, false);
  }
});

const getVideoById = asyncHandler(async (req, res) => {
 try {
     const { videoId } = req.params;
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Schema.Types.ObjectId(videoId)
      },
      pipeline: [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
          }
        }
      ]
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        createdAt: 1,
        isPublished: 1,
        owner: {
          $arrayElemAt: ["$owner", 0]
        }
      }
    }
  ]);
  res.status(200).json(new ApiResponse(200, video, true, "Video fetched successfully"));
 } catch (error) {
    throw new ApiError(error.status, error.message, false);
 }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
