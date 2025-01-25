import React from "react";
import Navbar from "../components/Navbar";
import "../assets/styles/ErrorPage.css";

const ErrorPage = ({ error }) => {
    return (
        <div className="error-page">
            <Navbar/>
            <h1 className="error-box error-page-message">{error}</h1>
        </div>
    );
};

export default ErrorPage;