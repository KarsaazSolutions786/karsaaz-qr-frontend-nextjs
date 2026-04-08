import axios from "axios";

const BOT_API_BASE_URL = "/api";

const botClient = axios.create({
  baseURL: BOT_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const botAPI = {
  getResponse: async (payload: Record<string, unknown>) => {
    try {
      const response = await botClient.post("/bot", payload);
      const data = response.data || {};
      // Prefer 'answer' -> 'response' -> 'message'
      const text =
        data.answer || data.response || data.message || JSON.stringify(data);
      return typeof text === "string" ? text : JSON.stringify(text);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiData = error.response?.data;
        const msg =
          apiData?.detail ||
          apiData?.message ||
          error.message ||
          "Failed to fetch bot response";
        throw new Error(msg);
      }
      throw error;
    }
  },
};

