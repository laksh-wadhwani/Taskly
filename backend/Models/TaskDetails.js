const mongoose = require("mongoose")

const TaskDetailsSchema = new mongoose.Schema({
    taskId: {type: mongoose.Schema.Types.ObjectId, ref:'Tasks'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    task_description: String,
    date: Date,
    attachment: String
})

const TaskDetailsModel = mongoose.model("TaskDetails", TaskDetailsSchema)

module.exports = TaskDetailsModel;