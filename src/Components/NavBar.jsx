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

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="custom-navbar">
            <div className="custom-nav-left">
                <ul className="custom-nav-links">
                    <li onClick={() => scrollToSection('home')} style={{ cursor: 'pointer', marginTop: '10px', color: 'green' }}> Home</li>
                    <li onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', marginTop: '10px', color: 'green' }}>About</li>
                    <li onClick={() => scrollToSection('team')} style={{ cursor: 'pointer', marginTop: '10px', color: 'green' }}>Team</li>
                </ul>
            </div>
            <div className="custom-nav-right">
                <ul className="custom-nav-links">
                    {logOut &&
                        <>
                            <RoundedButton routeLink="/upload" label="PDF Genie" />
                        </>}
                    {!logOut &&
                        <>
                            <RoundedButton routeLink="/login" label="LogIn" />
                            <RoundedButton routeLink="/signUp" label="SignUp" />
                        </>}
                    {logOut && <LogOut />}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;