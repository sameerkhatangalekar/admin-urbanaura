import axios from "axios";

export const baseUrl = 'https://urban-aura-backend.onrender.com/api/v1'

export const privateRequestInstance = axios.create({
    withCredentials: true,
    baseURL: baseUrl
});

