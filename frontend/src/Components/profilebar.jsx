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
            <div className="profile-bar"></div>
        </React.Fragment>
    )
}

export default ProfileBar