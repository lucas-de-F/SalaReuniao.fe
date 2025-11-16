import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function NoAuthLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem("key");

    // Se já estiver logado → manda para salas
    if (key) {
      navigate("/salas-de-reuniao", { replace: true });
      return;
    }

    setChecking(false);
  }, [navigate]);

  if (checking) return <div />;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5", // opcional
      }}
    >
      <Outlet />
    </div>
  );
}
