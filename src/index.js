import { app } from "./app.js";
import { DBConnection } from "./db/DbConnection.js";


DBConnection()
.then(db => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch(err => {
    console.log({status: 500, message: err.message});
})
