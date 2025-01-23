import { t } from "../translations/translations";
import "../assets/styles/Ticket.css";

const Ticket = ({ subject, category, priority, status }) => {
    return (
        <div className="ticket">
            <h3 className="ticket-subject">{subject}</h3>
            <p className="ticket-details">
                <strong>{t(`category`)}:</strong> {t(`category_values.${category}`)}
            </p>
            <p className="ticket-details">
                <strong>{t(`priority`)}:</strong> <span className={`priority-${priority}`}>{t(`priority_values.${priority}`)}</span>
            </p>
            <p className="ticket-details">
                <strong>{t(`status`)}:</strong> {t(`status_values.${status}`)}
            </p>
        </div>
    );
};

export default Ticket;