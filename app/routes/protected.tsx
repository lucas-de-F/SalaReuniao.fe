import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const key = localStorage.getItem("key");

    if (!key) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
}
