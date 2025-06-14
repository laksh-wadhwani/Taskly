const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer")

const { Signup, Login, AddTask, GetTasks, DeleteTask, EditTask, UpdateTaskStatus, UploadProfile } = require("../Controllers/UserController");

router.post("/Signup", Signup)
router.put("/UploadProfile/:email", upload.single("Profile"), UploadProfile)
router.post("/Login", Login)
router.post("/AddTask/:userId", AddTask)
router.get("/GetTasks/:id", GetTasks)
router.delete("/DeleteTask/:id", DeleteTask)
router.put("/EditTask/:id", EditTask)
router.put("/UpdateTaskStatus/:id", UpdateTaskStatus)

module.exports = router