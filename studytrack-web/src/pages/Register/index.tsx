import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/api";
import "../login/styles.css";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !password.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await register(nome, email, password);

      toast.success("Cadastro realizado!");
      navigate("/");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <div className="container">
      <div className="card">
        <h2>Cadastro</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRegister}>Cadastrar</button>

        <p>
          Já tem conta? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
