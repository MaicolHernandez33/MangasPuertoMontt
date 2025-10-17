import React, { useState } from 'react';
import FormularioBase from '../organismos/FormularioBase'; // Importamos el formulario base
import Titulo from '../atomos/Titulo'; // Importamos el componente de Titulo

export default function Registro({ cambiarPagina }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [celular, setCelular] = useState("");

  const registrarUsuario = (e) => {
    e.preventDefault();
    if (!nombre || !correo || !password || !confirmar) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const nuevoUsuario = { nombre, correo, password, celular };
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Registro exitoso. ¡Ya puedes iniciar sesión!");
    setNombre("");
    setCorreo("");
    setPassword("");
    setConfirmar("");
    setCelular("");

    cambiarPagina("login"); // Redirigir al login después del registro
  };

  // Campos para el formulario de registro
  const camposRegistro = [
    { tipo: 'text', placeholder: 'Nombre completo', valor: nombre, onChange: setNombre, maxlength: 100, requerido: true },
    { tipo: 'email', placeholder: 'Correo electrónico', valor: correo, onChange: setCorreo, maxlength: 100, requerido: true },
    { tipo: 'password', placeholder: 'Contraseña', valor: password, onChange: setPassword, maxlength: 20, requerido: true },
    { tipo: 'password', placeholder: 'Confirmar contraseña', valor: confirmar, onChange: setConfirmar, maxlength: 20, requerido: true },
    { tipo: 'tel', placeholder: 'Número de celular (opcional)', valor: celular, onChange: setCelular, maxlength: 15, requerido: false }
  ];

  return (
    <FormularioBase
      tipo="registro"
      onSubmit={registrarUsuario}
      campos={camposRegistro}
      titulo="✍️ Crear cuenta"
      botonTexto="Registrarse"
    >
      {/* Enlace a login */}
      <div style={{ marginTop: '20px' }}>
        <p>¿Ya tienes cuenta? <button onClick={() => cambiarPagina("login")} style={{ color: "#ff5050", textDecoration: "underline" }}>Iniciar sesión</button></p>
      </div>
    </FormularioBase>
  );
}
