import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import Boton from "../atomos/Boton";

export default function PerfilUsuario({ cambiarPagina }) {
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const activo = JSON.parse(localStorage.getItem("usuarioActivo"));
      if (!activo) {
        alert("⚠️ Debes iniciar sesión para acceder al perfil.");
        cambiarPagina?.("login");
        return;
      }

      setUsuario(activo);
      await cargarCompras(activo.id);
    };

    cargarDatos();
  }, [cambiarPagina]);

  // ✅ Cargar compras desde la BD
  const cargarCompras = async (usuarioId) => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:5000/api/pedidos', {
        headers: {
          'usuario-id': usuarioId.toString()
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompras(data.pedidos || []);
      }
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    if (confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("usuarioActivo");
      window.dispatchEvent(new Event("storage"));
      alert("👋 Sesión cerrada correctamente.");
      cambiarPagina?.("inicio");
    }
  };

  if (!usuario) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "80px" }}>
        <h2>Verificando acceso...</h2>
      </div>
    );
  }

  return (
    <section className="perfil-usuario">
      <div className="perfil-contenedor">
        <Titulo texto="👤 Perfil del Usuario" />

        {/* === DATOS PERSONALES === */}
        <div className="perfil-datos">
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol === "admin" ? "👑 Administrador" : "🧑 Usuario"}</p>
          {usuario.celular && <p><strong>Celular:</strong> {usuario.celular}</p>}
        </div>

        {/* === HISTORIAL DE COMPRAS === */}
        <div className="perfil-compras">
          <Titulo texto="🧾 Historial de Compras" />

          {cargando ? (
            <p>Cargando compras...</p>
          ) : compras.length === 0 ? (
            <p>No tienes compras registradas aún.</p>
          ) : (
            <div className="compras-lista">
              {compras.map((compra) => (
                <div key={compra.id} className="compra-item">
                  <h4>🛒 Pedido #{compra.id}</h4>
                  <p><strong>Fecha:</strong> {new Date(compra.fecha_pedido).toLocaleString("es-CL")}</p>
                  <p><strong>Total:</strong> ${parseFloat(compra.total).toLocaleString("es-CL")}</p>
                  <p><strong>Estado:</strong> {compra.estado}</p>

                  <ul>
                    {compra.items?.map((item, index) => (
                      <li key={index}>
                        {item.nombre} - ${parseFloat(item.precio).toLocaleString("es-CL")} x {item.cantidad}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <Boton texto="🚪 Cerrar sesión" onClick={cerrarSesion} />
      </div>
    </section>
  );
}