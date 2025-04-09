export interface AuthContextType {
    isAuthenticated: boolean,
    login: (city: string, passkey: string) => Promise<boolean>,
    config: ConfigType,
    isLoginLoading: boolean
}

export type AuthProviderProps = {
    children: ReactNode
}

export type ConfigType = {
    city: string,
    masterSheetEndPoint: string,
    attendanceSheetEndPoint: string
}