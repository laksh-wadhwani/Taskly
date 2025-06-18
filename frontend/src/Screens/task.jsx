import React, { useEffect, useState } from "react";
import "./task.css"
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import viewtask from "../assets/viewtask.svg"
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendURL } from "../BackendContext";
import NoTask from "../assets/notask.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Tasks = ({user}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [shareTask, setShareTask] = useState(false)
    const [taskDetails, setDetails] = useState([])
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [task, setTask] = useState({
        name: "",
        duration : Date.now(),
        description :""
    })

    const getStatusCounts = () => {
        const counts = {
            AllTasks: taskDetails.length,
            "To Do": taskDetails.filter(task => task.status === "To Do").length,
            "In Progress": taskDetails.filter(task => task.status === "In Progress").length,
            "Done": taskDetails.filter(task => task.status === "Done").length
        }
        return counts
    }

    const [activeFilter, setActiveFilter] = useState("AllTasks");

    const filteredTasks = taskDetails.filter(task => {
        if (activeFilter === "AllTasks") return true;
        if (activeFilter === "Pending") return task.status === "To Do";
        if (activeFilter === "Completed") return task.status === "Done";
        return task.status === activeFilter;
    });

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setTask({
            ...task,
            [name]:value
        })
    }

    const CreateTask = () => {
        const payload = {
            ...task,
            sharedWith: selectedUsers.map(u => u._id)
        }
        axios.post(`${API}/User/AddTask/${user._id}`, payload)
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

    const SearchUsers = eventTriggered => {
        const value = eventTriggered.target.value
        setSearchQuery(value)

        if(value.length >=  2){
            axios.get(`${API}/User/SearchUser?query=${value}&email=${user.email}`)
            .then(response => setSuggestions(response.data))
        }
        else{
            setSuggestions([])
        }
    }

    const SelectUsers = user => {
        setSelectedUsers(prev => {
            const alreadySelected = prev.find(u => u.email === user.email)
            if(alreadySelected)
                return prev.filter(u => u.email !== user.email)
            return [...prev, user]
        })
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
                    {shareTask? 
                    <>
                    <span>Share Task</span>
                    <div>
                        <label>Name or Email of User to Share Task</label>
                        <input type="search" placeholder="Enter Name or Email" value={searchQuery} onChange={SearchUsers} />
                    </div>
                    
                    <div id="render-users">
                        {suggestions.length > 0 && (
                            suggestions.map(data => (
                                <div key={data._id} onClick={() => SelectUsers(data)}>
                                    <img src={data.profile} alt="User Profile" />
                                    <div>
                                        <h5>{data.fullname}</h5>
                                        <span>{data.email}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div id="selected-users">
                        {selectedUsers.length > 0 && (
                            selectedUsers.map(user => (
                                <img src={user.profile} alt="Selected User Profile" />
                            ))
                        )}
                    </div>
                    </>
                    :
                    <>
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
                    </>
                    }
                    <div className="task-share">
                        <label>Do you want to share this task with someone?</label>
                        <div>
                            <label>
                                <input type="radio" value="yes" checked={shareTask === true} onChange={() => setShareTask(true)} />
                                Yes
                            </label>
                            <label>
                                <input type="radio" value="no" checked={shareTask === false} onChange={() => setShareTask(false)} />
                                No
                            </label>
                        </div>
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
    
                {filteredTasks.length? 
                <>
                <div className="status-bar">
                    {Object.entries(getStatusCounts()).map(([status, count]) => (
                        <button
                            key={status}
                            className={`status-btn ${activeFilter === status ? "active" : ""}`}
                            onClick={() => handleFilterClick(status)}
                        >
                            {status}: {count}
                        </button>
                    ))}
                </div>

                <div className="tasks-list">

                    {filteredTasks.map((task, index) => (
                        <div className="task" key={task._id} data-status={task.status}>
                            <div>
                                <span>T-{index+1}</span>
                                <p data-status={task.status}>{task.status}</p>
                            </div>
                            <p>{task.name}</p>
                            <button onClick={() => ViewTask(task)}>
                                View Task
                                <img src={viewtask} alt="task view" />
                            </button>
                        </div>
                    ))}
                </div>
                </>
                :
                <>
                <div className="no-task">
                    <img src={NoTask} alt="No Tasks"/>
                    <h5>No Tasks Yet</h5>
                    <span>You have no task in your workspace yet.<br/>Get productive. Create a task now</span>
                </div>
                </>
                }
            </div>
        </React.Fragment>
    )
}

export default Tasks