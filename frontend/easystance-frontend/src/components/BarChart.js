import React from "react";
import { BarElement, Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "../assets/styles/Charts.css";

ChartJS.register (
    BarElement
)

const BarChart = ({ titleBarChart }) => {

    return (
        <div className="chart">
            <h1>{titleBarChart}</h1>
            <div className="container-chart">
                <Bar
                    data = {{
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
    )
};

export default BarChart;