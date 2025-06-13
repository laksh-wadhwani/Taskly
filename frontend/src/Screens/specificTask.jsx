import React, { useEffect, useState } from "react";
import "./specificTask.css"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import editButton from "../assets/edit.svg"
import deleteTask from "../assets/deleteTask.svg"
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendURL } from "../BackendContext";

const SpecificTask = () => {
    
    const API = BackendURL();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const location = useLocation()
    const {taskDetails} = location.state || {};
    const [updateTask, setTask] = useState({
        name: "",
        duration: Date.now(),
        description: ""
    })
    const [status, setStatus] = useState(taskDetails.status);


    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setTask({
            ...updateTask,
            [name]:value
        })
    }


    const TaskDelete = taskID => {
        axios.delete(`${API}/User/DeleteTask/${taskID}`)
        .then(response => {
            if(response.data.message){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    navigate("/Tasks")
                },2500)
                return
            }
            toast.error(response.data.message)
        })
        .catch(error => {
            toast.error(error?.response?.data.message || "Soemthing went wrong...")
            console.error("getting error in deleting task: ",error)
        })
    }

    const TaskEdit = taskId => {
        axios.put(`${API}/User/EditTask/${taskId}`, updateTask)
        .then(response => {
            if(response.data.message === "Task details has updated successfully"){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    navigate(0)
                },2500)
                return
            }
            toast.error(response.data.message)
        })
        .catch(error => {
            toast.error(error?.response?.data.message || "Soemthing went wrong...")
            console.error("getting error in editing task details: ",error)
        })
    }

    const UpdateStatus = taskId => {
        axios.put(`${API}/User/UpdateTaskStatus/${taskId}`)
            .then(response => {
                if(response.data.message === "Task status updated"){
                    toast.success(response.data.message, {autoClose:2500})
                    setTimeout(() => {
                        setStatus(response.data.status);
                    navigate(`/Tasks`)
                    },2500)
                    return
                }
                toast.error(response.data.message);
            })
            .catch(error => {
                toast.error(error?.response?.data.message || "Soemthing went wrong...")
                console.error("Error in updating task status", error);
            });
    };

    const getStatusButtonProps = (status) => {
        switch(status) {
            case "To Do":
                return {
                    text: "Work on it now",
                    className: "status-btn-pending",
                    nextStatus: "In Progress"
                };
            case "In Progress":
                return {
                    text: "Mark as completed",
                    className: "status-btn-inprogress",
                    nextStatus: "Done"
                };
            case "Done":
                return {
                    text: "Task completed",
                    className: "status-btn-completed",
                    disabled: true
                };
            default:
                return {
                    text: "Update Status",
                    className: "status-btn-default"
                };
        }
    };

    return(
        <React.Fragment>

            <Modal open={open} onClose={() => setOpen(false)} center>
                    <div className="task-form">
                        <span>Edit Task</span>
                        <div>
                            <label>Task name</label>
                            <input name="name" value={updateTask.name} type="text" placeholder={taskDetails.name} onChange={handleChange}/>
                        </div>
                        <div>
                            <label>Due Date</label>
                            <input name="duration" value={updateTask.duration} type="date" placeholder={taskDetails.duration} onChange={handleChange}/>
                        </div>
                        <div>
                            <label>Task Description</label>
                            <textarea name="description" value={updateTask.description} type="text" placeholder={taskDetails.description} onChange={handleChange}/>
                        </div>
                        <button className="task-create-btn" onClick={() => TaskEdit(taskDetails._id)}>Edit Task</button>
                    </div>
             </Modal>

            <div className="main-boxx">

                <div className="upper-bar">
                    <div>
                        <h5>Tasks</h5>
                        <span>{taskDetails.name}</span>
                    </div>
                </div>

                <div className="task-view-list">
                    <div className="edit-task">
                        <div className="task-details">
                            <div>
                                <p>{taskDetails.name}</p>
                                <p data-status={taskDetails.status}>{taskDetails.status}</p>
                            </div>
                            <p>{taskDetails.description}</p>
                            <p>{taskDetails.duration}</p>
                            <div>
                                <button 
                                    className={`task-status-btn ${getStatusButtonProps(taskDetails.status).className}`}
                                    onClick={() => UpdateStatus(taskDetails._id)}
                                    disabled={status === "Done"}
                                >
                                    {getStatusButtonProps(taskDetails.status).text}
                                </button>                                
                                <button className="action-buttons" onClick={() => TaskDelete(taskDetails._id)} disabled={status === "Done"}><img src={deleteTask} alt="Delete Button" /></button>
                                <button className="action-buttons" onClick={() => setOpen(true)} disabled={status === "Done"}><img src={editButton} alt="Edit Button" /></button>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SpecificTask