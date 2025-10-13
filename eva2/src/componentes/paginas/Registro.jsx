import Titulo from "../atomos/Titulo";
import CampoTexto from "../atomos/CampoTexto";
import Boton from "../atomos/Boton";
import { useState } from "react";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [celular, setCelular] = useState("");

  const registrarUsuario = () => {
    // Validaciones
    if (!nombre || !correo || !password || !confirmar) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Crear objeto usuario
    const nuevoUsuario = { nombre, correo, password, celular };

    // Obtener usuarios actuales
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Registro exitoso. ¡Ya puedes iniciar sesión!");

    // Limpiar campos
    setNombre("");
    setCorreo("");
    setPassword("");
    setConfirmar("");
    setCelular("");

    // Redirigir al login
    window.location.href = "/login.html";
  };

  const irALogin = () => {
    window.location.href = "/login.html";
  };

  return (
    <section className="inicio">
      <Titulo texto="✍️ Crear cuenta" />

      <CampoTexto
        placeholder="Nombre completo"
        valor={nombre}
        onChange={setNombre}
      />

      <CampoTexto
        tipo="email"
        placeholder="Correo electrónico"
        valor={correo}
        onChange={setCorreo}
      />

      <CampoTexto
        tipo="password"
        placeholder="Contraseña"
        valor={password}
        onChange={setPassword}
      />

      <CampoTexto
        tipo="password"
        placeholder="Confirmar contraseña"
        valor={confirmar}
        onChange={setConfirmar}
      />

      <CampoTexto
        tipo="tel"
        placeholder="Número de celular (opcional)"
        valor={celular}
        onChange={setCelular}
      />

      <br />
      <Boton texto="Registrarse" onClick={registrarUsuario} />

      <p style={{ marginTop: "12px" }}>
        ¿Ya tienes una cuenta?{" "}
        <a
          href="#"
          onClick={irALogin}
          style={{ color: "#ff5050", textDecoration: "none", fontWeight: "bold" }}
        >
          Iniciar sesión
        </a>
      </p>
    </section>
  );
}
