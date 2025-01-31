import React, { useState } from "react";
import { useEffect } from "react";
import config from "../config/config";
import { useAuth } from "../services/AuthContext";
import { Chart as ChartJS, Legend } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { t } from "../translations/translations";
import "../assets/styles/Graphs.css";

const Graphs = ({titleGraph, titleGraph2}) => {
    const { token, role } = useAuth();
    const [ticketsOpen, setTicketsOpen] = useState('');
    const [ticketsInProgress, setTicketsInProgress] = useState('');
    const [ticketsClosed, setTicketsClosed] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.apiUrl}${config.endpoints.getStatus}`, {
                    headers: {"Authorization": token}
                });
    
                if (response.ok) {
                    const data = await response.json();

                    setTicketsOpen(data.count_open.count);
                    setTicketsInProgress(data.count_in_progress.count);
                    setTicketsClosed(data.count_closed.count);
                }
    
            } catch (error) {
                console.error("Errore nel recupero dei dati:", error);
            }
        }
        fetchData();
    }, [token]);

    return (
        <div className="container">
            <h1>{titleGraph}</h1>
            <div className="graph-container">
                <Doughnut
                    data = {{
                        labels: [t(`status_values.${'open'}`), t(`status_values.${'in_progress'}`), t(`status_values.${'closed'}`)],
                        datasets: [
                            {
                                label: "ticket",
                                data: [{ticketsOpen}, {ticketsInProgress}, {ticketsClosed}],
                                backgroundColor: [
                                    "#BA2D0B",
                                    "#069E2D",
                                    "#F4E04D"
                                ]
                            },
                        ]
                    }}
                />
            </div>
            <h1>{titleGraph2}</h1>
            <div className="graph-container">
                <Bar 
                    data= {{
                        labels: ["schermi", "cpu", "batterie"],
                        datasets: [
                            {
                                label: "pezzi utilizzati",
                                data: [75, 11, 258],
                                backgroundColor: [
                                    "#BA2D0B"
                                ]
                            },
                            {
                                label: "pezzi acquistati",
                                data: [100, 25, 400],
                                backgroundColor: [
                                    "#F4E04D"
                                ]
                            }
                        ]
                    }}
                />
            </div>
        </div>
    );
};

export default Graphs;