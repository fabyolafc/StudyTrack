import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/api";
import "./styles.css";

import { FaEnvelope, FaLock } from "react-icons/fa";
import type { AuthResponse } from "../../types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha email e senha");
      return;
    }

    try {
      const data: AuthResponse = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "session_user",
        JSON.stringify({
          nome: data.nome ?? email,
          email,
        }),
      );

      toast.success("Login realizado!");
      navigate("/dashboard");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

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

        <button onClick={handleLogin}>Entrar</button>

        <p>
          Não tem conta? <Link to="/register">Cadastrar</Link>
        </p>
      </div>
    </div>
  );
}
