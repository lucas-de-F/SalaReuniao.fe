// layouts/protected.tsx
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
  userId?: string;
};

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("key");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // valida expiração
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        console.warn("JWT expirado");
        localStorage.removeItem("key");
        navigate("/", { replace: true });
        return;
      }

      // (opcional) checar se tem o claim userId
      if (!decoded.userId) {
        console.warn("JWT inválido: sem userId");
        navigate("/", { replace: true });
        return;
      }

      setChecking(false);
    } catch (err) {
      console.error("Token inválido", err);
      localStorage.removeItem("key");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (checking) return <div />;

  return <Outlet />;
}
