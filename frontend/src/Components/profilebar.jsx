import React, { useRef, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./profilebar.css"
import { Modal } from 'react-responsive-modal';
import { BackendURL } from "../BackendContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";


const ProfileBar = ({user, setLoginUser}) => {

    const API = BackendURL();
    const [open, setOpen] = useState(false);
    const toastId = useRef(null)
    const navigate = useNavigate();
    const [image, setProfile] = useState();

    const {fullname} = user
    const words = fullname.trim().split(" ")
    const initials = words.map(word => word.charAt(0)).join("").toUpperCase();

    const MyProfile = () => {
        setOpen(true)
    }
    
    const UploadProfile = () => {
        toastId.current = toast.loading("Picture is uploading...")
        const ProfilePicture = new FormData();
        ProfilePicture.append("Profile",image)
        axios.put(`${API}/User/UploadProfile/${user.email}`, ProfilePicture)
        .then(response => {
            if(response.data.message === "Profile Picture Uploaded"){
                toast.update(toastId.current, {render:response.data.message, type:"success", isLoading:false, autoClose:2000})
                setTimeout(() => {
                    setLoginUser(response.data.user)
                    navigate(0)
                }, 2000)
                return
            }
            return toast.update(toastId.current, {render:response.data.message, type:'error', isLoading:false})
        })
        .catch(error => {
            console.error("Getting error in uploading picture",error)
            return toast.update(toastId.current, {render:(error?.response?.data.message || "Something went wrong..."), type:"error", isLoading:false})
        })
    }

    return(
        <React.Fragment>
            <div className="profile-bar">
                <div className="basic-info">

                    {user.profile? 
                    <img src={user.profile} alt="User Profile"/>
                    :
                    <div>{initials}</div>
                    }

                    <div>
                        <h4>{user.fullname}</h4>
                        <span>{user.email}</span>
                    </div>

                    <button className="task-create-btn" onClick={MyProfile}>My Profile</button>
                </div>

                <div className="calendar-wrapper">
                    <Calendar/>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} center>
                <div className="picture-upload-modal">
                    <span>Upload your Profile Picture</span>
                    <div><input type="file" onChange={(e) => setProfile(e.target.files[0])}/></div>
                    <button onClick={UploadProfile}>Upload Picture</button>
                </div>
            </Modal>

        </React.Fragment>
    )
}

export default ProfileBar