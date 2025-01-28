import React, { useState, useEffect } from "react";
import "../assets/styles/Settings.css";
import config from "../config/config";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Settings = () => {
    const[name, setName] = useState('');
    const[surname, setSurname] = useState('');
    const[email, setEmail] = useState('');
    const[phone, setPhone] = useState('');
    const[oldPassword, setOldPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[insertPassword, setInsertPassword] = useState('');
    const[password1, setPassword1] = useState('');
    const[password2, setPassword2] = useState('');
    const { token, role } = useAuth();
    const[showPopup, setShowPopup] = useState(false);
    const[gray, setGray] = useState(true);
    const { logout } = useAuth();
    const[viewPassword, setViewPassword] = useState(false);
    const[showDeleteProfile, setShowDeleteProfile] = useState(false);

    useEffect(() => {
        console.log("ID from useParams:", id);
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.getData}`, {
                    headers: {"Authorization": token}
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    setName(data.name);
                    setSurname(data.surname);
                    setEmail(data.email);
                    setPhone(data.phone);
                    setOldPassword(data.oldPassword);
                }

            } catch (error) {
                console.error("Errore nel recupero dei dati:", error);
            }
        };

        fetchData();
    }, [token, id]);


    {/*parte sinistra*/}

    const handleProfile = async () => {
        setShowPopup(false);
    };


    {/*popup*/}

    const handleShowPopup = async () => {

        setShowPopup(true);
        setGray(false);
    };

    const handleCancel = async () => {
        setShowPopup(false);
        setGray(true);
        setShowDeleteProfile(false);
    };

    const handleLogout = async (e) => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowDeleteProfile = async (e) => {
        e.preventDefault();
        setShowDeleteProfile(true);
    };


    {/*parte destra*/}

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.setEmail}`, {
                method: "POST",
                headers: {"authorization": token, "content-type": "application/json"},
                body: JSON.stringify({email, phone})
            });
            if (!response.ok) {
                throw new Error("Errore nella richiesta");
            }
            const data = await response.json();
        } catch (error) {
            throw error;
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if(insertPassword === oldPassword) {
            if(password1 === password2 ) {
                setNewPassword(oldPassword);
                try {
                    const response = await fetch(`${config.apiUrl}${config.endpoints.setPassword}`, {
                        method: "POST",
                        headers: {"Authorizzation": token, "content-type": "application/json"},
                        body: JSON.stringify({ newPassword })
                    });
                    if(!response.ok){
                        throw new Error("Errore nella richiesta");
                    }
                    const data = await response.json();
                } catch (error) {
                    throw error;
                }
            } else {
                alert('le password che hai inserito non sono uguali!')
            }
        } else {
            alert('La password che hai inserito non corrisponde a quella che avevi in precedenza')
        }
    };

    const handleDeleteProfile = async (e) => {
        const handleClick = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.deleteProfile}`, {
                    method: "POST",
                    headers: {"Authorization": token, "content-Type": "application/json"},
                    body: JSON.stringify({flag:true}),
                });

                if (!response.ok) {
                    throw new Error("Errore durante l'aggiornamento");
                }

                const result = await response.json();
                alert("Flag aggiornata con successo!");
            } catch(error) {
                console.error('Errore:', error);
                alert("Errore durante l'invio della flag");
            }
        }
        handleClick();
    };
    
    {/*visibilità password*/}

    const toggleViewPassword = () => {
        setViewPassword(!viewPassword);
    }

    return (
        <div className="container-navbar">
            <Navbar role= {role} id={id}/>
            <div className="settings-container">
                <div className="left-side">
                    <aside className="left-menu">
                        <button
                            className={gray === true ? "left-menu-gray" : "left-menu-white"}
                            onClick={() => handleProfile()}>    
                        Profilo
                        </button>
                        <button
                            className={gray !== true ? "left-menu-gray" : "left-menu-white"}
                            onClick={() => handleShowPopup()}>
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
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required/> <br/>
                            <button type="submit">Salva modifiche</button>
                        </form>
                    </div>
                    <div className="change-password">
                        <form onSubmit={handleChangePassword}>
                            <div className="change-password-left">
                                <h3>Vecchia password</h3>
                                <input
                                    type={viewPassword ? "text" : "password"}
                                    placeholder="vecchia password"
                                    onChange={(e) => setInsertPassword(e.target.value)}
                                    required/>
                                <span
                                    onClick={toggleViewPassword}>{viewPassword ? 'X' : '👁'}</span>
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
                            <button className="edit-button" type="submit">Modifica password</button>
                        </form>
                        {(t(`roles_values.${role}`)) === 'Cliente' && (
                            <button className="delete-button" onClick={handleShowDeleteProfile}>Elimina profilo</button>
                        )}
                    </div>
                </div>
                {showPopup && (
                    <div className="show-popup">
                        <div className="popup">
                            <h1>Logout</h1>
                            <p>Sei sicuro di voler uscire?</p>
                            <div className="button-popup">
                                <button
                                    onClick={() => handleLogout()}>SI</button>
                                <button
                                    onClick={() => handleCancel()}>NO</button>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteProfile && (
                    <div className="show-popup">
                        <div className="popup popup-delete-profile">
                            <h1>Elimina profilo</h1>
                            <p>Sei sicuro di voler eliminare il profilo?</p>
                            <div className="button-popup">
                                <button
                                    onClick={() => handleDeleteProfile()}>SI</button>
                                <button
                                    onClick={() => handleCancel()}>NO</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Settings;