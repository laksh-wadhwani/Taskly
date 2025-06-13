import React, { useEffect, useState } from "react";
import "./overview.css";
import hello from "../assets/hello.svg"
import viewtask from "../assets/viewtask.svg"
import { BackendURL } from "../BackendContext";
import axios from "axios";
import { useNavigate } from "react-router";

const Overview = ({user}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [taskDetails, setDetails] = useState([])
   
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
            <div className="main-boxx">
               <div className="upper-bar">
                    <div>
                        <h5>HI Laksh</h5>
                        <span>Welcome Back!..</span>
                    </div>
               </div>

               <div className="banner-placeholder">
                <p>Success is not final; failure is not fatal: It is the courage to continue that counts.</p>
                <p>-Winston S. Churchill</p>
               </div>

               <div className="task-wrapper">
                <span>Tasks for Today</span>
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
            </div>

           
        </React.Fragment>
    )
}

export default Overview