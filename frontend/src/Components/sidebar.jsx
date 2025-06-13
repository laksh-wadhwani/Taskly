import React from "react";
import "./sidebar.css";
import overviewww from "../assets/overviewww.svg"
import tasks from "../assets/tasks.svg"
import setting from "../assets/setting.svg"
import { NavLink,useNavigate } from "react-router";
import logout from "../assets/logout.svg"

const Sidebar = ({user, setLoginUser}) => {

    const navigate = useNavigate();
    const Logout = () => {
        setLoginUser({})
        navigate("/")
    }

    return(
        <React.Fragment>
            <div className="overall-sidebar">
                <div className="chotu-sidebar">
                    <div className="profile-placeholder">
                        <div></div>
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