import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import config from "../config/config";
import Filters from "../components/Filters";
import Card from "../components/Card";
import DoughnutChart from "../components/DoughnutChart";
import BarChart from "../components/BarChart";
import "../assets/styles/Reports.css";


const Reports = () => {
    const { token, role } = useAuth();
    const [showManagementTicket, setShowManagementTicket] = useState(true);
    const [showManagementEfficency, setShowManagementEfficency] = useState(false);
    const [showManagementWarehouse, setShowManagementWarehouse] = useState(false);
    const [statusClosed, setStatusClosed] = useState();
    const [statusNotClosed, setStatusNotClosed] = useState();
    const [averageComment, setAverageComment] = useState();
    const [averageAction, setAverageAction] = useState();

    const filterOptions = [   
        {
            name: "category",
            type: "checkbox",
            options: [
                { label: t(`management_values.ticket`), value: "ticket" },
                { label: t(`management_values.efficency`), value: "efficency" },
                { label: t(`management_values.warehouse`), value: "warehouse" }
            ]
        }
    ];

    const selectFilter = async ( name, value, isChecked ) => {

        if ( value === "ticket" && isChecked === true ) {
            const getTicketStatus = async () => {

                try {
                    const response = await fetch(`${config.apiUrl}${config.endpoints.getTicketsStatus}`, {
                        headers: { "Authorization": token }
                    });
        
                    if (response.ok) {
                        const ticketsStatus = await response.json();
        
                        setStatusClosed(ticketsStatus.ticketsStatusClosed);
                        setStatusNotClosed(ticketsStatus.ticketsStatusNotClosed);
                    }
        
                } catch (error) {
                    alert(error);
                }
            };
            getTicketStatus();
            setShowManagementTicket(true);
            setShowManagementEfficency(false);
            setShowManagementWarehouse(false);          
        } else if ( value === "efficency" && isChecked === true ) {
            const getTicketInfo = async () => {

                try {
                    const response = await fetch(`${config.apiUrl}${config.endpoints.getTicketsInfo}`, {
                        headers: { "Authorization": token }
                    });
        
                    if (response.ok) {
                        const ticketsInfo = await response.json();

                        setAverageComment(Math.floor((ticketsInfo.averageComment)*100)/100);
                        setAverageAction(Math.floor((ticketsInfo.averageAction)*100)/100);
                    }
        
                } catch (error) {
                    alert(error);
                }
            };
            getTicketInfo();
            setShowManagementTicket(false);
            setShowManagementEfficency(true);
            setShowManagementWarehouse(false);
        } else if (value === "warehouse" && isChecked === true ) {
            setShowManagementTicket(false);
            setShowManagementEfficency(false);
            setShowManagementWarehouse(true);
        } else {
            setShowManagementTicket(false);
            setShowManagementEfficency(false);
            setShowManagementWarehouse(false);
        }
    };

    const getTicketStatus = async () => {

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.getTicketsStatus}`, {
                headers: { "Authorization": token }
            });

            if (response.ok) {
                const ticketsStatus = await response.json();

                setStatusClosed(ticketsStatus.ticketsStatusClosed);
                setStatusNotClosed(ticketsStatus.ticketsStatusNotClosed);
            }

        } catch (error) {
            alert(error);
        }
    };
    getTicketStatus();
    
    return (
        <div className="page">
            <Navbar role = {role}/>
            <div className="container-reports">
                <Filters 
                    title={t(`management`)}
                    filterOptions={filterOptions}
                    onFilterChange={selectFilter}
                />
                <main className="container-right">
                    {showManagementTicket && (
                        <div>
                            <div className="container-cards">
                                <Card 
                                    titleCard = {t(`card_titles.ticket_created`)}
                                    valueCard = {statusClosed + statusNotClosed}
                                />
                                <Card
                                    titleCard = {t(`card_titles.ticket_resolved`)}
                                    valueCard = {statusClosed}
                                />
                                <Card
                                    titleCard = {t(`card_titles.ticket_not_resolved`)}
                                    valueCard = {statusNotClosed}
                                />
                            </div>
                            <div className="container-charts">
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <BarChart
                                    titleBarChart = {"Grafico a barre"}
                                />
                            </div>
                        </div>
                    )}
                    {showManagementEfficency && (
                        <div>
                            <div className="container-cards">
                                <Card 
                                    titleCard = {t(`card_titles.monthly_tickets_created`)}
                                    valueCard = {statusClosed + statusNotClosed}
                                />
                                <Card
                                    titleCard = {t(`card_titles.tickets_actions`)}
                                    valueCard = {averageAction}
                                />
                                <Card
                                    titleCard = {t(`card_titles.average_comments`)}
                                    valueCard = {averageComment}
                                />
                            </div>
                            <div className="container-charts">
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <BarChart
                                    titleBarChart = {"Grafico a barre"}
                                />
                            </div>
                        </div>
                    )}
                    {showManagementWarehouse && (
                        <div>
                            <div className="container-cards">
                                <Card 
                                    titleCard = {t(`card_titles.most_item`)}
                                    valueCard = {statusClosed + statusNotClosed}
                                />
                                <Card
                                    titleCard = {t(`card_titles.least_item`)}
                                    valueCard = {statusClosed}
                                />
                                <Card
                                    titleCard = {t(`card_titles.least_item_add`)}
                                    valueCard = {statusNotClosed}
                                />
                            </div>
                            <div className="container-charts">
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <DoughnutChart
                                    titleDoughnutChart = {"Grafico a torta"}
                                />
                                <BarChart
                                    titleBarChart = {"Grafico a barre"}
                                />
                            </div>
                        </div>
                    )}                    
                </main>
            </div>
        </div>
    );
}

export default Reports;