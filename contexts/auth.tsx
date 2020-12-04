import React, { createContext, useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";

import api from "../services/api";
import { User } from "../core/interfaces/user";
import { Auth, LoginFunction, RegisterFunction } from "../core/interfaces/auth";
import { LoadingIndicator } from "../components/loading-indicator";

const AuthContext = createContext<Auth>({
  user: null,
  login: async () => {},
  register: async () => {},
  isLoading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        await api.post("/refresh");
        const { data } = await api.get("/me");
        setUser(data);
      } catch (err) {
        if (err.response?.status === 401) {
          await logout();
        }
      }
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const getUser = async () => {
    const { data } = await api.get("/me");
    setUser(data);
  };

  const login: LoginFunction = async (creds) => {
    await api.post("/login", creds);
    await getUser();
  };

  const register: RegisterFunction = async (form) => {
    await api.post("/register", form);
    await getUser();
  };

  const logout = async () => {
    if (Router.pathname === "/login") {
      return;
    }

    await api.delete("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectRoute: React.FC = ({ children }) => {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!user && router.pathname !== "/login") {
    router.push(`/login?next=${router.asPath}`);
  }

  return children as any;
};
