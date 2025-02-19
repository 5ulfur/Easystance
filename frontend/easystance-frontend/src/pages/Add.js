import React, {useState} from "react";
import Navbar from "../components/Navbar";
import { t } from "../translations/translations";
import { useAuth } from "../services/AuthContext";
import config from "../config/config";
import "../assets/styles/Add.css";

const Add = () => {
    const { token } = useAuth();
    const [role, setRole] = useState("Technician");    
    const [name, setName] = useState("");
    const [surname, setSurame] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createEmployee}`, {
                method: "POST",
                headers: {"Authorization": token, "Content-type": "application/json" },
                body: JSON.stringify({ role, name, surname, email, phone })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Dipendente aggiunto con successo!");
            } else {
                alert(data.error);
            }

        } catch (error) {
            alert(error.message);
        }

    }

    return (
        <div className="page">
            <Navbar />
            <div className="container-add">
                <h2>{t(`add`)}</h2>
                <form onSubmit={handleSubmit} className="information-add">
                    <div className="new-employee-form-section">
                        <label>
                            {t(`employee`)}*:
                            <select
                                name = "selectEmployees"
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="technician">{t(`roles_values.technician`)}</option>
                                <option value="operator">{t(`roles_values.operator`)}</option>
                                <option value="administrator">{t(`roles_values.administrator`)}</option> 
                            </select>
                        </label>
                        <label>
                            <label>{t(`name`)}*:</label>
                            <input
                                type="name"
                                name="EmployeeName"
                                maxLength="50"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <label>{t(`surname`)}*:</label>
                            <input
                                type="surname"
                                name="employeeSurname"
                                maxLength="50"
                                onChange={(e) => setSurame(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="new-employee-form-section">
                        <label>
                            <label>{t(`email`)}*:</label>
                            <input 
                                type="email"
                                name="employeeEmail"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <label>{t(`phone`)}*:</label>
                            <input
                                type="phone"
                                name="employeePhone"
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">{t(`add`)}</button>
                </form>
            </div>
        </div>
    );
};

export default Add;