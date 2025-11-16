// services/salasService.ts
import api from "./api";

export interface Endereco {
  rua: string;
  numero: number;
  complemento: string;
  bairro: string;
  municipio: string;
  estado: string;
  cep: string;
}

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string;
  valorHora: number;
  endereco: Endereco;
}

export interface SalasFilter {
  id?: string;
  idProprietario?: string;
  nome?: string;
  data?: string;       // ISO date: YYYY-MM-DD
  horaInicio?: string; // HH:mm
  duracao?: string;    // HH:mm ou minutos
  capacidade?: number;
  estado?: string;
  municipio?: string;
  page?: number;
  pageSize?: number;
}
interface SalaResponse {
  items: Sala[];
  totalItems: number;
  page: number;
  pageSize: number;
}

export const salasService = {
  async getSalas(page: number, pageSize: number, filters: any): Promise<SalaResponse> {
    const { data } = await api.get("/SalaDeReuniao", {
      params: {
        page,
        pageSize,
        ...filters,
      },
    });
    return data;
  }
};
