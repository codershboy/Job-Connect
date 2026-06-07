import React, { createContext, useContext, useState, useEffect } from "react";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  title: string | null;
  skills: string | null;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (token: string, name: string, email: string, role: string, id: number, title: string | null, skills: string | null) => void;
  logout: () => void;
  updateUser: (name: string, title: string | null, skills: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");
    const savedRole = localStorage.getItem("userRole");
    const savedId = localStorage.getItem("userId");
    const savedTitle = localStorage.getItem("userTitle");
    const savedSkills = localStorage.getItem("userSkills");

    if (savedToken && savedName && savedEmail && savedRole) {
      setToken(savedToken);
      setUser({
        id: savedId ? Number(savedId) : 0,
        name: savedName,
        email: savedEmail,
        role: savedRole,
        title: savedTitle,
        skills: savedSkills
      });
    }
  }, []);

  const login = (jwtToken: string, name: string, email: string, role: string, id: number, title: string | null, skills: string | null) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", String(id));
    if (title) localStorage.setItem("userTitle", title);
    else localStorage.removeItem("userTitle");
    if (skills) localStorage.setItem("userSkills", skills);
    else localStorage.removeItem("userSkills");

    setToken(jwtToken);
    setUser({ id, name, email, role, title, skills });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userTitle");
    localStorage.removeItem("userSkills");

    setToken(null);
    setUser(null);
  };

  const updateUser = (name: string, title: string | null, skills: string | null) => {
    if (user) {
      localStorage.setItem("userName", name);
      if (title) localStorage.setItem("userTitle", title);
      else localStorage.removeItem("userTitle");
      if (skills) localStorage.setItem("userSkills", skills);
      else localStorage.removeItem("userSkills");

      setUser({
        ...user,
        name,
        title,
        skills
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
