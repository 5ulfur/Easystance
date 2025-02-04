import React from "react";
import { t } from "../translations/translations";
import "../assets/styles/Action.css";

const Action = ({ category, author, date, components, description }) => {
    const formattedDate = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

    let usedComponents = "";
    if (components.length > 0) {
        usedComponents = "(" + t(`used_components`) + ": ";
        usedComponents += components.map((actionComponent) => {
            return actionComponent.component.name + " x" + actionComponent.quantity;
        }).join(", ");
        usedComponents += ")";
    }

    return (
        <div className="action">
            <p><strong>{`${t(`action_category_values.${category}`)} ${t(`performed_by`)} ${author} ${t(`on_date`)} ${formattedDate} ${usedComponents}:`} </strong>{description}</p>
        </div>
    );
};

export default Action;