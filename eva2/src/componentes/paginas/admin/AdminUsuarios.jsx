import { useState, useEffect } from "react";
import Titulo from "../../atomos/Titulo";
import Boton from "../../atomos/Boton";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Campos del formulario para crear usuario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");

  // 🔹 Cargar usuarios guardados al iniciar
  useEffect(() => {
    const guardados = localStorage.getItem("usuarios");
    if (guardados) {
      try {
        const usuariosGuardados = JSON.parse(guardados);
        setUsuarios(usuariosGuardados);
      } catch (e) {
        console.warn("⚠️ Error al leer usuarios del localStorage:", e);
        setUsuarios([]);
      }
    }
  }, []);

  // 🔹 Crear un nuevo usuario manualmente (sin romper los actuales)
  const crearUsuario = () => {
    if (!nombre || !correo || !password) {
      alert("⚠️ Completa nombre, correo y contraseña.");
      return;
    }

    // Evitar duplicados
    const existe = usuarios.some((u) => u.correo === correo);
    if (existe) {
      alert("⚠️ Este correo ya está registrado.");
      return;
    }

    const nuevoUsuario = { nombre, correo, password, rol };

    const nuevosUsuarios = [...usuarios, nuevoUsuario];
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));

    alert(`✅ Usuario ${nombre} creado correctamente.`);

    // Limpiar campos
    setNombre("");
    setCorreo("");
    setPassword("");
    setRol("usuario");
  };

  // 🔹 Eliminar usuario
  const eliminarUsuario = (correo) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      const nuevosUsuarios = usuarios.filter((u) => u.correo !== correo);
      setUsuarios(nuevosUsuarios);
      localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
      alert("🗑️ Usuario eliminado correctamente.");
    }
  };

  // 🔹 Promover usuario a administrador
  const promoverAdmin = (correo) => {
    const nuevosUsuarios = usuarios.map((u) =>
      u.correo === correo ? { ...u, rol: "admin" } : u
    );
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    alert("👑 Usuario promovido a administrador.");
  };

  // 🔹 Degradar administrador a usuario normal
  const degradarUsuario = (correo) => {
    if (correo === "admin@tienda.cl") {
      alert("⚠️ No se puede degradar al administrador principal.");
      return;
    }
    const nuevosUsuarios = usuarios.map((u) =>
      u.correo === correo ? { ...u, rol: "usuario" } : u
    );
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    alert("⬇️ Administrador degradado a usuario.");
  };

  return (
    <section className="admin-usuarios">
      <Titulo texto="👥 Administración de Usuarios" />

      {/* === NUEVO FORMULARIO PARA CREAR USUARIO === */}
      <div className="panel" style={{ marginBottom: "25px" }}>
        <h3>➕ Crear nuevo usuario</h3>
        <div className="formulario-admin">
          <input
            type="text"
            className="campo-texto"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            className="campo-texto"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            className="campo-texto"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="campo-texto"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <Boton texto="Crear usuario" onClick={crearUsuario} />
        </div>
      </div>

      {/* === TABLA DE USUARIOS === */}
      {usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol === "admin" ? "👑 Admin" : "👤 Usuario"}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    {u.rol === "admin" ? (
                      <Boton
                        texto="Degradar"
                        onClick={() => degradarUsuario(u.correo)}
                      />
                    ) : (
                      <Boton
                        texto="Promover"
                        onClick={() => promoverAdmin(u.correo)}
                      />
                    )}
                    <Boton
                      texto="Eliminar"
                      onClick={() => eliminarUsuario(u.correo)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
} 
