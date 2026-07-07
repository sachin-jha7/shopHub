import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../context/DataContext';
export default function Navbar() {

    const { setMode, user, setUser } = useData();
    const [isOpen, setIsOpen] = useState(false);

    const openNavBar = () => {
        setIsOpen(!isOpen);
    }

    async function logout() {
        const res = await fetch("https://shophub-backend-hw2g.onrender.com/logout", {
            credentials: "include"
        });
        const result = await res.json();
        console.log(result.message);
        setUser("");
    }

    // console.log(mode);
    return (
        <nav>
            <div className="navbar">
                <div className="logo">ShopHub</div>
                <div className="nav-links">
                    <Link to='/' className='nav-link'>Home</Link>
                    <Link to='/cart' className='nav-link'>Cart</Link>
                </div>
                <div className="auth-links">
                    {user == "" ? (
                        <>
                            <Link to='/auth' onClick={() => setMode("Login")} className='btn btn-secondary'>Login</Link>
                            <Link to='/auth' onClick={() => setMode("Signup")} className='btn btn-primary'>Signup</Link>
                        </>
                    ) : (
                        <>
                            <button className='btn btn-no-border'>{user}</button>
                            <button onClick={() => logout()} className='btn btn-danger'>Logout</button>
                        </>
                    )
                    }
                </div>


                <button onClick={openNavBar} className='menu-btn'>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                {
                    isOpen == true ? (
                        <div className="small-screen-nav">
                            <Link to='/' className='nav-link'>Home</Link>
                            <Link to='/cart' className='nav-link'>Cart</Link>
                            {user == "" ? (
                                <>
                                    <Link to='/auth' className='nav-link' onClick={() => setMode("Login")} >Login</Link>
                                    <Link to='/auth' className='nav-link' onClick={() => setMode("Signup")} >Signup</Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => logout()} style={{ color: 'crimson' }} className='nav-link btn-no-border'>Logout</button>
                                    <button className='nav-link btn-no-border'>{user}</button>
                                </>
                            )
                            }
                        </div>
                    ) : null
                }
            </div>
        </nav>
    );
}
