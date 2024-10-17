import React from "react";
import '../Style/NavBarStyle.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RoundedButton from "./RoundedButton";
import LogOut from "./Logout";

function Navbar() {
    const [logOut, setLogOut] = useState(false);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userDetails'));
        if (user) {
            setLogOut(true);
        }
    }, []);

    return (
        <div className="custom-navbar">
            <div className="custom-nav-left">
                <ul className="custom-nav-links">
                    <RoundedButton routeLink = "/" label = "Home"/>
                </ul>
            </div>
            <div className="custom-nav-right">
                <ul className="custom-nav-links">
                    {logOut && 
                    <>
                        <RoundedButton routeLink = "/upload" label = "PDF Genie"/>           
                    </>}
                    { !logOut &&
                    <>
                        <RoundedButton routeLink = "/login" label = "LogIn"/>  
                        <RoundedButton routeLink = "/signUp" label = "SignUp"/>  
                    </>
                    }
                    {logOut && <LogOut/>  }
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
