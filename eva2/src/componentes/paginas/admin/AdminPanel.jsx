import { useEffect, useState } from "react";
import AdminPerfil from "./AdminPerfil";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";
import AdminPedidos from "./AdminPedidos";
import AdminReportes from "./AdminReportes";

export default function AdminPanel({ cambiarPagina }) {
  const [seccion, setSeccion] = useState("perfil");
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("usuarioActivo");
    if (!raw) {
      alert("⚠️ Debes iniciar sesión para acceder al panel administrador.");
      cambiarPagina?.("login");
      return;
    }

    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      alert("Error al leer usuario activo");
      cambiarPagina?.("inicio");
      return;
    }

    if (user.rol !== "admin") {
      alert("🚫 Acceso denegado. Solo el administrador puede ingresar.");
      cambiarPagina?.("inicio");
      return;
    }

    setVerificado(true);
  }, [cambiarPagina]);

  if (!verificado) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>
        <h2>🔒 Verificando acceso...</h2>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <aside className="admin-menu">
        <h2>👑 Panel Admin</h2>
        <button onClick={() => setSeccion("perfil")}>👤 Perfil</button>
        <button onClick={() => setSeccion("productos")}>📦 Productos</button>
        <button onClick={() => setSeccion("usuarios")}>👥 Usuarios</button>
        <button onClick={() => setSeccion("pedidos")}>🧾 Pedidos</button>
        <button onClick={() => setSeccion("reportes")}>📊 Reportes</button>

        <button
          className="cerrar-sesion"
          onClick={() => {
            localStorage.removeItem("usuarioActivo");
            alert("👋 Sesión cerrada correctamente.");
            cambiarPagina?.("inicio");
          }}
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      <main className="admin-contenido">
        {seccion === "perfil" && <AdminPerfil />}
        {seccion === "productos" && <AdminProductos />}
        {seccion === "usuarios" && <AdminUsuarios />}
        {seccion === "pedidos" && <AdminPedidos />}
        {seccion === "reportes" && <AdminReportes />}
      </main>
    </div>
  );
}
