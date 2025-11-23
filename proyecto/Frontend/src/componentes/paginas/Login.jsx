import React, { useState } from "react";
import FormularioBase from "../organismos/FormularioBase";

export default function Login({ cambiarPagina }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Caso especial: Admin por defecto
      if (correo === "admin@tienda.cl" && password === "admin123") {
        const adminUser = {
          id: 1, // ID fijo para el admin
          nombre: "Administrador",
          correo: "admin@tienda.cl",
          rol: "admin",
        };

        localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));
        window.dispatchEvent(new Event("storage"));

        alert("👑 Bienvenido Administrador Principal");
        cambiarPagina("admin");
        return;
      }

      // Login contra la API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const usuario = data.usuario;

      // ✅ Solo guardamos usuario activo (necesario para navbar)
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      window.dispatchEvent(new Event("storage"));

      // ✅ Merge de carrito anónimo con BD
      await mergeCarritosBD(usuario.id);

      if (usuario.rol === "admin") {
        alert(`👑 Bienvenido Administrador ${usuario.nombre}`);
        cambiarPagina("admin");
      } else {
        alert(`✅ Bienvenido/a, ${usuario.nombre}`);
        cambiarPagina("inicio");
      }

    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Función simplificada para mergear carrito
  const mergeCarritosBD = async (usuarioId) => {
    try {
      const carritoLocal = JSON.parse(localStorage.getItem("carrito_anonimo") || "[]");
      if (carritoLocal.length === 0) return;

      // Agregar cada item a la BD
      for (const item of carritoLocal) {
        await fetch('http://localhost:5000/api/carrito', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'usuario-id': usuarioId.toString()
          },
          body: JSON.stringify({
            producto_id: item.id,
            cantidad: item.cantidad || 1
          }),
        });
      }

      localStorage.removeItem("carrito_anonimo");

    } catch (error) {
      console.error("Error mergeando carritos:", error);
    }
  };

  const camposLogin = [
    { tipo: "email", placeholder: "Correo electrónico", valor: correo, onChange: setCorreo },
    { tipo: "password", placeholder: "Contraseña", valor: password, onChange: setPassword },
  ];

  return (
    <FormularioBase
      tipo="login"
      onSubmit={iniciarSesion}
      campos={camposLogin}
      titulo="🔑 Iniciar Sesión"
      botonTexto={cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
      deshabilitado={cargando}
    >
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ color: "#ccc" }}>
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => cambiarPagina("registro")}
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
            ¡Regístrate aquí!
          </button>
        </p>
      </div>
    </FormularioBase>
  );
}