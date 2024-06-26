import { mongoose } from "mongoose"
import { DB_NAME } from "../constants.js"
import { response} from "express"

export  const DBConnection = async ()=>{
    try {
        const conection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log({status:200,message:"Connected to database"})
    } catch (error) {
        console.log({status:500,message:"Error in connecting to database"})
        process.exit(1)
    }
}
