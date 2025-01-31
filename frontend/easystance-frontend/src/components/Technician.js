import React from "react";
import { t } from "../translations/translations";
import "../assets/styles/Technician.css";

const Technician = ({ name, email, phone, assignedTicketsCount }) => {
    return (
        <div className="technician">
            <h3 className="technician-name">{name}</h3>
            <p className="technician-details">
                {email}
            </p>
            <p className="technician-details">
                {phone}
            </p>
            <p className="technician-details">
                <strong>{t(`assigned_tickets`)}:</strong> {assignedTicketsCount}
            </p>
        </div>
    );
};

export default Technician;