import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import ActionSection from "../components/ActionSection";
import config from "../config/config";
import "../assets/styles/TicketDetails.css";

const TicketDetails = () => {
    const { id } = useParams();
    const { token, role } = useAuth();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({});
    const [error, setError] = useState(null);
    const [newAssign, setNewAssign] = useState("");

    useEffect(() => {
        const getTicket = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.getTicket}?id=${id}`, {
                    headers: { "Authorization": token }
                });

                const data = await response.json();
                if (response.ok) {
                    setTicket(data.ticket);
                    if (data.ticket.technician) {
                        setNewAssign(data.ticket.technician.email);
                    }
                } else {
                    navigate(`/unauthorized`);
                }
            } catch (error) {
                setError(error.message)
            }
        };

        getTicket();
    }, [token, id, role, navigate]);

    const handleSubmitTicketEdit = async (name, value) => {
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.editTicket}?id=${id}`, {
                method: "PATCH",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ [name]: value })
            });

            const data = await response.json();
            if (response.ok) {
                window.location.reload(false);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        handleSubmitTicketEdit(name, value);
    };

    const handleChangeAssignation = async (e) => {
        const { value } = e.target;
        setNewAssign(value)
    };

    const handleSubmitAssignation = async () => {
        handleSubmitTicketEdit("technicianEmail", newAssign);
    };

    return (
        <div className="page">
            <Navbar/>
            <div className="ticket-details-container">
                <h2>{t(`ticket_details`)}</h2>
                <div className="ticket-details-upper">
                    <div className="ticket-details-informations">
                        {error && <p className="error-box"><strong>{error}</strong></p>}
                        <h3>{ticket.subject}</h3>
                        <p>
                            <strong>{t(`description`)}:</strong> {ticket.description}
                        </p>
                        <p>
                            <strong>{t(`category`)}:</strong> {t(`category_values.${ticket.category}`)}
                        </p>
                        <p>
                            <strong>{t(`priority`)}:</strong>
                            {(role === "operator" || role === "administrator") ? (
                                <select
                                    name="priority"
                                    value={ticket.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">{t(`priority_values.low`)}</option>
                                    <option value="medium">{t(`priority_values.medium`)}</option>
                                    <option value="high">{t(`priority_values.high`)}</option>
                                    <option value="critical">{t(`priority_values.critical`)}</option>
                                </select>
                            ) : (
                                <span>{t(`priority_values.${ticket.priority}`)}</span>
                            )}
                        </p>
                        <p>
                            <strong>{t(`status`)}:</strong>
                            {(role === "operator" || role === "administrator") ? (
                                <select
                                    name="status"
                                    value={ticket.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="open">{t(`status_values.open`)}</option>
                                    <option value="in_progress">{t(`status_values.in_progress`)}</option>
                                    <option value="closed">{t(`status_values.closed`)}</option>
                                </select>
                            ) : (
                                t(`status_values.${ticket.status}`)
                            )}
                        </p>

                        {(role === "operator" || role === "administrator") ? (
                            (ticket.technician && 
                            <p>
                                <strong>{t(`assigned_to`)}:</strong> <span>{`${ticket.technician.name} ${ticket.technician.surname}`}</span>
                                <input
                                    type="email"
                                    name="technicianEmail"
                                    value={newAssign}
                                    onChange={handleChangeAssignation}
                                />
                                <button onClick={handleSubmitAssignation}>{t(`assign`)}</button>
                            </p>) || <p>
                                <strong>{t(`assigned_to`)}:</strong>
                                <input
                                    type="email"
                                    name="technicianEmail"
                                    value={newAssign}
                                    onChange={handleChangeAssignation}
                                />
                                <button onClick={handleSubmitAssignation}>{t(`assign`)}</button>
                            </p>
                        ) : (role === "technician") ? (
                            (ticket.technician && 
                            <p>
                                <strong>{t(`assigned_to`)}:</strong> <span>{`${ticket.technician.name} ${ticket.technician.surname} (${ticket.technician.email})`}</span>
                            </p>) || <p>
                                <strong>{t(`assigned_to`)}:</strong> {t(`none`)}
                            </p>
                        ) : (
                            (ticket.technician && 
                            <p>
                                <strong>{t(`assigned_to`)}:</strong> {t(`technician`)}
                            </p>) || <p>
                                <strong>{t(`assigned_to`)}:</strong> {t(`none`)}
                            </p>
                        )}
                    </div>
                    { (role === "operator" || role === "administrator" || role === "technician") && <ActionSection id={id} /> }
                </div>
                { (role === "operator" || role === "administrator" || role === "technician") && <CommentSection id={id} /> }
            </div>
        </div>
    );
};

export default TicketDetails;