
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext';

export default function AuthForm() {

    const { mode, setMode, notifiMsg, setNotfiMsg, notifiStatus, setNotifiStatus } = useData();

    const [eyeOpen, setEyeOpen] = useState(true);

    const navigate = useNavigate()

    const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm();

    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm();

    function togglePassword() {
        setEyeOpen(!eyeOpen);
    }

    async function signupFormHandler(data) {
        // console.log(`Submitted with Email: ${data.email}, Name: ${data.text}, Password: ${data.password}`);
        const newUser = {
            fullName: data.text,
            email: data.email,
            password: data.password
        }
        try {
            const res = await fetch("https://shophub-backend-hw2g.onrender.com/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser),
                    credentials: "include"
                }
            );
            const result = await res.json();
            if (result.message == "User already exists!") {
                setNotifiStatus("error");
                setNotfiMsg("User already exists!");
            } else if (result.message == "Welcome to ShopHub!") {
                navigate("/");
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function loginFormHandler(data) {
        // console.log(`Submitted with Email: ${data.email}, Password: ${data.password}`);
        const user = {
            email: data.email,
            password: data.password
        }
        try {
            const res = await fetch("https://shophub-backend-hw2g.onrender.com/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user),
                    credentials: "include"
                }
            );
            // console.log(await res.json());
            const result = await res.json();
            if (result.message == "User doesn't exists!") {
                setNotifiStatus("error");
                setNotfiMsg("User doesn't exists!");
            } else if (result.message == "Wrong email or password!") {
                setNotifiStatus("error");
                setNotfiMsg("Wrong email or password!");
            } else if (result.message == "Welcome Back!") {

                navigate("/");
            }
            // console.log(result);
        } catch (err) {
            console.log(err)
        }
    }

    function closeNotification() {
        setNotifiStatus("close");
    }

    return (

        <div>
            {
                notifiStatus == "error" ? (
                    <div className="notification">
                        <p>{notifiMsg}</p>
                        <button onClick={closeNotification}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                ) : notifiStatus == "success" ? (
                    <div className="notification notification-color">
                        <p>{notifiMsg}</p>
                        <button onClick={closeNotification}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                ) : null
            }

            <div className="auth-form-container">

                {mode == "Signup" ? (
                    <form onSubmit={handleSignupSubmit(signupFormHandler)} className="signup-form">
                        <h2>Create account to shop now...</h2>
                        <div className="form-element">
                            <input type="text" placeholder="Enter name..." autoComplete="off" {
                                ...registerSignup("text", { required: "Name is required!" })
                            } />
                            {signupErrors.text && (<p style={{ color: 'crimson', marginTop: '5px' }}>{signupErrors.text.message}</p>)}
                        </div>
                        <div className="form-element">
                            <input type="email" placeholder="Enter email..." autoComplete="off" {
                                ...registerSignup("email", { required: "Email is required!" })
                            } />
                            {signupErrors.email && (<p style={{ color: 'crimson', marginTop: '5px' }}>{signupErrors.email.message}</p>)}
                        </div>

                        <div className="form-element">
                            <input type={`${eyeOpen ? 'password' : 'text'}`} placeholder="Password..." {
                                ...registerSignup("password", {
                                    required: "Password is required!",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 4 chars!"
                                    },
                                    maxLength: {
                                        value: 12,
                                        message: "Password must be at most 12 chars!"
                                    }
                                })
                            } />
                            {signupErrors.password && (<p style={{ color: 'crimson', marginTop: '5px' }}>{signupErrors.password.message}</p>)}
                            <i onClick={togglePassword} className={`${eyeOpen ? 'fa fa-eye' : 'fa fa-eye-slash'}`} ></i>
                        </div>
                        <button type='submit' className="btn btn-primary">Register</button>
                        <p>Already have an account? <button onClick={() => setMode("Login")} type="button">Login</button></p>
                    </form>
                ) : mode == "Login" ? (
                    <form onSubmit={handleLoginSubmit(loginFormHandler)} className="login-form">
                        <h2>Login to continue shopping...</h2>
                        <div className="form-element">
                            <input type="email" placeholder="Enter email..." autoComplete="off" {
                                ...registerLogin("email", { required: "Email is required!" })
                            } />
                            {loginErrors.email && (<p style={{ color: 'crimson', marginTop: '5px' }}>{loginErrors.email.message}</p>)}
                        </div>
                        <div className="form-element">
                            <input type={`${eyeOpen ? 'password' : 'text'}`} placeholder="Password..." {
                                ...registerLogin("password", { required: "Password is required!" })
                            } />
                            {loginErrors.password && (<p style={{ color: 'crimson', marginTop: '5px' }}>{loginErrors.password.message}</p>)}
                            <i onClick={togglePassword} className={`${eyeOpen ? 'fa fa-eye' : 'fa fa-eye-slash'}`} ></i>
                        </div>
                        <button type='submit' className="btn btn-primary">Login</button>
                        <p>Don't have an account? <button onClick={() => setMode("Signup")} type="button">Signup</button></p>
                    </form>
                ) : null
                }

            </div>
        </div>
    );
}
