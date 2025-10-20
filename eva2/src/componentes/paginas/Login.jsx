import React, { useState } from "react";
import FormularioBase from "../organismos/FormularioBase";

export default function Login({ cambiarPagina }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Caso especial: Admin por defecto
    if (correo === "admin@tienda.cl" && password === "admin123") {
      const adminUser = {
        nombre: "Administrador",
        correo: "admin@tienda.cl",
        password: "admin123",
        rol: "admin",
      };

      localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));
      window.dispatchEvent(new Event("storage"));

      if (!usuarios.some((u) => u.correo === "admin@tienda.cl")) {
        usuarios.push(adminUser);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }

      alert("👑 Bienvenido Administrador Principal");
      cambiarPagina("admin");
      return;
    }

    // Buscar usuario válido
    const usuarioValido = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.password === password
    );

    if (usuarioValido) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));
      window.dispatchEvent(new Event("storage"));

      // Merge de carrito anónimo con carrito del usuario
      const anon = JSON.parse(localStorage.getItem("carrito_anonimo") || "[]");
      const keyUser = `carrito_${usuarioValido.correo}`;
      const curr = JSON.parse(localStorage.getItem(keyUser) || "[]");

      const combinados = mergeCarritos(curr, anon);
      localStorage.setItem(keyUser, JSON.stringify(combinados));
      localStorage.removeItem("carrito_anonimo");

      if (usuarioValido.rol === "admin") {
        alert(`👑 Bienvenido Administrador ${usuarioValido.nombre}`);
        cambiarPagina("admin");
      } else {
        alert(`✅ Bienvenido/a, ${usuarioValido.nombre}`);
        cambiarPagina("inicio");
      }
    } else {
      alert("❌ Correo o contraseña incorrectos.");
    }
  };

  // Función para combinar carritos
  const mergeCarritos = (a, b) => {
    const mapa = new Map();
    for (const it of [...a, ...b]) {
      const key = it.id;
      const prev = mapa.get(key);
      if (prev) {
        mapa.set(key, { ...prev, cantidad: (prev.cantidad || 1) + (it.cantidad || 1) });
      } else {
        mapa.set(key, { ...it, cantidad: it.cantidad || 1 });
      }
    }
    return [...mapa.values()];
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
      botonTexto="Iniciar Sesión"
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
          >
            ¡Regístrate aquí!
          </button>
        </p>
      </div>
    </FormularioBase>
  );
}
