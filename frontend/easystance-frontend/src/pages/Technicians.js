import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import Technician from "../components/Technician";
import config from "../config/config";
import "../assets/styles/Technicians.css";

const Technicians = () => {
    const { token } = useAuth();
    const [technicians, setTechnicians] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
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

    useEffect(() => {
        const getTechnicians = async () => {
            try {
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

                    if (page === 1) {
                        setTechnicians(data.technicians);
                    } else {
                        setTechnicians((prevTechnicians) => {
                            const uniqueTechnicians = [...prevTechnicians, ...data.technicians].reduce((acc, technician) => {
                                if (!acc.some((currTechnician) => currTechnician.id === technician.id)) acc.push(technician);
                                return acc;
                            }, []);
                            return uniqueTechnicians;
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

        getTechnicians();
    }, [token, page, filters]);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            setPage((prevPage) => prevPage + 1);
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