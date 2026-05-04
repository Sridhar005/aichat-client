import  { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null as any);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 AUTO LOGIN ON REFRESH
useEffect(() => {
  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);