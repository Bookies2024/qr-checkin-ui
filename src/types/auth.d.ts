export interface AuthContextType {
    isAuthenticated: boolean,
    isAuthInitialized: boolean,
    currentCity: string,
    login: (city: string, passkey: string) => Promise<boolean>,
    logout: () => void;
    config: ConfigType,
    isLoginLoading: boolean,
}

export type AuthProviderProps = {
    children: ReactNode
}

export type ConfigType = {
    Type: string,
    Key: string,
    Value: string
}