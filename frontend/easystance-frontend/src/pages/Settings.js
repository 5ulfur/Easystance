import React, { useState, useEffect } from "react";
import "../assets/styles/Settings.css";
import config from "../config/config";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";

const Settings = () => {
    const[name, setName] = useState('');
    const[surname, setSurname] = useState('');
    const[email, setEmail] = useState('');
    const[phoneNumber, setPhoneNumber] = useState('');
    const[password, setPassword] = useState('');
    const[password1, setPassword1] = useState('');
    const[password2, setPassword2] = useState('');
    const {token, role} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.getData}`, {
                headers: {"authorization": token}
            });
            const data = await response.json();
            
            setName(data.name);
            setSurname(data.surname);
            setEmail(data.email);
            setPhoneNumber(data.phoneNumber);

            } catch (error) {
            console.error("Errore nel recupero dei dati:", error);
            }
        };
    });

    const handleSave = async (e) => {
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.editEmail}`, {
                method: "POST",
                headers: {"authorization": token, "content-type": "application/json"},
                body: JSON.stringify({email, phoneNumber})
            });
            if (!response.ok) {
                throw new Error("Errore nella richiesta");
            }
            const data = await response.json();
        } catch (error) {
            throw error;
        }
    }

    const handleChangePassword = () => {

    }

    const handleDeletePassword = () => {

    }

    return (
        <div className="settings-container">
            {/*<Navbar />*/}
            <div className="left-side">
                <aside className="left-menu">
                    <button>    
                    Profilo
                    </button>
                    <button>
                    Logout
                    </button>
                </aside>
            </div>
            <div className="right-side">
                <div className="general-information">
                    <h1>Informazioni generali</h1> <br/>
                    <div className="left-information">
                        <h3>Nome</h3>
                        <h2>{name}</h2>
                        <h3>Ruolo</h3>
                        <h2>{t(`roles_values.${role}`)}</h2>
                    </div>
                    <div className="right-information">
                        <h3>Cognome</h3>
                        <h2>{surname}</h2>
                    </div>
                </div>
                <div className="can-modify">
                    <h1>Puoi modificare</h1>
                    <form onSubmit={handleSave}>
                        <h3>Email</h3>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                        <h3>Numero di telefono</h3>
                        <input
                            type="phoneNumber"
                            placeholder="Numero di telefono"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required/> <br/>
                        <button type="submit">Salva modifiche</button>
                    </form>
                </div>
                <div className="change-password">
                    <form onSubmit={handleChangePassword}>
                        <div className="change-password-left">
                            <h3>Vecchia password</h3>
                            <input
                                type="password"
                                placeholder="vecchia password"
                                onChange={(e) => setPassword(e.target.value)}
                                required/>
                        </div>
                        <div className="change-password-right">
                            <h3>Nuova password</h3>
                            <input
                                type="password"
                                placeholder="Nuova password"
                                onChange={(e) => setPassword1(e.target.value)}
                                required/>
                            <h3>Conferma password</h3>
                            <input
                                type="password"
                                placeholder="Conferma password"
                                onChange={(e) => setPassword2(e.target.value)}
                                required/>
                        </div>
                        <button className="editButton" type="submit">Modifica password</button>
                    </form>
                    <button className="delete-button" onChange={handleDeletePassword}>Elimina profilo</button>
                </div>
            </div>
        </div>

    );
};

export default Settings;