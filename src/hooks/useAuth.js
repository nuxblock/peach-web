import { useState } from "react";

export function useAuth() {
  const auth = window.__PEACH_AUTH__ ?? null;

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (window.__PEACH_AUTH__) return true;
    try { return localStorage.getItem("peach_logged_in") !== "false"; } catch { return true; }
  });

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    try { localStorage.setItem("peach_logged_in", "true"); } catch {}
  };

  const handleLogout = () => {
    window.__PEACH_AUTH__ = null;
    setIsLoggedIn(false);
    setShowAvatarMenu(false);
    try { localStorage.setItem("peach_logged_in", "false"); } catch {}
  };

  return { auth, isLoggedIn, setIsLoggedIn, handleLogin, handleLogout, showAvatarMenu, setShowAvatarMenu };
}
