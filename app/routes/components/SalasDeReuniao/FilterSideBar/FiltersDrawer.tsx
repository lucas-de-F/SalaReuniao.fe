// components/FiltersSidebar/FiltersDrawer.tsx
import { Drawer, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiltersContent from "./FiltersContent";

export default function FiltersDrawer({ open, onClose, filters, onChange }: any) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <FiltersContent  filters={filters} onChange={onChange} />
    </Drawer>
  );
}
