import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import axios from "../api/axios";
import AuthContext from "./auth-context";

const AUTH_USER_KEY = "auth_user";

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!token) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);

      return {
        token,
        role: parsedUser.role,
        email: parsedUser.email,
      };
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  try {
    const decoded = jwtDecode(token);

    return {
      token,
      role: decoded.role,
      email: decoded.email,
    };
  } catch {
    console.error("Invalid token");
    localStorage.removeItem("token");
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

const persistUser = (token, user) => {
  const nextUser = {
    token,
    role: user.role,
    email: (user.email || "").trim().toLowerCase(),
  };

  localStorage.setItem("token", token);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      role: nextUser.role,
      email: nextUser.email,
    })
  );

  return nextUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const login = async (data) => {
    const res = await axios.post("/auth/login", data);
    const nextUser = persistUser(res.data.token, res.data.user);

    setUser(nextUser);
    return nextUser;
  };

  const sendOtp = async (email) => {
    const res = await axios.post("/auth/send-otp", { email });
    return res.data;
  };

  const verifyOtpRegistration = async (data) => {
    const res = await axios.post("/auth/verify-otp", data);
    const nextUser = persistUser(res.data.token, res.data.user);

    setUser(nextUser);
    return {
      ...res.data,
      user: nextUser,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        sendOtp,
        verifyOtpRegistration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
