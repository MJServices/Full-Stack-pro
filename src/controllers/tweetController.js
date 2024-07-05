import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweetModel.js"
import {userModel} from "../models/userModel.js"
import {ApiError} from "../utils/customApiError.js"
import {ApiResponse} from "../utils/customApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
