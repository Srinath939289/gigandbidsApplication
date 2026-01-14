import api from "./axios";
import Cookies from "js-cookie";

export const createGig = (data) => {
  const token = Cookies.get("token") || Cookies.get("Token") || Cookies.get("my_token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return api.post("/gigs", data, config);
};

export const fetchGigs = () => api.get("/gigs");