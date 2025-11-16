// components/AppHeaderBar/AppHeaderBar.tsx
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import LogoutButton from "./LogoutButton";

export const pages = [
  { name: "Salas de Reunião", link: "/salas-de-reuniao" },
  { name: "Minhas Reservas", link: "/minhas-reservas" },
  { name: "Minhas Salas", link: "/minhas-salas" },
];

export default function AppHeaderBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("key");
    navigate("/", { replace: true });
  };

  return (
    <AppBar position="static">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <MobileMenu pages={pages} onLogout={handleLogout} />
          <DesktopMenu pages={pages} onNavigate={(p: any) => navigate(p)} />
          <LogoutButton onLogout={handleLogout} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
