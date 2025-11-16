// components/AppHeaderBar/DesktopMenu.tsx
import { Box, Button } from "@mui/material";

interface Props {
  pages: { name: string; link: string }[];
  onNavigate: (path: string) => void;
}

export default function DesktopMenu({ pages, onNavigate }: Props) {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {pages.map((page) => (
        <Button
          key={page.name}
          onClick={() => onNavigate(page.link)}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          {page.name}
        </Button>
      ))}
    </Box>
  );
}
