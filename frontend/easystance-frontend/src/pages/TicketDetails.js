import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import config from "../config/config";
import Ticket from "../components/Ticket";

const TicketDetails = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState([]);
    const { token } = useAuth();

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
    }, [token]);

    return (
        <div>
            <Ticket
                  subject={ticket.subject}
                  category={ticket.category}
                  priority={ticket.priority}
                  status={ticket.status}
                />
        </div>
    );
};

export default TicketDetails;