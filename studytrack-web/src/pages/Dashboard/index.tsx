import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMetas,
  createMeta,
  deleteMeta,
  updateMeta,
  getEstudos,
  createEstudo,
  updateEstudo,
  deleteEstudo,
} from "../../services/api";

import MetaCard from "../../components/MetaCard";
import EstudoCard from "../../components/EstudoCard";
import Chart from "../../components/Chart";

import {
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";

import type { Estudo, Meta } from "../../types";

import "./styles.css";

export default function Dashboard() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [estudos, setEstudos] = useState<Estudo[]>([]);

  const [materia, setMateria] = useState("");
  const [horasMeta, setHorasMeta] = useState(0);

  const [descricao, setDescricao] = useState("");
  const [horas, setHoras] = useState(0);
  const [metaId, setMetaId] = useState(0);

  const user = JSON.parse(localStorage.getItem("session_user") || "{}");

  const loadData = async () => {
    try {
      const metasData = await getMetas();
      const estudosData = await getEstudos();

      setMetas(metasData);
      setEstudos(estudosData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  // ================= METAS =================

  const handleCreateMeta = async () => {
    if (!materia || !horasMeta) {
      toast.error("Preencha matéria e horas antes de criar a meta.");
      return;
    }

    try {
      await createMeta({ materia, horasMeta });
      toast.success("Meta criada com sucesso!");
      setMateria("");
      setHorasMeta(0);
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar meta."
      );
    }
  };

  const handleDeleteMeta = async (id: number) => {
    try {
      const estudosDaMeta = estudos.filter((e) => e.metaId === id);

      await Promise.all(estudosDaMeta.map((e) => deleteEstudo(e.id)));
      await deleteMeta(id);
      toast.success("Meta deletada com sucesso!");
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao deletar meta."
      );
    }
  };

  const handleUpdateMeta = async (id: number, meta: Meta) => {
    try {
      await updateMeta(id, {
        materia: meta.materia,
        horasMeta: meta.horasMeta,
      });
      toast.success("Meta atualizada com sucesso!");
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar meta."
      );
    }
  };

  // ================= ESTUDOS =================

  const handleCreateEstudo = async () => {
    if (!horas || !metaId) {
      toast.error("Selecione uma meta e informe horas para criar o estudo.");
      return;
    }

    try {
      await createEstudo({ descricao, horas, metaId });
      toast.success("Estudo criado com sucesso!");
      setDescricao("");
      setHoras(0);
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar estudo."
      );
    }
  };

  const handleDeleteEstudo = async (id: number) => {
    try {
      await deleteEstudo(id);
      toast.success("Estudo deletado com sucesso!");
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao deletar estudo."
      );
    }
  };

  const handleUpdateEstudo = async (id: number, estudo: Estudo) => {
    try {
      await updateEstudo(id, {
        descricao: estudo.descricao,
        horas: estudo.horas,
        metaId: estudo.metaId,
      });
      toast.success("Estudo atualizado com sucesso!");
      loadData();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar estudo."
      );
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <span className="logo">📊</span>
          <h2>StudyTrack</h2>
        </div>

        <div className="user-info">
          Olá,<span>{user?.nome || user?.email}</span> 
          <button className="logout" onClick={logout}>
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="chart-container">
        <div className="chart-card">
          <h2>📈 Progresso</h2>
          <Chart metas={metas} estudos={estudos} />
        </div>
      </div>

       <div className="img-principal">
        <img src="/meta.png" alt="Imagem de pessoas em cima de um seta" />
      </div>

      {/* GRID */}
      <div className="grid">
        {/* METAS */}
        <div className="card">
          <h2>Metas</h2>

          <input
            placeholder="Matéria"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          />

          <input
            type="number"
            placeholder="Horas"
            value={horasMeta}
            onChange={(e) => setHorasMeta(Number(e.target.value))}
          />

          <button className="btn btn-green" onClick={handleCreateMeta}>
            <FaPlus /> Criar
          </button>

          {metas.map((meta) => (
            <MetaCard
              key={meta.id}
              meta={meta}
              onDelete={handleDeleteMeta}
              onUpdate={handleUpdateMeta}
            />
          ))}
        </div>

        {/* ESTUDOS */}
        <div className="card">
          <h2>Estudos</h2>

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Horas"
            value={horas}
            onChange={(e) => setHoras(Number(e.target.value))}
          />

          <select onChange={(e) => setMetaId(Number(e.target.value))}>
            <option value={0}>Selecione uma meta</option>
            {metas.map((meta) => (
              <option key={meta.id} value={meta.id}>
                {meta.materia}
              </option>
            ))}
          </select>

          <button className="btn btn-green" onClick={handleCreateEstudo}>
            <FaPlus /> Adicionar
          </button>

          {estudos.map((estudo) => (
            <EstudoCard
              key={estudo.id}
              estudo={estudo}
              onDelete={handleDeleteEstudo}
              onUpdate={handleUpdateEstudo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}