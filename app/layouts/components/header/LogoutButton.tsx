// components/AppHeaderBar/LogoutButton.tsx
import { Box, Button } from "@mui/material";

interface Props {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: Props) {
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Button color="inherit" onClick={onLogout}>
        Sair
      </Button>
    </Box>
  );
}
