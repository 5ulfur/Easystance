import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/styles/Breadcrumb.css";

const Breadcrumb = () => {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <div aria-label="breadcrumb" className="breadcrumb-container">
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/tickets">Home</Link>
                </li>
                {paths.map((path, index) => {
                    const fullPath = "/" + paths.slice(0, index + 1).join("/");
                    const isLast = index === paths.length - 1;

                    return (
                        <li key={fullPath} className={isLast ? "breadcrumb-item active" : "breadcrumb-item"}>
                            <span>{"> "}</span>
                            {isLast ? (
                                <span>{path}</span>
                            ): (
                                <Link to={fullPath}>{path}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Breadcrumb;
