export const ENV = {
    API_KEY: import.meta.env.VITE_API_KEY || "",
    CONFIG_SHEET_EP: import.meta.env.VITE_CONFIG_SHEET_EP || ""
}

export const CONFIG_RESPONSE_KEYS = {
    CITY: "City",
    MASTER_EP: "Mastersheet EP",
    ATTENDANCE_EP: "Attendance Sheet EP"
};

export const DATA_RESPONSE_KEYS = {
    TIMESTAMP: "Timestamp",
    BOOKIES_ID: "Bookies ID",
    NAME: "Name",
    EMAIL: "Email",
    PHONE_NUMBER: 'Phone Number'
}

export const TOAST_STYLES = {
    SUCCESS: { background: "#15803d", color: "white" },
    ERROR: { background: "#ef4444", color: "white" },
    WARNING: { background: "#ca8a04", color: "white" },
};

export const TABS = {
    SCAN: "Scan",
    LIST: "List",
    LINK: "Link"
}