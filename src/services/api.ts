import axios from "axios"
import { CONFIG_TYPES, ENV, GET_REQ_TYPES, POST_REQ_TYPES } from "../utils/constants";
import { AttendanceSchemaType, MasterSchemaType } from "../types";

export const getCities = async () => {
  try {
    const res = await axios.get(`${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.CONFIG_KEYS}&type=${CONFIG_TYPES.CITY}`)
    return res?.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const getRecentCheckins = async (city: string) => {
  try {
    const res = await axios.get(`${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.RECENT_CHECKINS}&city=${city}`)
    return res?.data?.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const getMemberDetails = async (bookiesId: string, homeCity: string) => {
  try {
    const res = await axios.get(`${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.MEMBER_DETAILS}&bookiesId=${bookiesId}&homeCity=${homeCity}`)
    return res?.data?.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export const login = async (city: string, password: string) => {
  try {
    const res = await axios.post(
      `${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.AUTH}`,
      JSON.stringify({ city, password }),
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
    throw error;
  }
};

export const registerAttendance = async (data: AttendanceSchemaType) => {
  try {
    const res = await axios.post(
      `${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.RECORD}`,
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

export const registerMember = async (data: MasterSchemaType) => {
  try {
    const res = await axios.post(
      `${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.REGISTER}`,
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
    console.error("Member registration failed:", error);
    throw error;
  }
}