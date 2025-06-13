import React, { useEffect, useState } from "react";
import "./task.css"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import viewtask from "../assets/viewtask.svg"
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendURL } from "../BackendContext";

const Tasks = ({user}) => {
    
    const API = BackendURL();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [taskDetails, setDetails] = useState([])
    const [task, setTask] = useState({
        name: "",
        duration : Date.now(),
        description :""
    })

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setTask({
            ...task,
            [name]:value
        })
    }

    const CreateTask = () => {
        axios.post(`${API}/User/AddTask/${user._id}`, task)
        .then(response => {
            if(response.data.message === "Task has been added successfully"){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    navigate(0)
                },2500)
                return
            }
            toast.err(response.data.message)
        })
        .catch(error => {
            toast.error(error?.response?.data.message || "Soemthing went wrong...")
            console.error("Getting error in adding task: ", error)
        })
    }

    const ViewTask = task => {
        navigate(
            `/SpecificTask/${task._id}`,
            {state: {taskDetails: task}}
        )
    }

    useEffect(() => {
        axios.get(`${API}/User/GetTasks/${user._id}`)
        .then(response => { setDetails(response.data)})
        .catch(err => console.error(err));
    }, [user._id]);

    return(
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)} center>
                <div className="task-form">
                    <span>Create Task</span>
                    <div>
                        <label>Task name</label>
                        <input name="name" value={task.name} type="text" onChange={handleChange} />
                    </div>
                    <div>
                        <label>Due Date</label>
                        <input name="duration" value={task.duration} type="date" onChange={handleChange} />
                    </div>
                    <div>
                        <label>Task Description</label>
                        <textarea name="description" value={task.description} type="text" placeholder="type your content here" onChange={handleChange} />
                    </div>
                    <button className="task-create-btn" onClick={CreateTask}>Create Task</button>
                </div>
            </Modal>


            <div className="main-boxx">

                <div className="upper-bar">
                    <div>
                        <h5>Tasks</h5>
                        <span>Your tasks in your space</span>
                    </div>
                    <button onClick={() => setOpen(true)} className="task-create-btn">Create Task</button>
                </div>

                <div className="tasks-list">

                    {taskDetails.map((task, index) => (
                        <div className="task" key={task._id}>
                            <div>
                                <span>T-{index+1}</span>
                                <p>{task.status}</p>
                            </div>
                            <p>{task.name}</p>
                            <button onClick={() => ViewTask(task)}>
                                View Task
                                <img src={viewtask} alt="task view" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Tasks