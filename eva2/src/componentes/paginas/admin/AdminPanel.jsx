import { useEffect, useState } from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";
import Titulo from "../../atomos/Titulo";

export default function AdminPanel() {
  const [seccion, setSeccion] = useState("productos");

  // 🔒 Verificar si el usuario activo es admin
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (
      !usuarioActivo ||
      (usuarioActivo.rol !== "admin" &&
        !(usuarioActivo.correo === "admin@tienda.cl" && usuarioActivo.password === "admin123"))
    ) {
      alert("🚫 Acceso denegado. Solo el administrador puede ingresar.");
      window.location.href = "/"; // Redirigir al inicio
    }
  }, []);

  return (
    <div className="admin-panel">
      {/* Menú lateral */}
      <aside className="admin-menu">
        <h2>👑 Panel Admin</h2>
        <button onClick={() => setSeccion("productos")}>📦 Productos</button>
        <button onClick={() => setSeccion("usuarios")}>👥 Usuarios</button>
        <button
          onClick={() => {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "/";
          }}
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="admin-contenido">
        {seccion === "productos" ? <AdminProductos /> : <AdminUsuarios />}
      </main>
    </div>
  );
}
