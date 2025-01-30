import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useAuth } from "../services/AuthContext";
import useLazyLoading from "../services/LazyLoading";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import WarehouseItem from "../components/WarehouseItem";
import config from "../config/config";
import "../assets/styles/Warehouse.css";

const Warehouse = () => {
    const { token, role } = useAuth();
    const [newWarehouseItem, setNewWarehouseItem] = useState({
        name: "",
        quantity: 0
    });
    const [error, setError] = useState(null);
    const listRef = useRef(null);
    const limit = 20;
    const [filters, setFilters] = useState({
        word: "",
        quantity: {
            min: 0,
            max: 1000
        }
    });
    
    const filterOptions = [
        {
            label: t(`search`),
            name: "word",
            type: "text"
        },
        {
            label: t(`quantity`),
            name: "quantity",
            type: "range",
            options: [
                { label: "min", value: 0 },
                { label: "max", value: 1000 }
            ]
        }
    ];

    const getWarehouseItems = useCallback(async (page, limit) => {
        const response = await fetch(`${config.apiUrl}${config.endpoints.getComponentsList}`, {
            method: "POST",
            headers: { "Authorization": token , "Content-Type": "application/json" },
            body: JSON.stringify({ page, limit, filters })
        });

        const data = await response.json();
        if (response.ok) {
            if (data.components.length === 0) {
                setError(t(`error_no_warehouseitems`));
            } else {
                setError(null);
            }

            return { data: data.components, hasMore: data.hasMore };
        } else {
            setError(data.error);
            return { data: [], hasMore: false };
        }
    }, [token, filters]);

    const { items: warehouseitems, hasMore, loadMore, reload } = useLazyLoading(getWarehouseItems, limit);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            loadMore();
        }
    };

    const handleFilterChange = useCallback((name, value, value2) => {
        setFilters((prevFilters) => {
            if (name === "quantity") {
                return { ...prevFilters, [name]: { min: value, max: value2 } };
            } else {
                return { ...prevFilters, [name]: value };
            }
        });
        reload();
    }, [reload]);

    const debouncedFilterChange = useMemo(
        () =>
            debounce((name, value, value2) => {
                handleFilterChange(name, value, value2);
            }, 300),
        [handleFilterChange]
    );

    useEffect(() => {
        return () => {
            debouncedFilterChange.cancel();
        };
    }, [debouncedFilterChange]);

    const handleSubmitNewWarehouseItem = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createComponent}`, {
                method: "POST",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ component: newWarehouseItem })
            });

            const data = await response.json();
            if (response.ok) {
                window.location.reload(false);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChangeNewWarehouseItem = (e) => {
        const { name, value } = e.target;
        setNewWarehouseItem((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="page">
            <Navbar/>
            <div className="warehouse-container">
                <Filters
                    title={t(`filters`)}
                    filterOptions={filterOptions}
                    onFilterChange={debouncedFilterChange}
                />
                <main className="warehouse-list-container">
                    {(role === "administrator") && 
                        (<form onSubmit={handleSubmitNewWarehouseItem}>
                            <h3>Aggiungi nuovo componente</h3>
                            <input
                                type="text"
                                name="name"
                                maxLength="255"
                                placeholder={t(`component`)}
                                value={newWarehouseItem.name}
                                onChange={handleChangeNewWarehouseItem}
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                max="1000"
                                value={newWarehouseItem.quantity}
                                onChange={handleChangeNewWarehouseItem}
                                required
                            />
                            <button type="submit">{t(`add`)}</button>
                        </form>)
                    }
                    {error && <p className="error-box"><strong>{error}</strong></p>}
                    <div className="warehouse-list" ref={listRef} onScroll={handleScroll}>
                        {warehouseitems.map((warehouseitem) => (
                            <WarehouseItem
                                key={warehouseitem.id}
                                id={warehouseitem.id}
                                name={warehouseitem.name}
                                quantity={warehouseitem.quantity}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Warehouse;