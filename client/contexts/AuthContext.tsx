import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "../lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: "super_admin" | "admin";
  organization_id?: number;
}

interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRedirecting: boolean;
  handleTokenExpiration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");

    if (savedToken) {
      setToken(savedToken);
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setIsLoading(true);
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData as User);
      setToken(tokenToValidate);
      setIsLoading(false);
    } catch (error: any) {
      // Check if error is due to token expiration (401 Unauthorized)
      if (error?.status === 401) {
        handleTokenExpiration();
      } else {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
        setIsLoading(false);
      }
    }
  };

  const handleTokenExpiration = () => {
    setIsRedirecting(true);
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);

    // Redirect to login page
    window.location.href = "/login";
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = (await apiClient.login(email, password)) as LoginResponse;

      if (data?.status === "success" && data?.token && data?.user) {
        const authToken = data.token;

        localStorage.setItem("auth_token", authToken);
        setToken(authToken);
        setUser(data.user);
        return true;
      } else {
        console.error("Login response missing required fields:", data);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiClient.logout();
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isRedirecting,
    handleTokenExpiration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
