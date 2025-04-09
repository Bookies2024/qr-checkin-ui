import React, { createContext, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContextType, AuthProviderProps, ConfigType } from "../types/auth";
import { CONFIG_RESPONSE_KEYS } from "../utils/constants";
import { login as getConfig } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState<ConfigType | null>(null);

  const loginMutation = useMutation({
    mutationFn: ({ city, passkey }: { city: string; passkey: string }) =>
      getConfig(city, passkey),
  });

  const login = useCallback(
    async (city: string, passkey: string): Promise<boolean> => {
      try {
        const data = await loginMutation.mutateAsync({ city, passkey });

        const configData: ConfigType = {
          city: data[CONFIG_RESPONSE_KEYS.CITY],
          masterSheetEndPoint: data[CONFIG_RESPONSE_KEYS.MASTER_EP],
          attendanceSheetEndPoint: data[CONFIG_RESPONSE_KEYS.ATTENDANCE_EP],
        };

        setIsAuthenticated(true);
        setConfig(configData);

        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    [loginMutation]
  );

  const contextValue: AuthContextType = {
    isAuthenticated,
    login,
    isLoginLoading: loginMutation.isPending,
    config,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};