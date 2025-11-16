import { Outlet } from "react-router";
import AppHeaderBar from "./components/header/appHeader";
import { Container } from "@mui/material";
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  return (
    <div className="w-full h-full">
      <AppHeaderBar />
      <Container  maxWidth={false} className="w-full h-full">
        <Outlet />
          <ToastContainer position="top-right" autoClose={3000} /> {/* ← aqui */}
      </Container>
    </div>
  );
}
