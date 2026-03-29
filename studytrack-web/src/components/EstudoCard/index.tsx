import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Estudo } from "../../types";
import "./styles.css"

interface Props {
  estudo: Estudo;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Estudo) => void;
}

export default function EstudoCard({ estudo, onDelete, onUpdate }: Props) {
  const [descricao, setDescricao] = useState(estudo.descricao);
  const [horas, setHoras] = useState(estudo.horas);
  const descricaoRef = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    onUpdate(estudo.id, {
      ...estudo,
      descricao,
      horas,
    });
    descricaoRef.current?.blur();
  };

  return (
    <div className="estudo-card">
      <input
        ref={descricaoRef}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="number"
        value={horas}
        onChange={(e) => setHoras(Number(e.target.value))}
      />

      <div className="card-actions">
        <button
          type="button"
          className="icon-button icon-edit"
          onClick={handleUpdate}
        >
          <FaEdit />
        </button>

        <button
          type="button"
          className="icon-button icon-delete"
          onClick={() => onDelete(estudo.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}