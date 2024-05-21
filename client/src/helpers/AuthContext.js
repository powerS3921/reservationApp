import { createContext } from "react";

export const AuthContext = createContext({
  authState: { username: "", id: "", status: false },
  setAuthState: () => {},
});
