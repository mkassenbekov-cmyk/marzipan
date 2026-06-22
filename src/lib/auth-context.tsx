"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { User, UserRole } from "@/types";

const USERS: User[] = [
  { id: "1", name: "Мади", role: "owner" },
  { id: "2", name: "Ерлан", role: "director" },
  { id: "3", name: "Аскар", role: "admin_chef" },
  { id: "4", name: "Ночной адм.", role: "night_admin" },
  { id: "5", name: "Сборщик", role: "collector" },
  { id: "6", name: "Заготовщик", role: "preparer" },
  { id: "7", name: "Пекарь", role: "baker" },
  { id: "8", name: "Уборщица", role: "cleaner" },
  { id: "9", name: "Бухгалтер", role: "accountant" },
];

interface AuthCtx {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
  allUsers: USERS,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (role) => setUser(USERS.find((u) => u.role === role) ?? USERS[0]),
        logout: () => setUser(null),
        allUsers: USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
