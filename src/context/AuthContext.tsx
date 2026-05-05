import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react"
import { getMe, logoutUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

type User = {
  id: string;
  email: string;
  plan: "basic" | "pro";
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  authReady: boolean;
  logout: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();

  /* ✅ Load user once on app start */
  const refreshUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthReady(true); // ✅ always resolve auth check
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  /* ✅ Logout handler */
  
const logout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error("Logout API failed:", err);
  } finally {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        refreshUser,
        authReady,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
