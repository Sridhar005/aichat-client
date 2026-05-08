import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { api } from "../utils/axios";
import { logoutUser } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";

type User = {
  id: string;
  email: string;
  plan: "basic" | "pro";
  fullName?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authReady: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ✅ Restore session from cookie */
  const refreshUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Unexpected auth error:", err);
      }
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/signup"
    ) {
      setAuthReady(true);
      return;
    }

    refreshUser();
  }, [location.pathname]);


  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authReady,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};