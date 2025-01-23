import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import config from "../config/config";
import "../assets/styles/TicketDetails.css";

const TicketDetails = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState([]);
    const { token, role } = useAuth();

    useEffect(() => {
        const getTickets = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.getTicket}?id=${id}`, {
                    headers: { 'Authorization': token }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTicket(data.ticket);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getTickets();
    }, [token, id]);

    return (
        <div className="ticket-details-page">
            <Navbar role={role}/>
            <div className="ticket-details-container">
                <h2>{t(`ticket_details`)}</h2>
                <h3 className="">{ticket.subject}</h3>
                <p className="">
                    <strong>{t(`description`)}:</strong> {ticket.description}
                </p>
                <p className="">
                    <strong>{t(`category`)}:</strong> {t(`category_values.${ticket.category}`)}
                </p>
                <p className="">
                    <strong>{t(`priority`)}:</strong> <span className="">{t(`priority_values.${ticket.priority}`)}</span>
                </p>
                <p className="">
                    <strong>{t(`status`)}:</strong> {t(`status_values.${ticket.status}`)}
                </p>
            </div>
        </div>
    );
};

export default TicketDetails;