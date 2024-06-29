import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res)=>{
    const {username, email, password} = await req.body
    res.status(200).json({username, email, password})
})