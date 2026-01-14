import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await authApi.me();
        const u = res.data?.user;
        if (u) setUser({ _id: u._id || u.id, email: u.email, name: u.name });
      } catch (err) {
        setUser(null);
      }
    };
    init();
  }, []);

  const login = async (data) => {
    const response = await authApi.login(data);
    const u = response.data?.user;
    if (u) setUser({ _id: u.id, email: u.email, name: u.name });
    return response;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    return response;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);