import React, { useState } from "react";
import "./workspace.css"
import { useNavigate } from "react-router";

const Workspace = () => {

    const navigate = useNavigate();
    const [next, setNext] = useState(false)

    const CreateWorkspace = () => {
        navigate("/Overview")
    }

    return(
        <React.Fragment>
            <div className="main-box">
                <div className="sign-box">
                    <button className="toggleButton" style={{display:"none"}}></button>

                    <div>
                        <h5>Your Environment <br/> Your Will</h5>
                    </div>

                    <div className="inputs">
                        <div>
                            <h5>{next? `Describe Workspace`: <>Create a <span style={{color:"#3754DB"}}>Workspace</span></>}</h5>
                            <span>{next? `Description of what you workspace is for.`:`Title your workspace`}</span>
                        </div>

                        <div>
                            {next? 
                            <textarea placeholder="Enter description here"/>
                            :
                            <input type="text" placeholder="Enter Title" />
                            }
                        </div>

                        {next? 
                        <button onClick={CreateWorkspace}>Create Workspace</button>
                        :
                        <button onClick={() => setNext(true)}>Next</button>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Workspace