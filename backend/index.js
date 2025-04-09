const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express();
app.use(bodyParser.json())
app.use(cors())
dotenv.config()

mongoose.connect(process.env.DB_URL)
.then(() => {
    app.listen(process.env.PORT, () => console.log("Server is connected and Connected to MongoDB"))
})
.catch(error => console.log("Unable to connect Server and/or MongoDB", error))

//Default Route
app.get("/", (request, response) => {
    response.json("Backend is working....")
})

//User Routes
const UserRoutes = require("./Routes/UserRoutes")
app.use("/User", UserRoutes)