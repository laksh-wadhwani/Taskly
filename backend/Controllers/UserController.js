const { request, response } = require("express");
const TaskModel = require("../Models/Tasks");
const UserModel = require("../Models/User");
const {uploadToCloudinary} = require("../utils/cloudinary")
const { EncryptPassword, DecryptPassword } = require("../utils/hash");
const GenerateOTP = require("../utils/OTP");
const transporter = require("../Middleware/Mail");

const Signup = async(request, response) => {
    const {fullname, email, password} = request.body;
    const OTP = GenerateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
    const securePass = await EncryptPassword(password)
    const newUser = new UserModel({fullname, email, password:securePass, OTP, otpExpiry})
    const userCheck = await UserModel.findOne({email})
    try {
        if(!(fullname && email && password))
            return response.status(400).send({message: "All fields are required"})
            
        if(userCheck)
            return response.status(409).send({message: "User already registered"}) 
        
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "Your OTP for Taskly",
            text: `Your OTP is ${OTP}`
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error) console.log("Error in sending OTP"+error)
            else console.log("OTP Sent: "+OTP)
        })
        await newUser.save();

        setTimeout(async() => {
            const user = await UserModel.findOne({email})
            if(user && user.isVerified===false){
                await UserModel.findOneAndDelete({email})
                console.log("User deleted due to otp expiration")
            }
        },otpExpiry - Date.now())

        return response.status(201).send({message: "Please enter your OTP to get registered. We have sent it to your email."})
    } 
    catch (error) {
        console.log("Getting error in posting user: ", error)
        return response.status(500).send({message: "Internal Server Error"})    
    }
}

const VerifyOTP = async(request, response) => {
    const {email, finalOtp} = request.body
    const userCheck = await UserModel.findOne({email})
    try{
        if(!userCheck)
            return response.send("User doesn't exist")
        else{
            if(userCheck.OTP===finalOtp){
                userCheck.OTP = null;
                userCheck.otpExpiry = null
                userCheck.isVerified = true
                await userCheck.save();
                return response.send({message:"User has been registered successfully"})
            }

            await userCheck.findOneAndDelete({email})
            return response.send({message: "You entered wrong OTP"})
        }
    }
    catch{
        console.log("Getting error in verifying OTP: ",error)
        return response.send({message: "Internal Server Error"})
    }
}

const UploadProfile = async(request, response) => {
    const {email} = request.params
    const profile = await uploadToCloudinary(request?.file.buffer)
    const userCheck = await UserModel.findOne({email})
    try{
        if(!userCheck)
            return response.send({message: "User doesn't exist"})
        else{
            if(profile) userCheck.profile = profile
            await userCheck.save();
            return response.send({message: "Profile Picture Uploaded", user:userCheck})
        }

    }catch(error){
        response.send({message: "Internal Server Error"})
        return console.log("Error in uploading picture: ", error)
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
    const {name, duration, description, sharedWith} = request.body;
    const shared_users = (sharedWith || []).map(userID => ({ userID }))
    const newTask = new TaskModel({admin_userid:userId, name, duration, description, shared_users})
    const taskCheck = await TaskModel.findOne({admin_userid:userId, name})

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
        const owned = await TaskModel.find({ admin_userid:userId });
        const shared = await TaskModel.find({"shared_users.userID":userId})
        const tasks = [...owned, ...shared]

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

const SearchUser = async(request, response) => {
    const {query, email} = request.query
    const users = await UserModel.find({
        fullname: {$regex: query, $options: 'i'},
        email: { $ne: email }
    }).select("fullname email profile")
    response.send(users)
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

module.exports = {Signup, Login, AddTask, GetTasks, DeleteTask, EditTask, UpdateTaskStatus, UploadProfile, VerifyOTP, SearchUser}