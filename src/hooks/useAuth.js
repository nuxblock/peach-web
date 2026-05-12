import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCache } from "./useApi.js";
import { invalidateUserPMs } from "./useUserPMs.js";
import { resetSessionExpiredFlag } from "../utils/sessionGuard.js";

export function useAuth() {
  const auth = window.__PEACH_AUTH__ ?? null;
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (window.__PEACH_AUTH__) return true;
    try { return localStorage.getItem("peach_logged_in") !== "false"; } catch { return true; }
  });

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    clearCache();
    invalidateUserPMs();
    resetSessionExpiredFlag();
    window.__PEACH_AUTH__ = null;
    setIsLoggedIn(false);
    setShowAvatarMenu(false);
    try { localStorage.setItem("peach_logged_in", "false"); } catch {}
    try { sessionStorage.removeItem("peach_auth"); } catch {}
  };

  return { auth, isLoggedIn, setIsLoggedIn, handleLogin, handleLogout, showAvatarMenu, setShowAvatarMenu };
}
