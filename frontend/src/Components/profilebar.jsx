import React, { useState } from "react";
import profile from "../assets/profile.svg"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./profilebar.css"
import { Modal } from 'react-responsive-modal';


const ProfileBar = () => {

    const [open, setOpen] = useState(false);
    

    return(
        <React.Fragment>
            <div className="profile-bar">
                <div className="basic-info">
                    <img src={profile} alt="Profile" onClick={() => setOpen(true)}/>
                    <div>
                        <h4>Laksh Wadhwani</h4>
                        <span>laksh.wadhwani55@gmail.com</span>
                    </div>
                    <button className="task-create-btn">My Profile</button>
                </div>

                <div className="calendar-wrapper">
                    <Calendar/>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} center>
                <div className="task-form">
                    <span>Upload your Profile Picture</span>
                    <input type="file" />
                    <button className="task-create-btn">Upload Picture</button>
                </div>
            </Modal>

        </React.Fragment>
    )
}

export default ProfileBar