import { Outlet } from "react-router";
import AppHeaderBar from "./components/header/appHeader";
import { Container } from "@mui/material";

export default function AppLayout() {
  return (
    <div>
      <AppHeaderBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </div>
  );
}
