import { t } from "../translations/translations";
import "../assets/styles/WarehouseItem.css";

const WarehouseItem = ({ name, quantity }) => {
    return (
        <div className="warehouseitem">
            <h3 className="warehouseitem-name">{name}</h3>
            <p className="warehouseitem-details">
                <strong>{t(`quantity`)}:</strong> {quantity}
            </p>
        </div>
    );
};

export default WarehouseItem;