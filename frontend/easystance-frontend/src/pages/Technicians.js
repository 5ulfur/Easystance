import React, { useState, useRef, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import useLazyLoading from "../services/LazyLoading";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import Technician from "../components/Technician";
import config from "../config/config";
import "../assets/styles/Technicians.css";

const Technicians = () => {
    const { token } = useAuth();
    const [error, setError] = useState(null);
    const listRef = useRef(null);
    const limit = 20;
    const [filters, setFilters] = useState({
        word: "",
        assignedTickets: {
            min: 0,
            max: 50
        }
    });

    const filterOptions = [
        {
            label: t(`search`),
            name: "word",
            type: "text"
        },
        {
            label: t(`assigned_tickets`),
            name: "assignedTickets",
            type: "range",
            options: [
                { label: "min", value: 0 },
                { label: "max", value: 50 }
            ]
        }
    ];

    const getTechnicians = useCallback(async (page, limit) => {
        const response = await fetch(`${config.apiUrl}${config.endpoints.getTechniciansList}`, {
            method: "POST",
            headers: { "Authorization": token , "Content-Type": "application/json" },
            body: JSON.stringify({ page, limit, filters })
        });
        
        const data = await response.json();
        if (response.ok) {
            if (data.technicians.length === 0) {
                setError(t(`error_no_technicians`));
            } else {
                setError(null);
            }

            return { data: data.technicians, hasMore: data.hasMore };
        } else {
            setError(data.error);
            return { data: [], hasMore: false };
        }
    }, [token, filters]);

    const { items: technicians, hasMore, loadMore, reload } = useLazyLoading(getTechnicians, limit);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            loadMore();
        }
    };

    const handleFilterChange = useCallback((name, value, value2) => {
        setFilters((prevFilters) => {
            if (name === "assignedTickets") {
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
    
    return (
        <div className="page">
            <Navbar/>
            <div className="technicians-container">
                <Filters
                    title={t(`filters`)}
                    filterOptions={filterOptions}
                    onFilterChange={debouncedFilterChange}
                />
                <main className="technicians-list" ref={listRef} onScroll={handleScroll}>
                    {technicians.map((technician) => (
                        <Link to={`/technicians/${technician.id}`} key={technician.id} className="technicians-list-item">
                            <Technician
                                name={`${technician.name} ${technician.surname}`}
                                email={technician.email}
                                phone={technician.phone}
                                assignedTicketsCount={technician.assignedTicketsCount}
                            />
                        </Link>
                    ))}
                    {error && <p className="error-box"><strong>{error}</strong></p>}
                </main>
            </div>
        </div>
    );
};

export default Technicians;