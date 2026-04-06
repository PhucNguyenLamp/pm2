import { createContext, useState, useEffect } from "react";

// interface AuthContextType {
//   user: string | null;
//   token: string | null;
//   logout: () => void;
// }

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
