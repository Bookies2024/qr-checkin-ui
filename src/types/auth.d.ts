export interface AuthContextType {
    isAuthenticated: boolean,
    isAuthInitialized: boolean,
    login: (city: string, passkey: string) => Promise<boolean>,
    logout: () => void;
    config: ConfigType,
    isLoginLoading: boolean,
    allCitiesConfig: ConfigType[],
    updateMasterSheetEP: (city: string) => void;
}

export type AuthProviderProps = {
    children: ReactNode
}

export type ConfigType = {
    city: string,
    masterSheetEndPoint: string,
    attendanceSheetEndPoint: string,
    database?: string;
}