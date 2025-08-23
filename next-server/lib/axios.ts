import axios from "axios";

const socketAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_API_URL! || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default socketAxios;
