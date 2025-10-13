import { useState, useEffect } from "react";
import Titulo from "../../atomos/Titulo";
import Boton from "../../atomos/Boton";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios guardados al iniciar
  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados);
  }, []);

  // Guardar cambios al eliminar
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const eliminarUsuario = (correo) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      const nuevosUsuarios = usuarios.filter((u) => u.correo !== correo);
      setUsuarios(nuevosUsuarios);
      alert("🗑️ Usuario eliminado correctamente.");
    }
  };

  const promoverAdmin = (correo) => {
    const nuevosUsuarios = usuarios.map((u) =>
      u.correo === correo ? { ...u, rol: "admin" } : u
    );
    setUsuarios(nuevosUsuarios);
    alert("👑 Usuario promovido a administrador.");
  };

  return (
    <section className="admin-usuarios">
      <Titulo texto="👥 Administración de Usuarios" />

      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={index}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol === "admin" ? "👑 Admin" : "👤 Usuario"}</td>
                <td>
                  {u.rol !== "admin" && (
                    <Boton texto="Promover a Admin" onClick={() => promoverAdmin(u.correo)} />
                  )}
                  <Boton texto="Eliminar" onClick={() => eliminarUsuario(u.correo)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
