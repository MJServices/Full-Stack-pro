import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json({
  limit: "16kb",
}))
app.use(express.urlencoded({
  limit: "16kb",
  extended: true,
}))
app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

// import routes
import userRouter from "./routes/userRoutes.js"

// routes declaration
app.use("/api/users", userRouter)

export {app}