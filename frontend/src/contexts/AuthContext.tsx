import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    avatar?: string,
  ) => Promise<void>;
  updateProfile: (data: {
    name: string;
    email: string;
    avatar?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUrl(url: string): string {
  if (url && !/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

const API_URL = `${normalizeUrl(import.meta.env.VITE_API_URL || "http://localhost:3000")}/auth`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("taskflow_user");
    const savedToken = localStorage.getItem("taskflow_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Erro ao fazer login" }));
      throw new Error(error.message || "E-mail ou senha inválidos");
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    localStorage.setItem("taskflow_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("taskflow_user");
    localStorage.removeItem("taskflow_token");
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    avatar?: string,
  ) => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar }),
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Erro ao cadastrar" }));
      throw new Error(error.message || "Erro ao criar conta");
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    localStorage.setItem("taskflow_token", data.token);
  };

  const updateProfile = async (profileData: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    if (!user) throw new Error("Usuário não autenticado");

    const res = await fetch(
      `${API_URL}/profile/${encodeURIComponent(user.id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      },
    );

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Erro ao atualizar perfil" }));
      throw new Error(error.message || "Erro ao atualizar perfil");
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    localStorage.setItem("taskflow_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
