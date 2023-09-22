import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const Navbar = () => {

    let navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    
    const location = useLocation();
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#"><b>myNotes</b></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>
                        </ul>
                        
                         {!localStorage.getItem('token') ? <form className="d-flex" role="search">
                            <Link className="btn btn-success mx-2" to="/login" role="button">Login</Link>
                            <Link className="btn btn-success" to="/signup" role="button">Sign Up</Link>
                        </form> : <form className="d-flex" role="search">
                            <Link className="btn btn-sm btn-success mx-2" to="/userdetail" role="button"><i class="fa-regular fa-user"></i></Link>
                            <button onClick={handleLogout} type="button" className="btn btn-sm btn-danger">Log Out</button>
                        </form>}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
