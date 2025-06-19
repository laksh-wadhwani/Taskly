import React, { useState } from "react";
import "./settings.css";
import { useNavigate } from "react-router";
import { Modal } from 'react-responsive-modal';
import Profile from "../assets/settingProfile.svg"
import MailIcon from "../assets/message.svg"
import { toast } from "react-toastify";
import axios from "axios";
import { BackendURL } from "../BackendContext";

const Settings = ({user, setLoginUser}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [updateUser, setUpdateUser] = useState({
        fullname: "",
        email: "",
        password: ""
    })
    
    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target
        setUpdateUser({
            ...updateUser,
            [name]: value
        })
    }

    const UpdateUser = userid => {
        axios.put(`${API}/User/UpdateUser/${userid}`, updateUser)
        .then(response => {
            if(response.data.message === "Profile has been succesfully updated"){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    setLoginUser(response.data.user)
                    setUpdateUser({
                        fullname: "",
                        email: "",
                        password: ""
                    })
                    navigate(0)
                },2500)
                return
            }
            return toast.error(response.data.message, {autoClose:2500})
        })
        .catch(error => {
            console.error("Getting error in updating user: "+error)
            return toast.error("Something went wrong...")
        })
    }

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

                <div className="task-view-list">
                    <div className="edit-task account-setting">
                        <div>
                            <img src={Profile} alt="Profile Icon" />
                            <div>
                                <label>Full Name</label>
                                <h5>{user.fullname}</h5>
                            </div>
                        </div>

                        <div>
                            <img src={MailIcon} alt="Mail Icon" />
                            <div>
                                <label>Email</label>
                                <h5>{user.email}</h5>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label>Password</label>
                                <h5>{`.....................`}</h5>
                            </div>
                        </div>

                        <button className="task-create-btn" onClick={() => setOpen1(true)}>Edit</button>
                    </div>
                </div>
            </div>

             <Modal open={open1} onClose={() => setOpen1(false)} center>
                <div className="task-form">
                   <span>Edit Profile</span>

                   <div>
                        <label>Full Name</label>
                        <input name="fullname" value={updateUser.fullname} type="text" placeholder={user.fullname} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email Address</label>
                        <input name="email" value={updateUser.email} type="email" placeholder={user.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input name="password" value={updateUser.password} type="password" onChange={handleChange} />
                    </div>

                    <button className="task-create-btn" onClick={() => UpdateUser(user._id)}>Save</button>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default Settings