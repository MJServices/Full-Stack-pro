import { app } from "./app.js";
import { DBConnection } from "./db/DbConnection.js";

const port = process.env.PORT || 4000

DBConnection()
.then(db => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
    app.on("error", (err) => {
        console.error({status: 500, message: "Internal Server Error", error: err.message})
        process.exit(1)
    })
})
.catch(err => {
    console.log({status: 500, message: err.message});
})
