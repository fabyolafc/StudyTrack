import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Meta } from "../../types";

interface Props {
  meta: Meta;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Meta) => void;
}

export default function MetaCard({ meta, onDelete, onUpdate }: Props) {
  const [materia, setMateria] = useState(meta.materia);
  const [horas, setHoras] = useState(meta.horasMeta);
  const materiaRef = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    onUpdate(meta.id, {
      ...meta,
      materia,
      horasMeta: horas,
    });
    materiaRef.current?.blur();
  };

  return (
    <div className="meta-card">
      <input
        ref={materiaRef}
        value={materia}
        onChange={(e) => setMateria(e.target.value)}
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
          onClick={() => onDelete(meta.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}