import { createContext, FC, ReactNode, useCallback, useState } from "react";
import {
  AppContextType,
  AttendanceSchemaType,
  LinkSchemaType
} from "../types";
import {
  getAttendanceData,
  getCities,
  getMasterData,
  linkBookiesID as linkBookiesIDService,
  registerAttendance as registerAttendanceService
} from "../services/api";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { ConfigType } from "../types/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined); // removed `any`

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [qrScanData, setQRScanData] = useState<string | null>(null);
  const { config } = useAuth();
  const queryClient = useQueryClient();

  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getCities();
      return res.cities;
    }
  });

  const { data: masterData, isLoading: isMasterDataLoading } = useQuery({
    queryKey: ["masterData", config],
    queryFn: () => getMasterData(config),
    enabled: !!config,
  });

  const { data: attendanceData, isLoading: isAttendanceDataLoading } = useQuery({
    queryKey: ["attendanceData", config],
    queryFn: () => getAttendanceData(config),
    enabled: !!config,
  });

  const registerAttendanceMutation = useMutation({
    mutationFn: ({ config, data }: { config: ConfigType, data: AttendanceSchemaType }) =>
      registerAttendanceService(config, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceData", config] });
    },
  });

  const registerAttendance = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (config: ConfigType, data: AttendanceSchemaType): Promise<any> => {
      try {
        const res = await registerAttendanceMutation.mutateAsync({ config, data });
        return res
      } catch (error) {
        console.log(error);
      }
    },
    [registerAttendanceMutation]
  );

  const linkBookieIDMutation = useMutation({
    mutationFn: ({ config, data }: { config: ConfigType, data: LinkSchemaType }) =>
      linkBookiesIDService(config, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masterData", config] });
    },
  });

  const linkBookiesID = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (config: ConfigType, data: LinkSchemaType): Promise<any> => {
      try {
        const res = await linkBookieIDMutation.mutateAsync({ config, data });
        return res
      } catch (error) {
        console.log(error);
      }
    },
    [linkBookieIDMutation]
  );

  const contextValue: AppContextType = {
    cities,
    isCitiesLoading,
    masterData,
    isMasterDataLoading,
    qrScanData,
    setQRScanData,
    attendanceData,
    isAttendanceDataLoading,
    registerAttendance,
    linkBookiesID
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};