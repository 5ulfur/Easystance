import React,  { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import WarehouseItem from "../components/WarehouseItem";
import config from "../config/config";
import "../assets/styles/Warehouse.css";

const Warehouse = () => {
    const { token } = useAuth();
    const [warehouseitems, setWarehouseitems] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
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

    useEffect(() => {
        const getWarehouseItems = async () => {
            try {
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

                    if (page === 1) {
                        setWarehouseitems(data.components);
                    } else {
                        setWarehouseitems((prevWarehouseitems) => {
                            const uniqueWarehouseitems = [...prevWarehouseitems, ...data.components].reduce((acc, warehouseitem) => {
                                if (!acc.some((currWarehouseitem) => currWarehouseitem.id === warehouseitem.id)) acc.push(warehouseitem);
                                return acc;
                            }, []);
                            return uniqueWarehouseitems;
                        });
                    }

                    setHasMore(data.hasMore);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError(error.message);
            }
        }

        getWarehouseItems();
    }, [token, page, filters]);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            setPage((prevPage) => prevPage + 1);
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
        setPage(1);
    }, []);

    const debouncedFilterChange = useMemo(
        () =>
            debounce((name, value, value2) => {
                handleFilterChange(name, value, value2);
            }, 300),
        [handleFilterChange]
    );

    return (
        <div className="page">
            <Navbar/>
            <div className="warehouse-container">
                <Filters
                    title={t(`filters`)}
                    filterOptions={filterOptions}
                    onFilterChange={debouncedFilterChange}
                />
                <main className="warehouse-list" ref={listRef} onScroll={handleScroll}>
                    {warehouseitems.map((warehouseitem) => (
                        <WarehouseItem
                            name={warehouseitem.name}
                            quantity={warehouseitem.quantity}
                        />
                    ))}
                    {error && <p className="error-box"><strong>{error}</strong></p>}
                </main>
            </div>
        </div>
    );
};

export default Warehouse;