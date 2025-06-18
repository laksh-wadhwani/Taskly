const mongoose = require('mongoose')

const TasksSchema = new mongoose.Schema({
    admin_userid: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    name: String,
    duration: Date,
    description: String,
    status: {type: String, default:"To Do"},
    shared_users: [{
        userID: {type: mongoose.Schema.Types.ObjectId, ref:'users'}
    }]
})

const TaskModel = new mongoose.model("Tasks", TasksSchema)

module.exports = TaskModel