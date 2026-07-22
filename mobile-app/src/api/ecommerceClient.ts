import axios from "axios";

const ecommerceClient = axios.create({
  baseURL: "http://192.168.29.120:5001/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default ecommerceClient;