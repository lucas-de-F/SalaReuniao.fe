import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { jwtService } from "~/services/jwtService";
import { ToastContainer } from "react-toastify";

export default function NoAuthLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (jwtService.isValid()) {
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
          <ToastContainer position="top-right" autoClose={3000} /> {/* ← aqui */}

    </div>
  );
}
