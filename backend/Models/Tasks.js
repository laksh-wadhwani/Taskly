const mongoose = require('mongoose')

const TasksSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    name: String,
    duration: Date,
    description: String,
    status: {type: String, default:"To Do"}
})

const TaskModel = new mongoose.model("Tasks", TasksSchema)

module.exports = TaskModel