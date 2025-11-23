import { useState, useEffect } from "react";
import Titulo from "../../atomos/Titulo";
import Boton from "../../atomos/Boton";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    celular: "",
    password: "",
    rol: "usuario"
  });

  // ✅ Cargar usuarios desde la API
  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/usuarios');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsuarios(data.usuarios || data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setError(`Error al cargar usuarios: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // ✅ Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Agregar nuevo usuario
  const agregarUsuario = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!nuevoUsuario.nombre || !nuevoUsuario.correo || !nuevoUsuario.password) {
      alert("⚠️ Por favor complete todos los campos obligatorios (Nombre, Correo y Contraseña)");
      return;
    }

    setCargando(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const usuarioCreado = await response.json();
      
      alert("✅ Usuario creado exitosamente!");
      
      // Limpiar formulario y cerrar
      setNuevoUsuario({
        nombre: "",
        correo: "",
        celular: "",
        password: "",
        rol: "usuario"
      });
      setMostrarFormulario(false);
      
      // Recargar lista de usuarios
      await cargarUsuarios();
      
    } catch (error) {
      setError(`Error al crear usuario: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Función genérica para modificar usuario
  const modificarUsuario = async (usuarioId, datos, accion) => {
    if (!confirm(`¿Seguro que deseas ${accion} este usuario?`)) return;

    setCargando(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      alert(`✅ Usuario ${accion} correctamente.`);
      await cargarUsuarios(); // Recargar lista
    } catch (error) {
      setError(`Error al ${accion} usuario: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Eliminar usuario
  const eliminarUsuario = async (usuarioId, usuarioCorreo) => {
    if (usuarioCorreo === "admin@tienda.cl") {
      alert("⚠️ No se puede eliminar al administrador principal.");
      return;
    }

    if (!confirm("¿Seguro que deseas ELIMINAR permanentemente este usuario?")) return;

    setCargando(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/usuarios/${usuarioId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      alert("🗑️ Usuario eliminado correctamente.");
      await cargarUsuarios(); // Recargar lista
    } catch (error) {
      setError(`Error al eliminar usuario: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Promover usuario a administrador
  const promoverAdmin = (usuarioId, usuarioCorreo) => {
    if (usuarioCorreo === "admin@tienda.cl") {
      alert("⚠️ Este usuario ya es administrador principal.");
      return;
    }
    modificarUsuario(usuarioId, { rol: 'admin' }, 'promover a administrador');
  };

  // ✅ Degradar administrador a usuario normal
  const degradarUsuario = (usuarioId, usuarioCorreo) => {
    if (usuarioCorreo === "admin@tienda.cl") {
      alert("⚠️ No se puede degradar al administrador principal.");
      return;
    }
    modificarUsuario(usuarioId, { rol: 'usuario' }, 'degradar a usuario');
  };

  return (
    <section className="admin-usuarios">
      <Titulo texto="👥 Administración de Usuarios" />

      {/* Botón para agregar usuario */}
      <div style={{ marginBottom: "20px" }}>
        <Boton 
          texto="➕ Agregar Usuario" 
          onClick={() => setMostrarFormulario(true)}
          disabled={cargando}
        />
      </div>

      {/* Formulario para agregar usuario */}
      {mostrarFormulario && (
        <div className="panel" style={{ 
          marginBottom: "25px", 
          background: "#1e1e1e", 
          padding: "20px",
          border: "1px solid #444",
          borderRadius: "8px"
        }}>
          <h3>➕ Agregar Nuevo Usuario</h3>
          <form onSubmit={agregarUsuario}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoUsuario.nombre}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={nuevoUsuario.correo}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Celular
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={nuevoUsuario.celular}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={nuevoUsuario.password}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Rol
                </label>
                <select
                  name="rol"
                  value={nuevoUsuario.rol}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444" }}
                >
                  <option value="usuario">👤 Usuario</option>
                  <option value="admin">👑 Administrador</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <Boton 
                type="submit"
                texto={cargando ? "Creando..." : "✅ Crear Usuario"}
                disabled={cargando}
                pequeno
              />
              <Boton 
                type="button"
                texto="❌ Cancelar"
                onClick={() => setMostrarFormulario(false)}
                disabled={cargando}
                pequeno
              />
            </div>
          </form>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div style={{ 
          background: "#ff4444", 
          color: "white", 
          padding: "10px", 
          marginBottom: "15px",
          borderRadius: "5px" 
        }}>
          {error}
        </div>
      )}

      {/* === TABLA DE USUARIOS === */}
      {cargando ? (
        <p>🔄 Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>📭 No hay usuarios registrados.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Rol</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id || index}>
                  <td>{index + 1}</td>
                  <td>{usuario.nombre || "Sin nombre"}</td>
                  <td>{usuario.correo || "Sin correo"}</td>
                  <td>{usuario.celular || "No registrado"}</td>
                  <td>
                    <span className={`rol-badge ${usuario.rol}`}>
                      {usuario.rol === "admin" ? "👑 Admin" : "👤 Usuario"}
                    </span>
                  </td>
                  <td>
                    {usuario.creado_en ? 
                      new Date(usuario.creado_en).toLocaleDateString("es-CL") : 
                      "N/A"
                    }
                  </td>
                  <td style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {usuario.rol === "admin" ? (
                      <Boton
                        texto="⬇️ Degradar"
                        onClick={() => degradarUsuario(usuario.id, usuario.correo)}
                        disabled={cargando || usuario.correo === "admin@tienda.cl"}
                        pequeno
                      />
                    ) : (
                      <Boton
                        texto="👑 Promover"
                        onClick={() => promoverAdmin(usuario.id, usuario.correo)}
                        disabled={cargando}
                        pequeno
                      />
                    )}
                    <Boton
                      texto="🗑️ Eliminar"
                      onClick={() => eliminarUsuario(usuario.id, usuario.correo)}
                      disabled={cargando || usuario.correo === "admin@tienda.cl"}
                      pequeno
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