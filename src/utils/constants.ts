export const ENV = {
    API_KEY: import.meta.env.VITE_API_KEY || "",
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || ""
}

export const DATA_RESPONSE_KEYS = {
    TIMESTAMP: "Timestamp",
    BOOKIES_ID: "Bookies ID",
    NAME: "Name",
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    EMAIL: "Email",
    PHONE_NUMBER: 'Phone Number',
    HOME_CITY: 'Home City'
}

export const TOAST_STYLES = {
    SUCCESS: { background: "#15803d", color: "white" },
    ERROR: { background: "#ef4444", color: "white" },
    WARNING: { background: "#ca8a04", color: "white" },
};

export const TABS = {
    SCAN: "Scan",
    LIST: "List",
}

export const POST_REQ_TYPES = {
    AUTH: "AUTH",
    RECORD: "RECORD",
    REGISTER: "REGISTER"
}

export const GET_REQ_TYPES = {
    CONFIG_KEYS: 'CONFIG-KEYS',
    RECENT_CHECKINS: 'RECENT-CHECKINS',
    MEMBER_DETAILS: 'MEMBER-DETAILS',
}

export const CONFIG_TYPES = {
    CITY: 'city',
    Email: "email"
}