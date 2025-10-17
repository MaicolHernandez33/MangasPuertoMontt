import React, { useState } from 'react';
import FormularioBase from '../organismos/FormularioBase'; // Importamos el formulario base
import Titulo from '../atomos/Titulo'; // Importamos el componente de Titulo

export default function Login({ cambiarPagina }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValido = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (usuarioValido) {
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
      if (
        usuarioValido.correo === "admin@tienda.cl" &&
        usuarioValido.password === "admin123"
      ) {
        alert("👑 Bienvenido Administrador");
        cambiarPagina("admin");
      } else {
        alert(`Bienvenido/a, ${usuarioValido.nombre}`);
        cambiarPagina("inicio");
      }
    } else {
      alert("❌ Correo o contraseña incorrectos.");
    }
  };

  // Definimos los campos del formulario de login
  const camposLogin = [
    { tipo: 'email', placeholder: 'Correo electrónico', valor: correo, onChange: setCorreo, maxlength: 100, requerido: true },
    { tipo: 'password', placeholder: 'Contraseña', valor: password, onChange: setPassword, maxlength: 20, requerido: true }
  ];

  return (
    <FormularioBase
      tipo="login"
      onSubmit={iniciarSesion}
      campos={camposLogin}
      titulo="🔑 Iniciar Sesión"
      botonTexto="Iniciar Sesión"
    >
      {/* Enlace a registro */}
      <div style={{ marginTop: '20px' }}>
        <p>¿No tienes cuenta? <button onClick={() => cambiarPagina("registro")} style={{ color: "#ff5050", textDecoration: "underline" }}>¡Registrate aquí!</button></p>
      </div>
    </FormularioBase>
  );
}
