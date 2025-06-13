import React, { useState } from "react";
import "./sign.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { BackendURL } from "../BackendContext";

const SignUp = ({setLoginUser}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [toggleForm, setToggle] = useState(false)
    const [credentials, setCredentials] = useState({
        fullname: "",
        email: "",
        password: ""
    })

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const CreateAccount = () => {
        axios.post(`${API}/User/Signup`, credentials)
        .then(response => {
            if(response.data.message === "You are registered successfully"){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    setToggle(true)
                    setCredentials({
                        fullname: "",
                        email: "",
                        password: ""
                    })
                }, 2500);
                return
            }
            toast.error(response.data.message)

        })
        .catch(error => {
            toast.error(error?.response?.data.message || "Something went wrong.....")
            console.error("Getting error in signing up: ",error)
        })
    }

    const Login = () => {
        axios.post(`${API}/User/Login`, credentials)
        .then(response => {
            if(response.data.message === "Login successfull",{autoClose:2500}){
                toast.success(response.data.message)
                setTimeout(() => {
                    setLoginUser(response.data.user)
                    navigate(`/Overview`)
                },2500)
                return
            }
            toast.error(response.data.message)
        })
        .catch(error => {
            toast.error(error?.response?.data.message || "Something went wrong.....")
            console.error("Error getting logging in: ", error)
        })
    }

    return(
        <React.Fragment>
           <div className="main-box">

           <button className={`toggleButton ${toggleForm? "signup":"login"}`} onClick={() => setToggle(!toggleForm)}>{toggleForm ? "Create Account" : "Log In"}</button>

            <div className="sign-box">
                <div className={`${toggleForm ? "slide" : ""}`}>
                    <h5>Boost your<br/>productivity with<br/>smarter task management</h5>
                </div>

                <div className={`inputs ${toggleForm? "slide-form" : ""}`}> 
                    <div>
                        <h5>{toggleForm? "Welcome Back":"Create an account"}</h5>
                        <span>{toggleForm? "Please enter your credentials":"It's Simple and Easy"}</span>
                    </div>

                    {toggleForm? 
                    <>
                        <div>
                            <input name="email" value={credentials.email} type="email" placeholder="Email" onChange={handleChange} />
                            <input name="password" value={credentials.password} type="password" placeholder="Password" onChange={handleChange} />
                        </div>
                        
                        <button onClick={Login}>Login</button>
                    </>
                    :
                    <>
                        <div>
                            <input name="fullname" value={credentials.fullname} type="text" placeholder="Fullname" onChange={handleChange} />
                            <input name="email" value={credentials.email} type="email" placeholder="Email" onChange={handleChange} />
                            <input name="password" value={credentials.password} type="password" placeholder="Password" onChange={handleChange} />
                        </div>
                        
                        <button onClick={CreateAccount}>Create Account</button> 
                    </>}
                </div>
            </div>
           </div>
        </React.Fragment>
    )
}

export default SignUp