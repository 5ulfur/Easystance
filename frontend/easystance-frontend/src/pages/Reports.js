import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import config from "../config/config";
import Filters from "../components/Filters";
import Graphs from "../components/Graphs";
import Card from "../components/Card";
import "../assets/styles/Reports.css";

const Reports = () => {
    const { token, role } = useAuth();
    const [type, setType] = useState("");

    const filterOptions = [   
        {
            //label: t(`management`),
            name: "category",
            type: "checkbox",
            options: [
                { label: t(`management_values.ticket`), value: "ticket" },
                { label: t(`management_values.efficency`), value: "efficency" },
                { label: t(`management_values.warehouse`), value: "warehouse" }
            ]
        }
    ];

    const selectFilter = async () => {
        
    }
    
    return (
        <div className="page">
            <Navbar role = {role}/>
            <div className="container-reports">
                <Filters 
                    title={t(`management`)}
                    filterOptions={filterOptions}
                    onFilterChange={selectFilter}
                />
                <main className="container-graphs">
                    {/*{ graphs.map((graphs) => (
                        <Graphs />
                    ))}*/}
                    
                    <div className="container-cards">
                        <Card 
                            titleCard = {t(`card_titles.ticket_created`)}
                            valueCard = {"665"}
                        />
                        <Card
                            titleCard = {t(`card_titles.ticket_resolved`)}
                            valueCard = {"142"}
                        />
                        <Card
                            titleCard = {t(`card_titles.ticket_not_resolved`)}
                            valueCard = {"293"}
                        />
                    </div>
                    <Graphs 
                        titleGraph = {"Grafico a torta"}
                        titleGraph2 = {"Grafico a barre"}
                    />
                </main>
            </div>
        </div>
    );
}

export default Reports;