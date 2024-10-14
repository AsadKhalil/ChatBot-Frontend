import axios from "axios";
import { getValidToken } from "./auth";

// Function to get public IP address
async function getPublicIP() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Could not get public IP address", error);
    return null;
  }
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL: "https://api-nixon-profitoptics.insphere.ai/",
  // baseURL: "https://excited-regular-worm.ngrok-free.app/",
  // baseURL: "https://immortal-jolly-catfish.ngrok-free.app/",
  baseURL: "http://localhost:8000/",
  headers: {
    "ngrok-skip-browser-warning": true,
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 5 * 60 * 1000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("Interceptor did not find token");
    }

    // const publicIP = await getPublicIP();
    // if (publicIP) {
    //   console.log(publicIP)
    //   config.headers['X-Forwarded-For'] = publicIP;
    // } else {
    //   console.log("Could not retrieve public IP address");
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
