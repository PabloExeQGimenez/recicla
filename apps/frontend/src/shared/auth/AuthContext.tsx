import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { authStorage, type AuthUser } from "./authStorage";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    authStorage.getUser(),
  );
  const [isAuth, setIsAuth] = useState<boolean>(() =>
    authStorage.isAuthenticated(),
  );

  useEffect(() => {
    const sync = () => {
      setUser(authStorage.getUser());
      setIsAuth(authStorage.isAuthenticated());
    };

    window.addEventListener("auth:login", sync);
    window.addEventListener("auth:logout", sync);

    return () => {
      window.removeEventListener("auth:login", sync);
      window.removeEventListener("auth:logout", sync);
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuth,
      user,
      logout: () => {
        authStorage.clearSession();
        window.dispatchEvent(new Event("auth:logout"));
      },
    }),
    [isAuth, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
