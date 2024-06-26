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

app.get("/", (req, res) => {
    res.send("Hello World!")
})

export {app}