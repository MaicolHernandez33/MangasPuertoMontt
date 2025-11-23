import { useEffect, useState } from "react";
import Titulo from "../../atomos/Titulo";

export default function AdminPerfil() {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    setAdmin(
      usuarioActivo || {
        nombre: "Administrador General",
        correo: "admin@tienda.cl",
        rol: "admin",
      }
    );
  }, []);

  return (
    <section className="admin-perfil">
      <Titulo texto="👤 Perfil del Administrador" />

      <div className="perfil-card">
        <img
          src="/img/iconadmin.jpg"
          alt="Avatar administrador"
          className="perfil-avatar"
        />
        <h3>{admin.nombre}</h3>
        <p><strong>Correo:</strong> {admin.correo}</p>
        <p><strong>Rol:</strong> {admin.rol || "Administrador"}</p>
        <p>
          <strong>Miembro desde:</strong> 2025
        </p>
        <p style={{ marginTop: "10px", color: "#ff5050" }}>
          👑 Acceso completo al sistema
        </p>
      </div>
    </section>
  );
}
