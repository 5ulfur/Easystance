import React from "react";
import "../assets/styles/Card.css";

const Card = ({titleCard, valueCard}) => {
    return (
        <div className="card">
            <h2 className="title-card">{titleCard}</h2>
            <p className="value-card">{valueCard}</p>
        </div>
    );
};

export default Card;