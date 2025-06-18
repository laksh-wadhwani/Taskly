import React, { useState } from "react";
import "./settings.css";
import { useNavigate } from "react-router";
import { Modal } from 'react-responsive-modal';
import { toast } from "react-toastify";

const Settings = ({setLoginUser}) => {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    

    const Logout = () => {
        setLoginUser("")
        navigate("/")
    }

    return(
        <React.Fragment>
             <Modal open={open} onClose={() => setOpen(false)} center>
                <div className="logout-modal">
                    <div>
                        <span>You are about to Logout</span>
                        <span>You can always log on to your task manager and continue from where you left off..</span>
                    </div>
                    <div>
                        <button onClick={() => setOpen(false)}>No, This was a Mistake</button>
                        <button onClick={Logout}>Yes, Log Me Out</button>
                    </div>
                </div>
            </Modal>
            <div className="main-boxx">
                <div className="upper-bar">
                    <div><h5>Settings</h5></div>
                    <button className="task-create-btn logout" onClick={() => setOpen(true)}>Logout</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Settings