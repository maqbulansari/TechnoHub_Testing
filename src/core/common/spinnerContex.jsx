import React, { createContext, useContext, useState } from "react";
const SpinnerContext = createContext(undefined);
export const SpinnerProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const showSpinner = () => setLoading(true);
    const hideSpinner = () => setLoading(false);
    return (<SpinnerContext.Provider value={{ showSpinner, hideSpinner, loading }}>
      {children}
    </SpinnerContext.Provider>);
};
export const useSpinner = () => {
    const context = useContext(SpinnerContext);
    if (context === undefined) {
        throw new Error("useSpinner must be used within a SpinnerProvider");
    }
    return context;
};
