import React, { createContext, useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContextType, AuthProviderProps, ConfigType } from "../types/auth";
import { CONFIG_RESPONSE_KEYS } from "../utils/constants";
import { login as getConfig } from "../services/api";

const AUTH_STORAGE_KEY = "auth";
const EXPIRY_TIME_MS = 2 * 60 * 60 * 1000;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [config, setConfig] = useState<ConfigType | null>(null);
  const [allCitiesConfig, setAllCitiesConfig] = useState<ConfigType[] | null>(null)

  const loginMutation = useMutation({
    mutationFn: ({ city, passkey }: { city: string; passkey: string }) =>
      getConfig(city, passkey),
  });

  const login = useCallback(
    async (city: string, passkey: string): Promise<boolean> => {
      try {
        const data = await loginMutation.mutateAsync({ city, passkey });

        const cityConfig = data.find((e: ConfigType) => e[CONFIG_RESPONSE_KEYS.CITY] == city);

        if (!cityConfig || !cityConfig[CONFIG_RESPONSE_KEYS.MASTER_EP] || !cityConfig[CONFIG_RESPONSE_KEYS.ATTENDANCE_EP]) {
          throw new Error("No valid config found for this city");
        }

        const configData: ConfigType = {
          city: cityConfig[CONFIG_RESPONSE_KEYS.CITY],
          masterSheetEndPoint: cityConfig[CONFIG_RESPONSE_KEYS.MASTER_EP],
          attendanceSheetEndPoint: cityConfig[CONFIG_RESPONSE_KEYS.ATTENDANCE_EP],
          database: cityConfig[CONFIG_RESPONSE_KEYS.CITY],
        };

        const authData = {
          config: configData,
          allCitiesConfig: data,
          timestamp: Date.now(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

        setIsAuthenticated(true);
        setConfig(configData);
        setAllCitiesConfig(data)

        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    [loginMutation]
  );

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setConfig(null);
    setAllCitiesConfig(null);
  };


  const updateMasterSheetEP = (city: string) => {
    const selectedCityConfig = allCitiesConfig?.find(
      (c) => c[CONFIG_RESPONSE_KEYS.CITY] == city
    );

    if (selectedCityConfig && config) {
      setConfig({
        ...config,
        masterSheetEndPoint: selectedCityConfig[CONFIG_RESPONSE_KEYS.MASTER_EP],
        database: selectedCityConfig[CONFIG_RESPONSE_KEYS.CITY]
      });
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (auth) {
      const data = JSON.parse(auth)
      const isExpired = Date.now() - data.timestamp > EXPIRY_TIME_MS

      if (!isExpired) {
        setIsAuthenticated(true)
        setConfig(data.config)
        setAllCitiesConfig(data.allCitiesConfig)
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    setIsAuthInitialized(true);
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isAuthInitialized,
    login,
    logout,
    isLoginLoading: loginMutation.isPending,
    config,
    allCitiesConfig,
    updateMasterSheetEP
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};