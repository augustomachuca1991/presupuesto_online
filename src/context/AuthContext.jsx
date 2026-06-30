import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { audit } from "@/lib/audit";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = cargando, null = no logueado

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios
    const {
      data: { subscription },
    } =     supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") audit("auth.login", "auth");
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await audit("auth.logout", "auth");
    await supabase.auth.signOut();
    setUser(null);
  };

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const value = useMemo(() => ({ user, loading: user === undefined, signOut, signIn }), [user, signOut, signIn]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
