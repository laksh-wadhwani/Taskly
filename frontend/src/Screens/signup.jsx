import React, { useRef, useState } from "react";
import "./sign.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { BackendURL } from "../BackendContext";

const SignUp = ({setLoginUser}) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [toggleForm, setToggle] = useState(false)
    const [otpInput, setOtpInput] = useState(false)
    const [credentials, setCredentials] = useState({
        fullname: "",
        email: "",
        password: "",
        c: "",
        o: "",
        d: "",
        e: ""
    })
    const {c, o , d, e, email} = credentials
    const finalOtp = c+o+d+e;

    const cRef = useRef(null)
    const oRef = useRef(null)
    const dRef = useRef(null)
    const eRef = useRef(null)
    const toastId = useRef(null)

    const handleChange = (eventTriggered, nextRef) => {
        const {name, value} = eventTriggered.target
        setCredentials({
            ...credentials,
            [name]: value
        })

        if(name==="c" || name==="o" || name==="d" || name==="e" )
            if(value.length === 1 && nextRef.current)
                nextRef.current.focus();
    }

    const CreateAccount = () => {
        axios.post(`${API}/User/Signup`, credentials)
        .then(response => {
            if(response.data.message === "Please enter your OTP to get registered. We have sent it to your email."){
                setOtpInput(true)
                return toast.success(response.data.message)
            }
            return toast.error(response.data.message)
        })
        .catch(error => {
            console.error("Getting error in registering user",error)
            return toast.error("Something went wrong....")
        })
    }

    const Verify = () => {
        axios.put(`${API}/User/VerifyOTP`,{finalOtp, email})
        .then(response => {
            if(response.data.message === "User has been registered successfully"){
                toast.success(response.data.message, {autoClose:2500})
                setTimeout(() => {
                    setToggle(true)
                    setCredentials({
                        fullname:"",
                        email: "",
                        password: ""
                    })
                    setOtpInput(false)
                },2500)
                return
            }
            return toast.error(response.data.message)
        })
        .catch(error => {
            console.error("Getting error in verifying otp"+error)
            return toast.error(response.data.message)
        })
    }

    const Login = () => {
    toastId.current = toast.loading("Logging in...");
    axios.post(`${API}/User/Login`, credentials, {withCredentials: true})
        .then(response => {
            if (response.data.message === "Login successfull") {
                toast.update(toastId.current, {
                    render: response.data.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 2500
                });
                setTimeout(() => {
                    setLoginUser(response.data.user);
                    navigate(`/Overview`);
                }, 2500);
            } else {
                toast.update(toastId.current, {
                    render: response.data.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 2500
                });
            }
        })
        .catch(error => {
            console.error("Error getting logging in: ", error);
            toast.update(toastId.current, {
                render: error?.response?.data?.message || "Something went wrong...",
                type: "error",
                isLoading: false,
                autoClose: 2500
            });
        });
}


    const handleKeyDown = event => {
        if(event.key === "Enter"){
            if(toggleForm) return Login();
            if(otpInput) return Verify();
            else return CreateAccount();
        }
    }

    return(
        <React.Fragment>
           <div className="main-box">
            <div className="sign-box">
                <button className={`toggleButton ${toggleForm? "signup":"login"}`} onClick={() => setToggle(!toggleForm)}>{toggleForm ? "Create Account" : "Log In"}</button>

                <div className={`${toggleForm ? "slide" : ""}`}>
                    <h5>Boost your<br/>productivity with<br/>smarter task management</h5>
                </div>

                <div className={`inputs ${toggleForm? "slide-form" : ""}`} onKeyDown={handleKeyDown}> 
                    <div>
                        <h5>{toggleForm? "Welcome Back":"Create an account"}</h5>
                        <span>{toggleForm? "Please enter your credentials":"It's Simple and Easy"}</span>
                    </div>

                    {toggleForm? 
                    <>
                        <div>
                            <input name="email" value={credentials.email} type="email" placeholder="Email" onChange={handleChange}/>
                            <input name="password" value={credentials.password} type="password" placeholder="Password" onChange={handleChange}/>
                        </div>
                        
                        <button onClick={Login}>Login</button>
                    </>
                    :
                    <>
                        <div>
                            <input name="fullname" value={credentials.fullname} type="text" placeholder="Fullname" onChange={handleChange} onKeyDown={handleKeyDown} />
                            <input name="email" value={credentials.email} type="email" placeholder="Email" onChange={handleChange} onKeyDown={handleKeyDown} />
                            <input name="password" value={credentials.password} type="password" placeholder="Password" onChange={handleChange} onKeyDown={handleKeyDown} />
                        </div>

                        {otpInput? 
                        (<>
                         <div className="otp-box">
                            <input type="text" name="c" value={credentials.c} onChange={e => handleChange(e, oRef)} ref={cRef} maxLength={1} onKeyDown={handleKeyDown}/>
                            <input type="text" name="o" value={credentials.o} onChange={e => handleChange(e, dRef)} ref={oRef} maxLength={1} onKeyDown={handleKeyDown}/>
                            <input type="text" name="d" value={credentials.d} onChange={e => handleChange(e, eRef)} ref={dRef} maxLength={1} onKeyDown={handleKeyDown}/>
                            <input type="text" name="e" value={credentials.e} onChange={handleChange} ref={eRef} maxLength={1} onKeyDown={handleKeyDown}/>
                        </div>
                        </>):null}

                        {otpInput? 
                        (<>
                        <button onClick={Verify}>Verify</button>
                        </>)
                        :
                        (<>
                        <button onClick={CreateAccount}>Create Account</button> 
                        </>)}
                    </>}
                </div>
            </div>
           </div>
        </React.Fragment>
    )
}

export default SignUp