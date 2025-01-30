import React from "react";
import { t } from "../translations/translations";
import "../assets/styles/Action.css";

const Action = ({ category, author, date, description }) => {
    const formattedDate = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

    return (
        <div className="action">
            <p><strong>{`${t(`action_category_values.${category}`)} ${t(`performed_by`)} ${author} ${t(`on_date`)} ${formattedDate}:`} </strong>{description}</p>
        </div>
    );
};

export default Action;