import {v2 as cloudinary} from "cloudinary"
import { ApiError } from "./customApiError";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileLinkForUpload)=>{
    try {
        if(!fileLinkForUpload){
            throw new ApiError(500, "Can't find image for upload")
        }
        const res = await cloudinary.uploder.upload(fileLinkForUpload, {
            resource_type: "auto"
        })
        return res
    } catch (error) {
        fs.unlinkSync(fileLinkForUpload)
        return null
    }
}

export {uploadOnCloudinary}