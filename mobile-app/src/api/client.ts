import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.29.120:5000/api/v1/auth",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
