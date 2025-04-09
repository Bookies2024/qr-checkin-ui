import axios from "axios"
import { ENV } from "../utils/constants";
import { AttendanceSchemaType, LinkSchemaType } from "../types";
import { ConfigType } from "../types/auth";

export const getCities = async () => {
  try {
    const res = await axios.get(`${ENV.CONFIG_SHEET_EP}?key=${ENV.API_KEY}`)
    return res?.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const getAttendanceData = async (config: ConfigType) => {
  try {
    const res = await axios.get(`${config.attendanceSheetEndPoint}?key=${ENV.API_KEY}`);
    return res?.data;
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
}

export const getMasterData = async (config: ConfigType) => {
  try {
    const res = await axios.get(`${config.masterSheetEndPoint}?key=${ENV.API_KEY}`);
    return res?.data;
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};

export const login = async (city: string, passkey: string) => {
  try {
    const res = await axios.post(
      `${ENV.CONFIG_SHEET_EP}?key=${ENV.API_KEY}`,
      JSON.stringify({ city, passkey }),
      {
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        maxRedirects: 5,
      }
    );

    if (!res?.data?.success) {
      throw new Error("Invalid credentials");
    }

    return res?.data?.data;
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export const registerAttendance = async (config: ConfigType, data: AttendanceSchemaType) => {
  try {
    const res = await axios.post(
      `${config.attendanceSheetEndPoint}?key=${ENV.API_KEY}`,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        maxRedirects: 5,
      }
    );

    return res?.data;
  } catch (error) {
    console.error("Attendance registration failed:", error);
    throw error;
  }
}

export const linkBookiesID = async (config: ConfigType, data: LinkSchemaType) => {
  try {
    const res = await axios.post(
      `${config.masterSheetEndPoint}?key=${ENV.API_KEY}`,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        maxRedirects: 5,
      }
    );

    return res?.data;
  } catch (error) {
    console.error("Id Linking failed:", error);
    throw error;
  }
}