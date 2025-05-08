import React, { createContext, useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContextType, AuthProviderProps, ConfigType } from "../types/auth";
import { login as getConfig } from "../services/api";

const AUTH_STORAGE_KEY = "auth";
const EXPIRY_TIME_MS = 2 * 60 * 60 * 1000;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [config, setConfig] = useState<ConfigType | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: ({ city, password }: { city: string; password: string }) =>
      getConfig(city, password),
  });

  const login = useCallback(
    async (city: string, password: string): Promise<boolean> => {
      try {
        const data = await loginMutation.mutateAsync({ city, password });

        const authData = {
          config: data,
          currentCity: city,
          timestamp: Date.now(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

        setIsAuthenticated(true);
        setConfig(data);
        setCurrentCity(city)

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
    setCurrentCity(null)
    setConfig(null);
  };

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (auth) {
      const data = JSON.parse(auth)
      const isExpired = Date.now() - data.timestamp > EXPIRY_TIME_MS

      if (!isExpired) {
        setIsAuthenticated(true)
        setConfig(data.config)
        setCurrentCity(data.currentCity)
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    setIsAuthInitialized(true);
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isAuthInitialized,
    currentCity,
    login,
    logout,
    isLoginLoading: loginMutation.isPending,
    config,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};