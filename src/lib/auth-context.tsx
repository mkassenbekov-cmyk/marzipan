"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, UserRole } from "@/types";

// Role mapping: email → role
const EMAIL_ROLES: Record<string, { name: string; role: UserRole }> = {
  "madi@marzipan.kz": { name: "Мади", role: "owner" },
  "askar@marzipan.kz": { name: "Аскар", role: "admin_chef" },
};

interface AuthCtx {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  loginWithEmail: async () => null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (supaUser: { id: string; email?: string }): User | null => {
    const email = supaUser.email ?? "";
    const mapping = EMAIL_ROLES[email];
    if (!mapping) return null;
    return { id: supaUser.id, name: mapping.name, role: mapping.role };
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) setUser(mapSupabaseUser(session.user));
      setLoading(false);
    }).catch(() => { clearTimeout(timeout); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (!EMAIL_ROLES[email]) return "Пользователь не найден в системе";
    return null;
  };

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
