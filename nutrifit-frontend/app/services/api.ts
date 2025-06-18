import axios from "axios";
import { UserDataType } from "../context/userDataContext";

// Ganti dengan IP address komputer Anda
// const API_BASE_URL = "https://content-formally-primate.ngrok-free.app";

// Local development URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const registerUser = async (userData: UserDataType) => {
  try {
    // Transform data to match backend's expected format
    const payload = {
      email: userData.email,
      password: userData.password,
      display_name: userData.preferredName,
      age: userData.age,
      gender: userData.gender,
      weight: userData.weight,
      height: userData.height,
      activity_level: userData.activityLevel,
    };

    console.log("Sending registration data:", {
      ...payload,
      password: "***", // Hide password in logs
    });

    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data) {
      throw new Error('No response from server');
    }

    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error details:", {
      error: error,
      response: axios.isAxiosError(error)
        ? {
          data: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        }
        : null,
      request: axios.isAxiosError(error)
        ? {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
          headers: error.config?.headers,
        }
        : null,
    });

    if (axios.isAxiosError(error)) {
      // Get more specific error message from backend if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      console.error("Error message:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error creating account");
  }
};
