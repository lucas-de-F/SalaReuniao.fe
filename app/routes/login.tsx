import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ open: true, message, type });
  };

  const onFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usuario = formData.get("usuario");

    try {
      const response = await fetch(`http://localhost:5224/api/login/${usuario}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {
        showToast("Não foi possível conectar ao servidor.", "error");
        throw new Error("Network error");
      });

      if (!response || !response.ok) {
        showToast("Usuário inválido!", "error");
        return;
      }
      console.log(response);
      const data = await response.json();
      localStorage.setItem("key", data.token);

      showToast("Login realizado com sucesso!", "success");
      navigate("/salas-de-reuniao");

    } catch (error) {
      showToast("Erro inesperado ao fazer login.", "error");
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: 300,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Salas de reunião
        </Typography>

        <Box component="form" onSubmit={onFinish}>
          <TextField
            fullWidth
            name="usuario"
            label="Usuário"
            variant="outlined"
            margin="normal"
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
