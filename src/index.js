import { DBConnection } from "./db/DbConnection.js";
import express from "express"
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`)
})
await DBConnection()