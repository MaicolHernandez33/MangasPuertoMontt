import React, { useState } from "react";
import FormularioBase from "../organismos/FormularioBase";

export default function Registro({ cambiarPagina }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [celular, setCelular] = useState("");

  const registrarUsuario = (e) => {
    e.preventDefault();

    // Limpiar espacios
    const nombreTrim = nombre.trim();
    const correoTrim = correo.trim().toLowerCase();
    const passTrim = password.trim();
    const confirmarTrim = confirmar.trim();

    // Validaciones básicas
    if (!nombreTrim || !correoTrim || !passTrim || !confirmarTrim) {
      alert("⚠️ Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validar formato de correo permitido
    const dominioPermitido = /@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correoTrim);
    if (!dominioPermitido) {
      alert("⚠️ Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    // Validar fuerza de contraseña
    const okPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(passTrim);
    if (!okPass) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres, con mayúscula, minúscula y número.");
      return;
    }

    // Confirmar contraseñas
    if (passTrim !== confirmarTrim) {
      alert("❌ Las contraseñas no coinciden.");
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre: nombreTrim,
      correo: correoTrim,
      password: passTrim,
      celular: celular.trim(),
      rol: "usuario",
    };

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar duplicado
    const existe = usuarios.some((u) => u.correo === correoTrim);
    if (existe) {
      alert("⚠️ Este correo ya está registrado. Intenta con otro.");
      return;
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    window.dispatchEvent(new Event("storage")); // Actualiza navbar

    alert("✅ Registro exitoso. ¡Ya puedes iniciar sesión!");
    setNombre("");
    setCorreo("");
    setPassword("");
    setConfirmar("");
    setCelular("");
    cambiarPagina("login");
  };

  const camposRegistro = [
    { tipo: "text", placeholder: "Nombre completo", valor: nombre, onChange: setNombre },
    { tipo: "email", placeholder: "Correo electrónico", valor: correo, onChange: setCorreo },
    { tipo: "password", placeholder: "Contraseña", valor: password, onChange: setPassword },
    { tipo: "password", placeholder: "Confirmar contraseña", valor: confirmar, onChange: setConfirmar },
    { tipo: "tel", placeholder: "Número de celular (opcional)", valor: celular, onChange: setCelular },
  ];

  return (
    <FormularioBase
      tipo="registro"
      onSubmit={registrarUsuario}
      campos={camposRegistro}
      titulo="✍️ Crear cuenta"
      botonTexto="Registrarse"
    >
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ color: "#ccc" }}>
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => cambiarPagina("login")}
            className="boton-secundario"
            style={{
              background: "transparent",
              border: "none",
              color: "#ff5050",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ¡Inicia sesión!
          </button>
        </p>
      </div>
    </FormularioBase>
  );
}
