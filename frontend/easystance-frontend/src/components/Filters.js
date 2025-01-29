import React from "react";
import PropTypes from "prop-types";
import NumberRange from "../components/NumberRange";
import "../assets/styles/Filters.css";

const Filters = ({ title, filterOptions, onFilterChange }) => {
    return (
        <aside className="filters-container">
            <h2>{title}</h2>
            {filterOptions.map((filter, index) => (
                <div key={index} className="filter-group">
                    <strong>{filter.label}</strong>
                    <div className="filter-options">
                        {filter.type === "text" ? (
                            <input
                                type="text"
                                name={filter.name}
                                onChange={(e) => onFilterChange(filter.name, e.target.value)}
                            />
                        ) : filter.type === "checkbox" ? (
                            filter.options.map((option) => (
                                <label key={option.value} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        name={filter.name}
                                        value={option.value}
                                        onChange={(e) => onFilterChange(filter.name, option.value, e.target.checked)}
                                    />
                                    {option.label}
                                </label>
                            ))
                        ) : filter.type === "range" ? (
                            <NumberRange
                                min={filter.options[0].value}
                                max={filter.options[1].value}
                                onChange={(e) => onFilterChange(filter.name, e.minValue, e.maxValue)}
                            />
                        ) : null}
                    </div>
                </div>
            ))}
        </aside>
    );
};

Filters.propTypes = {
    title: PropTypes.string.isRequired,
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["text", "checkbox", "range"]).isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired
                })
            )
        })
    ).isRequired,
    onFilterChange: PropTypes.func.isRequired
};

export default Filters;