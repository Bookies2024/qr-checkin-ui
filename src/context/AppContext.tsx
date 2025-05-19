import { createContext, FC, ReactNode, useCallback, useState } from "react";
import {
  AppContextType,
  AttendanceSchemaType,
  MasterSchemaType
} from "../types";
import {
  getCities,
  getRecentCheckins,
  registerAttendance as registerAttendanceService,
  registerMember as registerMemberService,
  getMemberDetails as getMemberDetailsService
} from "../services/api";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined); // removed `any`

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [isQRScanPaused, setIsQRScanPaused] = useState<boolean>(false)
  const { currentCity } = useAuth();
  const queryClient = useQueryClient();

  const { data: cities, isLoading: isCitiesLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getCities();
      return res.data;
    }
  });

  const { data: recentCheckins, isLoading: isRecentCheckinsLoading } = useQuery({
    queryKey: ["recentCheckins"],
    queryFn: async () => {
      const res = await getRecentCheckins(currentCity)
      return res
    },
    enabled: !!currentCity,
  });


  const registerMemberMutation = useMutation({
    mutationFn: ({ data }: { data: MasterSchemaType }) =>
      registerMemberService(data),
  });

  const registerMember = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: MasterSchemaType): Promise<any> => {
      try {
        const res = await registerMemberMutation.mutateAsync({ data });
        return res
      } catch (error) {
        console.log(error);
      }
    },
    [registerMemberMutation]
  );

  const registerAttendanceMutation = useMutation({
    mutationFn: ({ data }: { data: AttendanceSchemaType }) =>
      registerAttendanceService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentCheckins"] });
    },
  });

  const registerAttendance = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: AttendanceSchemaType): Promise<any> => {
      try {
        const res = await registerAttendanceMutation.mutateAsync({ data });
        return res
      } catch (error) {
        console.log(error);
      }
    },
    [registerAttendanceMutation]
  );

  const getMemberDetailsMutation = useMutation({
    mutationFn: ({ bookiesId, homeCity }: { bookiesId: string, homeCity: string }) =>
      getMemberDetailsService(bookiesId, homeCity),
  });

  const getMemberDetails = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (bookiesId: string, homeCity: string): Promise<any> => {
      try {
        const res = await getMemberDetailsMutation.mutateAsync({ bookiesId, homeCity });
        return res
      } catch (error) {
        console.log(error);
      }
    },
    [getMemberDetailsMutation]
  );

  const contextValue: AppContextType = {
    cities,
    isCitiesLoading,
    recentCheckins,
    isRecentCheckinsLoading,
    isQRScanPaused,
    setIsQRScanPaused,
    registerMember,
    registerAttendance,
    getMemberDetails,
    isGetMemberDetailsLoading: getMemberDetailsMutation.isPending,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};