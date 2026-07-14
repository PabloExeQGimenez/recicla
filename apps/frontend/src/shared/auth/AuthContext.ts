import { createContext } from "react";
import type { AuthUser } from "./authStorage";

type AuthState = {
  isAuth: boolean;
  user: AuthUser | null;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);
