import { ConfigType } from "./auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthResponse {
    success: boolean;
    data?: {
        City: string;
        "Mastersheet EP": string;
        "Attendance Sheet EP": string;
    };
    error?: string;
}

export interface MemberData {
    Name: string;
    "Bookies ID": string;
    Email: string;
    "Phone Number": number | string;
    [key: string]: any;
}

export interface AttendanceRecord {
    Timestamp: string;
    "Bookies ID": string;
    Name: string;
    Email: string;
    "Phone Number": number | string;
}

export interface AppContextType {
    isCitiesLoading: boolean;
    cities: string[],
    masterData: MemberData[],
    isMasterDataLoading: boolean,
    attendanceData: AttendanceRecord[],
    isAttendanceDataLoading: boolean,
    qrScanData: string | null;
    searchKey: string | null;
    setQRScanData: (data: string | null) => void;
    setSearchKey: (data: string | null) => void;
    registerAttendance: (config: ConfigType, data: AttendanceSchemaType) => Promise<any>,
    linkBookiesID: (config: ConfigType, data: LinkSchemaType) => Promise<any>,
    getMemberAttendance: (allCitiesConfig: ConfigType[], bookiesId: string) => Promise<any>,
}

export type AttendanceSchemaType = {
    bookiesId: string,
    name: string,
    email: string,
    phone: string
}

export type LinkSchemaType = {
    bookiesId: string,
    email: string,
}

export interface ScannerProps {
    onScan: (data: string) => void;
    onError?: (error: any) => void;
}

export interface TabData {
    key: string;
    title: string;
    icon: React.ElementType;
}