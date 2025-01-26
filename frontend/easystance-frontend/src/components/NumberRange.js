import React, { useState } from "react";
import { Range } from "react-range";
import "../assets/styles/NumberRange.css";

const NumberRange = ({ min, max, onChange }) => {
    const [values, setValues] = useState([min, max]);

    const handleChange = (newValues) => {
        setValues(newValues);
        onChange({ minValue: newValues[0], maxValue: newValues[1] })
    };

    return (
        <div className="range-slider">
            <Range
                step={1}
                min={min}
                max={max}
                values={values}
                onChange={(values) => handleChange(values)}
                renderTrack={({ props, children }) => (
                    <div {...props} className="range-track">
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div {...props} className="range-thumb" />
                )}
            />
            <div>
                Min: {values[0]} - Max: {values[1]}
            </div>
        </div>
    );
};

export default NumberRange;