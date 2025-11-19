import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLoginSuccess = (response) => {
    setUser(response.user);
    setOpenLogin(false);
    setOpenSignup(false);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("authToken", response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    toast.success("Logged out");
    navigate("/fundraising-products");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        openLogin,
        setOpenLogin,
        openSignup,
        setOpenSignup,
        handleLoginSuccess,
        openForgot,
        setOpenForgot,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook for easy usage
export const useAuth = () => useContext(AuthContext);
