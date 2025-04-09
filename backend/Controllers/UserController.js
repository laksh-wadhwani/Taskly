const TaskModel = require("../Models/Tasks");
const UserModel = require("../Models/User");
const { EncryptPassword, DecryptPassword } = require("../utils/hash");

const Signup = async(request, response) => {
    const {fullname, email, password} = request.body;
    const securePass = await EncryptPassword(password)
    const newUser = new UserModel({fullname, email, password:securePass})
    const userCheck = await UserModel.findOne({email})
    try {
        if(!(fullname && email && password))
            return response.status(400).send({message: "All fields are required"})
            
        if(userCheck)
            return response.status(409).send({message: "User already registered"})  

        await newUser.save();
        return response.status(201).send({message: "You are registered successfully"})
    } 
    catch (error) {
        console.log("Getting error in posting user: ", error)
        return response.status(500).send({message: "Internal Server Error"})    
    }
}

const Login = async(request, response) => {
    const {email, password} = request.body
    const userCheck = await UserModel.findOne({email})

    try{
        if(!(email && password))
            return response.status(400).send({message: "Enter your credentials"})
        if(!userCheck)
            return response.status(404).send({message: "You are not registered with us please register first"})
        
        const passwordMatch = await DecryptPassword(password, userCheck.password)
        if(!passwordMatch)
            return response.status(401).send({message: "Invalid password"})

        return response.status(200).send({
            message: "Login successfull",
            user: userCheck
        })
    }
    catch(error){
        console.error("Error in logging in", error)
        return response.status(500).send({message: "Internal Server Error"})
    }
}

const AddTask = async(request, response) => {
    const {userId} = request.params;
    const {name, duration, description} = request.body;
    const newTask = new TaskModel({userId, name, duration, description})
    const taskCheck = await TaskModel.findOne({userId, name})

    try {
        if(!(name && duration && description))
            return response.status(400).send({message: "All fields are required"})
        if(taskCheck)
            return response.status(409).send({message: "Task Already Exist"})

        await newTask.save();
        return response.status(200).send({message: "Task has been added successfully"})
    } 
    catch (error) {
        console.error("Getting error in adding task: ",error)
        return response.status(500).send({message: "Internal Server Error"})
    }
}

const GetTasks = async (request, response) => {
    const userId = request.params.id;
    try {
        const tasks = await TaskModel.find({ userId });

        const formattedTasks = tasks.map(task => {
            const formattedDate = new Date(task.duration).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            return {
                ...task.toObject(),
                duration: formattedDate
            };
        });

        return response.status(200).send(formattedTasks);
    } catch (error) {
        console.error("Getting error in fetching tasks details: ", error);
        return response.status(500).send({ message: "Internal Server Error" });
    }
};

const DeleteTask = async(request, response) => {
    const taskId = request.params.id;
    const deletePackage = await TaskModel.findByIdAndDelete({_id:taskId})
    try{
        if(deletePackage)
            return response.status(200).send({message: "Task has deleted successfully"})

        return response.status(404).send({message: "Task not found"})
    }
    catch(error){
        console.error("Getting error in deleting task")
        return response.status(500).send({message: "Internal Server Error"})
    }
}

const EditTask =  async(request, response) => {
    const taskId = request.params.id;
    const {name, duration, description} = request.body;
    const taskCheck = await TaskModel.findById({_id:taskId})
    try{
        if(!name || !duration || !description)
            return response.send({message: "Atleast fill one field"})

        if(!taskCheck)
            return response.status(404).send({message: "Task not found"})
        
        if(name) taskCheck.name = name
        if(duration) taskCheck.duration = duration
        if(description) taskCheck.description = description

        await taskCheck.save();
        return response.status(200).send({message: "Task details has updated successfully"})
       
    }
    catch(error){
        console.log("Getting error in updating task details")
        return response.status(500).send({message: "Internal Server Error"})
    }
}

const UpdateTaskStatus = async (request, response) => {
    const taskId = request.params.id;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return response.status(404).send({ message: "Task not found" });
        }

        if (task.status === "To Do") {
            task.status = "In Progress";
        } else if (task.status === "In Progress") {
            task.status = "Done";
        }

        await task.save();
        return response.status(200).send({ message: "Task status updated", status: task.status });
    } catch (error) {
        console.error("Error in updating task status", error);
        return response.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = {Signup, Login, AddTask, GetTasks, DeleteTask, EditTask, UpdateTaskStatus}