const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://taskly-frontend-ochre.vercel.app",
      "http://localhost:5173"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
}));
app.options("*", cors()); // enable pre-flight for all routes
app.use(bodyParser.json())

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
