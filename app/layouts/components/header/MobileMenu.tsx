// components/AppHeaderBar/MobileMenu.tsx
import React from "react";
import { Menu, MenuItem, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";

interface Props {
  pages: { name: string; link: string }[];
  onLogout: () => void;
}

export default function MobileMenu({ pages, onLogout }: Props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="menu"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {pages.map((page) => (
          <MenuItem
            key={page.name}
            onClick={() => {
              navigate(page.link);
              setAnchorEl(null);
            }}
          >
            <Typography>{page.name}</Typography>
          </MenuItem>
        ))}

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onLogout();
          }}
        >
          <Typography>Sair</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
