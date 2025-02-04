import React from "react";
import { Doughnut } from "react-chartjs-2";
import { t } from "../translations/translations";
import "../assets/styles/Charts.css";

const DoughnutChart = ({titleDoughnutChart}) => {

    return (
        <div className="chart">
            <h1>{titleDoughnutChart}</h1>
            <div className="container-chart">
                <Doughnut
                    data = {{
                        labels: [t(`status_values.${'open'}`), t(`status_values.${'in_progress'}`), t(`status_values.${'closed'}`)],
                        datasets: [
                            {
                                label: "ticket",
                                data: [12, 5, 89],
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
        </div>
    )
};

export default DoughnutChart;