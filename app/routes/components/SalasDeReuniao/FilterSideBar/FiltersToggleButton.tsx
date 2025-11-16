// components/FiltersSidebar/FiltersToggleButton.tsx
import { IconButton } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
export default function FiltersToggleButton({ onClick, show }: any) {
  return (
    <div>

    <IconButton
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        top: 80,
        left: 16,
        zIndex: 0,
      }}
      onClick={onClick}
      >
      <FilterAltIcon /> 
    </IconButton>
      </div>
  );
}
