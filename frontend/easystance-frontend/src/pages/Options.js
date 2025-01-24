import React, { useState, useEffect } from "react";
import "../assets/styles/Options.css";
import config from "../config/config";
import { useAuth } from '../services/AuthContext';

function Options() {
    const[name, setName] = useState('pippo');
    const[surname, setSurname] = useState('giuann');
    const[token, setToken] = useState('');
    let[email, setEmail] = useState('');
    let[number, setNumber] = useState('');
    let[password, setPassword] = useState('');
    let[password1, setPassword1] = useState('');
    let[password2, setPassword2] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('api dell\'utente');
            const data = await response.json();
            
            setName(data.name);
            setSurname(data.surname);
            setEmail(data.email);
            setNumber(data.number);
            setPassword(data.password);
            setToken(data.token);

            } catch (error) {
            console.error('Errore nel recupero dei dati:', error);
            }
        };
    });

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    const savedChanges = async () => {
        if (validateEmail(email)) {
            try {
                    const response = await fetch(`${config.apiUrl}${config.endpoints.savedChanges}`, {
                        method: 'POST',
                        headers: {'Authorization': token},
                        body: JSON.stringify({ email, number })
                });
                if(!response.ok){
                    throw new Error('Errore nella richiesta');
                }
                const data = await response.json();
            } catch (error) {
                throw error;
            }
        } else {
            alert('inserisci un\'email valida!');
        }
    };

    const savedPassword = async () => {
        if(password1 === password2 && (password1 !== '' || password2 !== '')) {
            password = password1;
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.savedPassword}`, {
                    method: 'POST',
                    headers: {'Authorizzation': token},
                    body: JSON.stringify({ password })
                });
                if(!response.ok){
                    throw new Error('Errore nella richiesta');
                }
                const data = await response.json();
            } catch (error) {
                throw error;
            }
        } else if (password1 === '' || password2 === '') {
            alert('compila tutti i campi!');
        } else {
            alert('inserisci due password uguali!');
        }
    };

    function deleateProfile() {
        const handleClick = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.deleateProfile}`, {
                    method: 'POST',
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': token, 
                    },
                    body: JSON.stringify({flag:true}),
                });

                if (!response.ok) {
                    throw new Error('Errore durante l\'aggiornamento');
                }

                const result = await response.json();
                alert('Flag aggiornata con successo!');
            } catch(error) {
                console.error('Errore:', error);
                alert('Errore durante l\'invio della flag');
            }
        }
    };

    const [activeButton, setActiveButton] = useState (1);
    const [showPopup, setShowPopup] = useState (false);
    const { logout } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }; 

    const handleButtonClick = (buttonNumber) => {
        setActiveButton (buttonNumber);

        if (activeButton !== 2 ) {
            setShowPopup(true);
        }
    };

    const handleConfirm = () => {
        setShowPopup(false);
        alert('sei uscito');
        handleLogout();
    }

    const handleCancel = () => {
        setShowPopup(false);
        handleButtonClick(1);
    }

    return (
        <div className="options-container">
            {/*inserire navbar*/}
            <div className="sidebar">
                <aside className="left-sidebar">
                    <button 
                        className={activeButton === 1 ? 'button-active' : 'button-inactive'}
                        onClick={() => handleButtonClick(1)}>
                        Profilo
                    </button>
                    <button
                        className={activeButton === 2 ? 'button-active' : 'button-inactive'}
                        onClick={() => handleButtonClick(2)}>
                        Logout
                    </button>
                </aside>
                {showPopup && (
                    <div className="exit-popup">
                        <p>sei sicuro di voler uscire?</p>
                        <div className="button-popup">
                            <button
                                onClick={handleConfirm}
                            >SI</button>
                            <button
                                onClick={handleCancel}
                            >NO</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="right-list">
                <div className="name">
                    <h1>Nome</h1>
                    <p>{name}</p>
                </div>
                <div className="surname">
                    <h1>Cognome</h1>
                    <p>{surname}</p>
                </div>
                <div className="email">
                    <h1>Email</h1>
                    <input 
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="number">
                    <h1>N. Telefono</h1>
                    <input 
                        type="n-telefono"
                        placeholder="N. Telefono"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                    />
                </div>
                <br/>
                <button 
                    className="changes"
                    onClick= {savedChanges}
                >Salva modifiche</button>

                <div className="change-password">
                    <input 
                        type="password"
                        placeholder="Nuova Password"
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                    />
                    <input 
                        type="password"
                        placeholder="Conferma Password"
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
                <button 
                    className="changes"
                    onClick={savedPassword}
                >Modifica Password</button>

                <button 
                    className="deleate-profile"
                    onClick={deleateProfile}
                >Elimina Profilo</button>

            </div>
        </div>
    );
}

export default Options;