import { useParams } from "react-router";

export default function SalaForm() {
  const { id } = useParams();
  return <h1>{id === "new" ? "Criar Sala" : `Editar Sala ${id}`}</h1>;
}
