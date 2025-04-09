import React from "react";
import "./sidebar.css";
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
                <div></div>
                <div className="actual-sidebar">

                    <div>
                        <h5>Taskly</h5>
                        <span>Hello {user.fullname}</span>
                    </div>

                    <NavLink to="/Tasks" className={({isActive}) => (isActive? "active-btn" : "")} style={{textDecoration:'none'}}>
                        <button>
                            <img src={tasks} alt="tasks" />
                            Tasks
                        </button>
                    </NavLink>

                    <NavLink style={{textDecoration:'none'}}>
                        <button onClick={Logout}>
                            <img src={logout} alt="logout" />
                            Logout
                        </button>
                    </NavLink>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Sidebar