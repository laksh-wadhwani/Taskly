import React, { useState } from "react";
import "./sidebar.css";
import overviewww from "../assets/overviewww.svg"
import tasks from "../assets/tasks.svg"
import setting from "../assets/setting.svg"
import { NavLink } from "react-router";
import Menu from "../assets/menu.svg"

const Sidebar = ({user}) => {

    const [isOpen, setIsOpen] = useState(true)

    return(
        <React.Fragment>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <img src={Menu} alt="Hamburger" />
            </button>
            <div className={`overall-sidebar ${isOpen ? "show-sidebar" : "hide-sidebar"}`}>

                <div className="chotu-sidebar">
                    <div className="profile-placeholder">
                        {user.profile? 
                        <img src={user.profile} alt="User Profile"/>
                        :
                        <div/>
                        }
                    </div>
                </div>
                
                <div className="actual-sidebar">

                    <div>
                        <h5>Taskly</h5>
                    </div>

                    <NavLink to="/Overview" className={({isActive}) => (isActive? "active-btn" : "")} style={{textDecoration:'none'}}>
                        <button>
                            <img src={overviewww} alt="Overview" />
                            Overview
                        </button>
                    </NavLink>

                    <NavLink to="/Tasks" className={({isActive}) => (isActive? "active-btn" : "")} style={{textDecoration:'none'}}>
                        <button>
                            <img src={tasks} alt="tasks" />
                            Tasks
                        </button>
                    </NavLink>

                    <NavLink to="/Settings" className={({isActive}) => (isActive? "active-btn" : "")} style={{textDecoration:'none'}}>
                        <button>
                            <img src={setting} alt="setting" />
                            Settings
                        </button>
                    </NavLink>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Sidebar