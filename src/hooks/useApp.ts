import { useContext } from "react";
import { AppContextType } from "../types";
import { AppContext } from "../context/AppContext";

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }

    return context;
};
