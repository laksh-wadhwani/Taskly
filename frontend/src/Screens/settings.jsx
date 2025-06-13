import React from "react";
import "./settings.css";

const Settings = () => {
    return(
        <React.Fragment>
            <div className="main-boxx">
                <div className="upper-bar">
                    <div><h5>Settings</h5></div>
                    <button className="task-create-btn logout">Logout</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Settings