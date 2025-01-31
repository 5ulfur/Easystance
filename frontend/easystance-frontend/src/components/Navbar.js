import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import logo from "../assets/images/logo.png";
import Breadcrumb from "./Breadcrumb";
import "../assets/styles/Navbar.css";

const Navbar = () => {
    const { role } = useAuth();
    
    const tickets = { title: t(`navbar_values.tickets`), to: "/tickets" };
    const technicians = { title: t(`navbar_values.technicians`), to: "/technicians" };
    const agenda = { title: t(`navbar_values.agenda`), to: "/technicians/" }; //Aggiungere id
    const warehouse = { title: t(`navbar_values.warehouse`), to: "/warehouse" };
    const reports = { title: t(`navbar_values.reports`), to: "/reports" };
    const add = { title: t(`navbar_values.add`), to: "/add" };
    const settings = { title: t(`navbar_values.settings`), to: "/settings" };
    
    const roleMenu = {
        administrator: [tickets, technicians, warehouse, reports, add, settings],
        operator: [tickets, technicians, warehouse, settings],
        technician: [tickets, agenda, warehouse, settings],
        customer: [tickets, settings]
    }

    const menu = roleMenu[role] || [{ title: "Login", to: "/login" }];

    return (
        <div className="navbar">
            <div className="navbar-container">
                <img src={logo} alt="Logo"/>
                <div className="navbar-menu">
                    {menu.map((page, index) => (
                        <NavLink key={index} to={page.to} className={({ isActive }) => (isActive ? "navbar-item active" : "navbar-item")}>
                            {page.title}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Breadcrumb/>
        </div>
    );
}

export default Navbar;