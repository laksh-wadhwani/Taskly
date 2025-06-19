const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer")

const { Signup, Login, AddTask, GetTasks, DeleteTask, EditTask, UpdateTaskStatus, UploadProfile, VerifyOTP, SearchUser, GetTaskDetails, GetSingleTask, CompleteTask, UpdateUser } = require("../Controllers/UserController");

router.post("/Signup", Signup)
router.put("/VerifyOTP", VerifyOTP)
router.put("/UploadProfile/:email", upload.single("Profile"), UploadProfile)
router.post("/Login", Login)
router.put("/UpdateUser/:id", UpdateUser)
router.post("/AddTask/:userId", AddTask)
router.get("/GetTasks/:id", GetTasks)
router.delete("/DeleteTask/:id", DeleteTask)
router.put("/EditTask/:id", EditTask)
router.get("/SearchUser", SearchUser)
router.post("/UpdateTaskStatus/:taskId/:userId", upload.single("Attachment"), UpdateTaskStatus)
router.get("/GetTaskDetails/:id", GetTaskDetails)
router.get("/GetSingleTask/:id", GetSingleTask)
router.put("/CompleteTask/:id", CompleteTask)

module.exports = router