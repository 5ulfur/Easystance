import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import config from "../config/config";
import "../assets/styles/NewCustomerModal.css";

const NewCustomerModal = ({ isOpen, onClose, onNewCustomerCreated }) => {
    const { token } = useAuth();
    const [error, setError] = useState(null);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        surname: "",
        email: "",
        phone: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createCustomer}`, {
                method: "POST",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ customer: newCustomer })
            });

            const data = await response.json();
            if (response.ok) {
                onNewCustomerCreated(data.email);
                onClose();
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer({ ...newCustomer, [name]: value });
    }

    if (!isOpen) return null;

    return (
        <div className="new-customer-modal-overlay">
            <div className="new-customer-modal">
                <h2>{t(`add_new_customer`)}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="new-customer-form-group">
                        <label>{t(`name`)}:</label>
                        <input
                            type="text"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-customer-form-group">
                        <label>{t(`surname`)}:</label>
                        <input
                            type="text"
                            name="surname"
                            value={newCustomer.surname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-customer-form-group">
                        <label>{t(`email`)}:</label>
                        <input
                            type="text"
                            name="email"
                            value={newCustomer.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-customer-form-group">
                        <label>{t(`phone`)}:</label>
                        <input
                            type="text"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="new-customer-form-button-group">
                        <button type="submit">{t(`add`)}</button>
                        <button type="button" onClick={onClose}>{t(`close`)}</button>
                    </div>
                    {error && <p className="error-box"><strong>{error}</strong></p>}
                </form>
            </div>
        </div>
    );
};

export default NewCustomerModal;