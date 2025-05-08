/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AttendanceRecord {
    Timestamp: string;
    "Bookies ID": string;
    "Home City": string;
    City?: string;
}

export interface AppContextType {
    isCitiesLoading: boolean;
    cities: string[],
    recentCheckins: AttendanceRecord[],
    isRecentCheckinsLoading: boolean,
    isGetMemberDetailsLoading: boolean,
    isQRScanPaused: boolean;
    setIsQRScanPaused: (value: boolean) => void
    registerMember: (data: MasterSchemaType) => Promise<any>,
    registerAttendance: (data: AttendanceSchemaType) => Promise<any>,
    getMemberDetails: (bookiesId: string, homeCity: string) => Promise<any>,
}

export type MasterSchemaType = {
    bookiesId: string,
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: string,
    city: string,
}

export type AttendanceSchemaType = {
    bookiesId: string,
    city: string,
    homeCity?: string
}

export interface ScannerProps {
    onScan: (data: string) => void;
    onError?: (error: any) => void;
}