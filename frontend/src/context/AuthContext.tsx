import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import api from "../api/axios";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET CURRENT USER
  // =========================

  const refreshUser = async () => {
    const token = localStorage.getItem(
      "nextora_token"
    );

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);

      localStorage.setItem(
        "nextora_user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error
      );

      localStorage.removeItem(
        "nextora_token"
      );

      localStorage.removeItem(
        "nextora_user"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const { token, user } = response.data;

    localStorage.setItem(
      "nextora_token",
      token
    );

    localStorage.setItem(
      "nextora_user",
      JSON.stringify(user)
    );

    setUser(user);
  };



  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "nextora_token"
    );

    localStorage.removeItem(
      "nextora_user"
    );

    setUser(null);
  };

  // =========================
  // INITIAL AUTH CHECK
  // =========================

  useEffect(() => {
    refreshUser();
  }, []);

  // =========================
  // PROVIDER
  // =========================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// useAuth
// =========================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};