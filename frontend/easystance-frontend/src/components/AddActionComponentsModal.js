import React, { useState, useEffect } from "react";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import config from "../config/config";
import "../assets/styles/AddActionComponentsModal.css";

const AddActionComponentsModal = ({ isOpen, onClose, onComponentsAdded, reset }) => {
    const { token } = useAuth();
    const [id, setId] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [components, setComponents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (reset) {
            setComponents([]);
        }
    }, [reset]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const duplicate = components.some((component) => component.id === id);
            if (duplicate) {
                setError(t(`error_component_already_inserted`));
                return;
            }

            const response = await fetch(`${config.apiUrl}${config.endpoints.getComponent}?id=${id}`, {
                headers: { "Authorization": token }
            });

            const data = await response.json();
            if (response.ok) {
                if (data.component.quantity >= quantity) {
                    setComponents((prevComponents) => [...prevComponents, { id, name: data.component.name, quantity }]);
                    setId("");
                    setQuantity(0);
                } else {
                    setError(t(`error_not_enough_components`));
                }
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRemove = (id) => {
        setComponents((prevComponents) => prevComponents.filter((component) => component.id !== id));
    };

    const handleClose = () => {
        onComponentsAdded(components);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="add-action-components-modal-overlay">
            <div className="add-action-components-modal">
                <h2>{t(`add_used_components`)}</h2>
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder={t(`component_code`)}
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={1}
                        max={1000}
                        required
                    />
                    <div className="add-action-components-form-button-group">
                        <button type="submit">{t(`add`)}</button>
                        <button type="button" onClick={handleClose}>{t(`close`)}</button>
                    </div>
                </form>
                {error && <p className="error-box"><strong>{error}</strong></p>}
                <div className="add-action-components-list">
                    {components.map((component) => (
                        <p key={component.id}>{component.name} - {t(`quantity`)}: {component.quantity}<button type="button" onClick={() => handleRemove(component.id)}>-</button></p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AddActionComponentsModal;