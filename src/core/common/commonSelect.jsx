import React, { useEffect, useState } from "react";
import Select from "react-select";
const CommonSelect = ({ options, defaultValue, className }) => {
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    // const customStyles = {
    //   option: (base: any, state: any) => ({
    //     ...base,
    //     color: "#6A7287",
    //     backgroundColor: state.isSelected ? "#ddd" : "white",
    //     cursor: "pointer",
    //     "&:hover": {
    //       backgroundColor: state.isFocused ? "#3D5EE1" : "blue",
    //       color: state.isFocused ? "#fff" : "#6A7287",
    //     },
    //   }),
    // };
    const handleChange = (option) => {
        setSelectedOption(option || undefined);
    };
    useEffect(() => {
        setSelectedOption(defaultValue || undefined);
    }, [defaultValue]);
    return (<Select classNamePrefix="react-select" className={className} 
    // styles={customStyles}
    options={options} value={selectedOption} onChange={handleChange} placeholder="Select"/>);
};
export default CommonSelect;
