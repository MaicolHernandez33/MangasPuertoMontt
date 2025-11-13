import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import Boton from "../atomos/Boton";

export default function PerfilUsuario({ cambiarPagina }) {
  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    //Cargar usuario activo
    const activo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!activo) {
      alert("⚠️ Debes iniciar sesión para acceder al perfil.");
      cambiarPagina?.("login");
      return;
    }

    setUsuario(activo);

    //Cargar historial de compras (por correo)
    const key = `compras_${activo.correo}`;
    const historial = JSON.parse(localStorage.getItem(key)) || [];
    setCompras(historial);
  }, [cambiarPagina]);

  // Cerrar sesión
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

          {compras.length === 0 ? (
            <p>No tienes compras registradas aún.</p>
          ) : (
            <div className="compras-lista">
              {compras.map((compra, index) => (
                <div key={index} className="compra-item">
                  <h4>🛒 Compra #{index + 1}</h4>
                  <p><strong>Fecha:</strong> {compra.fecha}</p>
                  <p><strong>Total:</strong> ${compra.total.toLocaleString("es-CL")}</p>

                  <ul>
                    {compra.items.map((item) => (
                      <li key={item.id}>
                        {item.nombre}  ${item.precio.toLocaleString("es-CL")}
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
