import api from "./axios";
import Cookies from "js-cookie";

const authConfig = () => {
	const token = Cookies.get("token") || Cookies.get("Token") || Cookies.get("my_token");
	return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const createBid = (data) => api.post("/bids", data, authConfig());
export const getBids = (gigId) => api.get(`/bids/${gigId}`, authConfig());
export const getMyBids = (gigId) => api.get(`/bids/me/${gigId}`, authConfig());
export const hireBid = (bidId) => api.patch(`/bids/${bidId}/hire`, authConfig());