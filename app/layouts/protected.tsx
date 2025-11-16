// layouts/protected.tsx
import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { jwtService } from "~/services/jwtService";

type JwtPayload = {
  exp?: number;
  userId?: string;
};

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!jwtService.isValid()) {
      navigate("/", { replace: true });
      return;
    }

    setChecking(false);
  }, [navigate]);

  if (checking) return <div />;

  return <Outlet />;
}
