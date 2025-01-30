import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import NewCustomerModal from "../components/NewCustomerModal";
import config from "../config/config";
import "../assets/styles/CreateTicket.css";

const CreateTicket = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isModalNewCustomerOpen, setModalNewCustomerOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({
        customerEmail: "",
        technicianEmail: "",
        subject: "",
        description: "",
        category: "help",
        priority: "low",
        status: "open"
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createTicket}`, {
                method: "POST",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ ticket: newTicket })
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/tickets/${data.ticketId}`);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTicket((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNewCustomerCreated = (email) => {
        setNewTicket((prevData) => ({ ...prevData, customerEmail: email }));
    };

    return (
        <div className="page">
            <Navbar/>
            <div className="create-ticket-container">
                <h2>{t(`new_ticket`)}</h2>
                <form onSubmit={handleSubmit} className="create-ticket-form">
                    <div className="create-ticket-form-section">
                        <label>
                            {t(`customer_email`)}*:
                            <div className="create-ticket-customer-email">
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={newTicket.customerEmail}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" onClick={() => setModalNewCustomerOpen(true)}>+</button>
                            </div>
                        </label>
                        <label>
                            {t(`subject`)}*:
                            <input
                                type="text"
                                name="subject"
                                maxLength="255"
                                value={newTicket.subject}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            {t(`description`)}*:
                            <textarea
                                name="description"
                                maxLength="1000"
                                value={newTicket.description}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="create-ticket-form-section">
                        <label>
                            {t(`category`)}*:
                            <select
                                name="category"
                                value={newTicket.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="help">{t(`category_values.help`)}</option>
                                <option value="repair">{t(`category_values.repair`)}</option>
                                <option value="maintenance">{t(`category_values.maintenance`)}</option>
                            </select>
                        </label>
                        <label>
                            {t(`priority`)}*:
                            <select
                                name="priority"
                                value={newTicket.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="low">{t(`priority_values.low`)}</option>
                                <option value="medium">{t(`priority_values.medium`)}</option>
                                <option value="high">{t(`priority_values.high`)}</option>
                                <option value="critical">{t(`priority_values.critical`)}</option>
                            </select>
                        </label>
                        <label>
                            {t(`technician_email`)}:
                            <input
                                type="email"
                                name="technicianEmail"
                                value={newTicket.technicianEmail}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <button type="submit">{t(`create_ticket`)}</button>
                </form>
                {error && <p className="error-box"><strong>{error}</strong></p>}
            </div>
            <NewCustomerModal
                isOpen={isModalNewCustomerOpen}
                onClose={() => setModalNewCustomerOpen(false)}
                onNewCustomerCreated={handleNewCustomerCreated}
            />
        </div>
    );
};

export default CreateTicket;