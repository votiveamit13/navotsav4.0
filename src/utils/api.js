// src/utils/api.js
import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // replace with your API
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Interceptors (optional for auth token)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
}, (error) => Promise.reject(error));


export const callApi = async (method, url, data = {}, params = {}) => {
    const isFormData = data instanceof FormData;
    const response = await API({
        method,
        url,
        data,
        params,
        headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
    });
    return response.data;

};


