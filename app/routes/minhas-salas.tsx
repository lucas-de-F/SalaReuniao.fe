// React Router + Material UI CRUD de Salas de Reunião
// Estrutura completa: Listagem, Criar, Editar, Remover com Modal
// Arquivo principal: routes/salas.tsx

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { useNavigate } from "react-router";
import { salasService } from "~/services/salasService";
import { jwtService } from "~/services/jwtService";
import PaginationControl from "./components/SalasDeReuniao/PaginationControl";
import { toast } from "react-toastify";

// Tipagens ------------------------------------------------------
export interface DisponibilidadeDia {
  diaSemana: string;
  inicio: string;
  fim: string;
}

export interface Sala {
  id?: string;
  idResponsavel: string;
  nome: string;
  capacidade: number;
  descricao: string;
  valorHora: number;
  endereco: {
    numero: number;
    complemento: string;
    cep: string;
  };
  disponibilidadeSemanal: {
    disponibilidades: DisponibilidadeDia[];
  };
}

// Fake service (trocar pela API) -------------------------------


// Página de Listagem -------------------------------------------
export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [modalDelete, setModalDelete] = useState<{ open: boolean; sala?: Sala }>({ open: false });
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageSize: 0,
    totalPages: 0,
    page: 0,
  });
  const userId = jwtService.getDecoded()?.userId; // substituir pela lógica real de autenticação
  useEffect(() => {
    getSalas();
  }, [pageInfo.page , userId]);

  const getSalas = () => {
        salasService.getSalas(pageInfo.page, pageInfo.pageSize, { idResponsavel: userId } as any).then((resp) => {
      setSalas(resp.items);
      setPageInfo({
        totalItems: resp.totalItems,
        pageSize: resp.pageSize,
        totalPages: Math.ceil(resp.totalItems / resp.pageSize),
        page: resp.page,
      }); // Atualiza pageSize se necessário
    });
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Minhas Salas</Typography>
        <Button variant="contained" onClick={() => navigate("/minhas-salas/criar")}>Nova Sala</Button>
      </Box>
      <PaginationControl
        page={pageInfo.page}
        totalPages={pageInfo.totalPages}
        totalItems={pageInfo.totalItems}
        onChange={(newPage) => {
          setPageInfo((prev) => ({ ...prev, page: newPage }));
        }}
      />
      {salas.map((s) => (
        <Card key={s.id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">{s.nome}</Typography>
              <Typography variant="body2">Capacidade: {s.capacidade}</Typography>
              <Typography variant="body2">CEP: {s.endereco.cep}</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => navigate(`/minhas-salas/editar/${s.id}`)}>Editar</Button>
              <Button color="error" variant="outlined" onClick={() => setModalDelete({ open: true, sala: s })}>
                Excluir
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={modalDelete.open} onClose={() => setModalDelete({ open: false })}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir a sala <b>{modalDelete.sala?.nome}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalDelete({ open: false })}>Cancelar</Button>
          <Button color="error" onClick={async () => {
            if (modalDelete.sala?.id) {
              try {
                await salasService.remover(modalDelete.sala.id);

                toast.success("Sala excluída com sucesso!");
                getSalas();
              } catch (error) {
                toast.error("Erro ao excluir a sala.");
              }
            } 
            setModalDelete({ open: false });
            getSalas();
          }}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
