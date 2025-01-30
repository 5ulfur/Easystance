import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import config from "../config/config";
import "../assets/styles/WarehouseItem.css";

const WarehouseItem = ({ id, name, quantity: initialQuantity }) => {
    const { token, role } = useAuth();
    const [quantity, setQuantity] = useState(initialQuantity);
    const [error, setError] = useState(null);

    const handleChangeQuantity = useCallback(async (newQuantity) => {
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.setQuantity}?id=${id}&quantity=${newQuantity}`,{
                method: "PATCH",
                headers: { "Authorization": token, "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    }, [id, token]);

    const debouncedChangeQuantity = useMemo(() => debounce(handleChangeQuantity, 500), [handleChangeQuantity]);

    const handleChange = (e) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);
        debouncedChangeQuantity(newQuantity);
    };

    useEffect(() => {
        return () => {
            debouncedChangeQuantity.cancel();
        };
    }, [debouncedChangeQuantity]);

    return (
        <div className="warehouseitem">
            <div>
                <h3 className="warehouseitem-name">{name}</h3><span>#{id}</span>
            </div>
            <p className="warehouseitem-details">
                <strong>{t(`quantity`)}:</strong>
                {(role === "administrator") ? (
                    <input
                        type="number"
                        name="quantity"
                        min="0"
                        max="1000"
                        value={quantity}
                        onChange={handleChange}
                        required
                    />
                ) : (
                    <span>{quantity}</span>
                )}
            </p>
            {error && <p className="error-box"><strong>{error}</strong></p>}
        </div>
    );
};

export default WarehouseItem;