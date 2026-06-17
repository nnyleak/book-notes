export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!localStorage.getItem("token");
export const logout = () => localStorage.removeItem("token");

export const API_URL = import.meta.env.VITE_API_URL;