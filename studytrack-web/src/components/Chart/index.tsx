import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Meta, Estudo } from "../../types";

interface Props {
  metas: Meta[];
  estudos: Estudo[];
}

export default function Chart({ metas, estudos }: Props) {
  const data = metas.map((meta) => {
    const totalEstudado = estudos
      .filter((e) => e.metaId === meta.id)
      .reduce((acc, curr) => acc + curr.horas, 0);

    return {
      name: meta.materia,
      meta: meta.horasMeta,
      estudado: totalEstudado,
    };
  });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="meta" />
          <Bar dataKey="estudado" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}