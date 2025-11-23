import React, { useState } from "react";
import FormularioBase from "../organismos_temp/FormularioBase";

export default function Registro({ cambiarPagina }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [celular, setCelular] = useState("");
  const [cargando, setCargando] = useState(false);

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Limpiar espacios
    const nombreTrim = nombre.trim();
    const correoTrim = correo.trim().toLowerCase();
    const passTrim = password.trim();
    const confirmarTrim = confirmar.trim();

    // Validaciones básicas 
    if (!nombreTrim || !correoTrim || !passTrim || !confirmarTrim) {
      alert("⚠️ Por favor completa todos los campos obligatorios.");
      setCargando(false);
      return;
    }

    // Validar formato de correo permitido
    const dominioPermitido = /@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correoTrim);
    if (!dominioPermitido) {
      alert("⚠️ Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
      setCargando(false);
      return;
    }

    // Validar contraseña
    const okPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(passTrim);
    if (!okPass) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres, con mayúscula, minúscula y número.");
      setCargando(false);
      return;
    }

    // Confirmar contraseñas
    if (passTrim !== confirmarTrim) {
      alert("❌ Las contraseñas no coinciden.");
      setCargando(false);
      return;
    }

    try {
      // Enviar registro a la API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreTrim,
          correo: correoTrim,
          password: passTrim,
          celular: celular.trim() || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Registro exitoso
      alert("Registro exitoso. ¡Ya puedes iniciar sesión!");
      
      // Limpiar formulario
      setNombre("");
      setCorreo("");
      setPassword("");
      setConfirmar("");
      setCelular("");
      
      // Redirigir a login
      cambiarPagina("login");

    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
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
      botonTexto={cargando ? "Registrando..." : "Registrarse"}
      deshabilitado={cargando}
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
            disabled={cargando}
          >
            ¡Inicia sesión!
          </button>
        </p>
      </div>
    </FormularioBase>
  );
}