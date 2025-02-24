import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "../services/AuthContext";
import useLazyLoading from "../services/LazyLoading";
import { t } from "../translations/translations";
import Action from "./Action";
import AddActionComponentsModal from "./AddActionComponentsModal";
import config from "../config/config";
import "../assets/styles/ActionSection.css";

const ActionSection = ({ id }) => {
    const { token } = useAuth();
    const [newAction, setNewAction] = useState({
        category: "call",
        components: [],
        description: ""
    });
    const [isModalAddComponentsOpen, setModalAddComponentsOpen] = useState(false);
    const [resetModalAddComponents, setResetModalAddComponents] = useState(false);
    const [error, setError] = useState(null);
    const listRef = useRef(null);
    const limit = 20;

    const getActions = useCallback(async (page, limit) => {
        setError(null);

        const response = await fetch(`${config.apiUrl}${config.endpoints.getActions}`, {
            method: "POST",
            headers: { "Authorization": token , "Content-Type": "application/json" },
            body: JSON.stringify({ id, page, limit })
        });

        const data = await response.json();
        if (response.ok) {
            return { data: data.actions, hasMore: data.hasMore };
        } else {
            setError(data.error);
            return { data: [], hasMore: false };
        }
    }, [token, id]);

    const { items: actions, hasMore, loadMore, reload } = useLazyLoading(getActions, limit);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            loadMore();
        }
    };

    const handleSubmitAction = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createAction}`, {
                method: "POST",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ id, action: newAction })
            });

            const data = await response.json();
            if (response.ok) {
                reload();
                setNewAction({
                    category: "call",
                    components: [],
                    description: ""
                });
                setResetModalAddComponents(true);
                setTimeout(() => setResetModalAddComponents(false), 100);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChangeAction = (e) => {
        const { name, value } = e.target;
        setNewAction((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleComponentsAdded = (components) => {
        setNewAction((prevData) => ({ ...prevData, components }));
    };

    return (
        <div className="action-section">
            <h3>{t(`actions`)}</h3>
            <form onSubmit={handleSubmitAction} className="action-section-form">
                <select
                    name="category"
                    value={newAction.category}
                    onChange={handleChangeAction}
                    required
                >
                    {/* <option value="assignation">{t(`action_category_values.assignation`)}</option>
                    <option value="edit">{t(`action_category_values.edit`)}</option> */}
                    <option value="call">{t(`action_category_values.call`)}</option>
                    <option value="repair">{t(`action_category_values.repair`)}</option>
                    <option value="document">{t(`action_category_values.document`)}</option>
                </select>
                <button type="button" onClick={() => setModalAddComponentsOpen(true)}>{t(`components`)}: {newAction.components.length}</button>
                <input
                    type="text"
                    name="description"
                    maxLength="255"
                    value={newAction.description}
                    onChange={handleChangeAction}
                    required
                />
                <button type="submit">{t(`send`)}</button>
            </form>
            {error && <p className="error-box"><strong>{error}</strong></p>}
            <div ref={listRef} onScroll={handleScroll} className="action-section-list">
                {actions.map((action) => (
                    <Action
                        key={action.id}
                        category={action.category}
                        author={`${action.employee.name} ${action.employee.surname} (${action.employee.email})`}
                        date={action.createdAt}
                        components={action.actionsComponents}
                        description={action.description}
                    />
                ))}
            </div>
            <AddActionComponentsModal
                isOpen={isModalAddComponentsOpen}
                onClose={() => setModalAddComponentsOpen(false)}
                onComponentsAdded={handleComponentsAdded}
                reset={resetModalAddComponents}
            />
        </div>
    );
};

export default ActionSection;