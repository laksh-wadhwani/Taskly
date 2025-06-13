import React, { useState } from "react";
import profileIcon from "../assets/profile.svg"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./profilebar.css"
import { Modal } from 'react-responsive-modal';
import { BackendURL } from "../BackendContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";


const ProfileBar = ({user}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [image, setProfile] = useState();
    
    const UploadProfile = () => {
        const ProfilePicture = new FormData();
        ProfilePicture.append("Profile",image)
        axios.put(`${API}/User/UploadProfile/${user.email}`, ProfilePicture)
        .then(response => alert("Picture Uploaded"))
        .catch(error => {
            toast.error("Something went wrong...")
            console.error("Getting error in uploading picture",error)
        })
    }

    return(
        <React.Fragment>
            {console.log(user)}
            <div className="profile-bar">
                <div className="basic-info">
                    <img src={user.profile? `${user.profile}`:`${profileIcon}`} alt="Profile" onClick={() => setOpen(true)}/>
                    <div>
                        <h4>{user.fullname}</h4>
                        <span>{user.email}</span>
                    </div>
                    <button className="task-create-btn" onClick={() => navigate("/Settings")}>My Profile</button>
                </div>

                <div className="calendar-wrapper">
                    <Calendar/>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} center>
                <div className="task-form">
                    <span>Upload your Profile Picture</span>
                    <input type="file" onChange={(event) => setProfile(event.target.files[0])} />
                    <button onClick={UploadProfile} className="task-create-btn">Upload Picture</button>
                </div>
            </Modal>

        </React.Fragment>
    )
}

export default ProfileBar