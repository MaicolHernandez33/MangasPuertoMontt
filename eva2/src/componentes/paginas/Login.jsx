import Titulo from "../atomos/Titulo";
import CampoTexto from "../atomos/CampoTexto";
import Boton from "../atomos/Boton";
import { useState } from "react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = () => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (usuarioValido) {
      if (
        usuarioValido.correo === "admin@tienda.cl" &&
        usuarioValido.password === "admin123"
      ) {
        alert("👑 Bienvenido Administrador");
        window.location.href = "/admin"; // redirige al panel admin
      } else {
        alert(`Bienvenido/a, ${usuarioValido.nombre}`);
        window.location.href = "/"; // redirige al inicio
      }
    } else {
      alert("❌ Correo o contraseña incorrectos.");
    }
  }; // 🔹 OJO: esta llave cierra bien la función iniciarSesion

  // 🔹 Aquí sí empieza el return principal del componente
  return (
    <section className="inicio">
      <Titulo texto="🔑 Iniciar Sesión" />
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
      <br />
      <Boton texto="Iniciar Sesión" onClick={iniciarSesion} />
    </section>
  );
}
