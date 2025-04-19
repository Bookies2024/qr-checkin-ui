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
  registerAttendance as registerAttendanceService,
  getMemberAttendance as getMemberAttendanceService
} from "../services/api";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { ConfigType } from "../types/auth";
import { CONFIG_RESPONSE_KEYS, DATA_RESPONSE_KEYS } from "../utils/constants";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined); // removed `any`

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [qrScanData, setQRScanData] = useState<string | null>(null);
  const [isQRScanPaused, setIsQRScanPaused] = useState<boolean>(false)
  const [searchKey, setSearchKey] = useState<string | null>(null)
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
    queryFn: async () => {
      const res = await getMasterData(config)
      return res
    },
    enabled: !!config,
  });

  const { data: attendanceData, isLoading: isAttendanceDataLoading } = useQuery({
    queryKey: ["attendanceData", config],
    queryFn: async () => {
      const res = await getAttendanceData(config)
      return res
    },
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

  const getMemberAttendanceMutation = useMutation({
    mutationFn: ({ allCitiesConfig, bookiesId }: { allCitiesConfig: ConfigType[], bookiesId: string }) =>
      getMemberAttendance(allCitiesConfig, bookiesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberAttendance", config] });
    },
  });

  const getMemberAttendance = useCallback(
    async (allCitiesConfig: ConfigType[], bookiesId: string): Promise<AttendanceSchemaType[] | undefined> => {
      try {
        const allResponses = await Promise.allSettled(
          allCitiesConfig.map(config =>
            getMemberAttendanceService(config[CONFIG_RESPONSE_KEYS.ATTENDANCE_EP], bookiesId)
              .then(data => ({ data, city: config[CONFIG_RESPONSE_KEYS.CITY] }))
          )
        );

        const allAttendance: AttendanceSchemaType[] = [];

        for (const res of allResponses) {
          if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
            const enrichedData = res.value.data.map(record => ({
              ...record,
              city: res.value.city,
            }));
            allAttendance.push(...enrichedData);
          }
        }

        return allAttendance.sort(
          (a, b) => new Date(b[DATA_RESPONSE_KEYS.TIMESTAMP]).getTime() -
            new Date(a[DATA_RESPONSE_KEYS.TIMESTAMP]).getTime()
        );
      } catch (error) {
        console.error("Failed to fetch combined attendance:", error);
      }
    },
    [getMemberAttendanceMutation]
  );

  const setQRScanPauseState = (value: boolean) => {
    if (value) {
      setIsQRScanPaused(true)
    } else {
      setTimeout(() => {
        setIsQRScanPaused(false)
      }, 2000);
    }
  }

  const contextValue: AppContextType = {
    cities,
    isCitiesLoading,
    masterData,
    isMasterDataLoading,
    qrScanData,
    setQRScanData,
    searchKey,
    setSearchKey,
    attendanceData,
    isAttendanceDataLoading,
    isQRScanPaused,
    setQRScanPauseState,
    registerAttendance,
    linkBookiesID,
    getMemberAttendance
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};