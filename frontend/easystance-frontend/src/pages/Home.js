import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../services/AuthContext";
import useLazyLoading from "../services/LazyLoading";
import { t } from "../translations/translations";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import Ticket from "../components/Ticket";
import config from "../config/config";
import "../assets/styles/Home.css";

const Home = () => {
  const { token, role } = useAuth();
  const [error, setError] = useState(null);
  const limit = 10;
  const listRef = useRef(null);
  const [filters, setFilters] = useState({
    word: "",
    category: [],
    priority: [],
    status: []
  });

  const filterOptions = [
    {
      label: t(`search`),
      name: "word",
      type: "text"
    },
    {
      label: t(`category`),
      name: "category",
      type: "checkbox",
      options: [
        { label: t(`category_values.help`), value: "help" },
        { label: t(`category_values.repair`), value: "repair" },
        { label: t(`category_values.maintenance`), value: "maintenance" }
      ]
    },
    {
      label: t(`priority`),
      name: "priority",
      type: "checkbox",
      options: [
        { label: t(`priority_values.low`), value: "low" },
        { label: t(`priority_values.medium`), value: "medium" },
        { label: t(`priority_values.high`), value: "high" },
        { label: t(`priority_values.critical`), value: "critical" }
      ]
    },
    {
      label: t(`status`),
      name: "status",
      type: "checkbox",
      options: [
        { label: t(`status_values.open`), value: "open" },
        { label: t(`status_values.in_progress`), value: "in_progress" },
        { label: t(`status_values.closed`), value: "closed" }
      ]
    }
  ];

  const getTickets = useCallback(async (page, limit) => {
    setError(null);

    const response = await fetch(`${config.apiUrl}${config.endpoints.getTicketsList}`, {
      method: "POST",
      headers: { "Authorization": token , "Content-Type": "application/json" },
      body: JSON.stringify({ page, limit, filters })
    });

    const data = await response.json();
    if (response.ok) {
      if (data.tickets.length === 0) {
        setError(t(`error_no_tickets`));
      }

      return { data: data.tickets, hasMore: data.hasMore };
    } else {
      setError(data.error);
      return { data: [], hasMore: false };
    }
  }, [token, filters]);

  const { items: tickets, hasMore, loadMore, reload } = useLazyLoading(getTickets, limit);

  const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
      loadMore();
    }
  };

  const handleFilterChange = useCallback((name, value, isChecked) => {
    setFilters((prevFilters) => {
      if (name === "category" || name === "priority" || name === "status") {
        const updatedValues = isChecked ? [...prevFilters[name], value] : prevFilters[name].filter((item) => item !== value);
        return { ...prevFilters, [name]: updatedValues };
      } else {
        return { ...prevFilters, [name]: value };
      }
    });
    reload();
  }, [reload]);

  const debouncedFilterChange = useMemo(
    () =>
        debounce((name, value, isChecked) => {
          handleFilterChange(name, value, isChecked);
      }, 300),
    [handleFilterChange]
  );

  useEffect(() => {
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [debouncedFilterChange]);

  return (
    <div className="page">
      <Navbar/>
      <div className="tickets-container">
        <Filters
          title={t(`filters`)}
          filterOptions={filterOptions}
          onFilterChange={debouncedFilterChange}
        />
        <main className="tickets-list-container">
          <div className="new-ticket-button-container">
            {(role === "operator" || role === "administrator") && <Link to="/tickets/create"><button>{t(`new_ticket`)}</button></Link>}
          </div>
          {error && <p className="error-box"><strong>{error}</strong></p>}
          <div className="tickets-list" ref={listRef} onScroll={handleScroll}>
            {tickets.map((ticket) => (
              <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="tickets-list-item">
                <Ticket
                  subject={ticket.subject}
                  category={ticket.category}
                  priority={ticket.priority}
                  status={ticket.status}
                />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;