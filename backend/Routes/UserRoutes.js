const express = require("express");
const router = express.Router();

const { Signup, Login, AddTask, GetTasks, DeleteTask, EditTask, UpdateTaskStatus } = require("../Controllers/UserController");

router.post("/Signup", Signup)
router.post("/Login", Login)
router.post("/AddTask/:userId", AddTask)
router.get("/GetTasks/:id", GetTasks)
router.delete("/DeleteTask/:id", DeleteTask)
router.put("/EditTask/:id", EditTask)
router.put("/UpdateTaskStatus/:id", UpdateTaskStatus)

module.exports = router