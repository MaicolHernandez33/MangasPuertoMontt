import { useState, useEffect } from "react";

export default function BarraNavegacion({ cambiarPagina }) {
  const [menuActivo, setMenuActivo] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // 🔹 Función para cargar el usuario desde localStorage
  const cargarUsuario = () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuario(usuarioActivo || null);
  };

  // 🔹 Se ejecuta al montar y cada vez que cambia el localStorage
  useEffect(() => {
    cargarUsuario();

    // Escuchar cambios globales del localStorage
    const listener = () => cargarUsuario();
    window.addEventListener("storage", listener);

    return () => window.removeEventListener("storage", listener);
  }, []);

  const toggleMenu = () => setMenuActivo(!menuActivo);

  const irAMiCuenta = () => {
    if (!usuario) {
      cambiarPagina("login");
      return;
    }

    if (usuario.rol === "admin") {
      cambiarPagina("admin");
    } else {
      cambiarPagina("perfil");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuario(null);
    alert("👋 Sesión cerrada correctamente.");
    cambiarPagina("inicio");
  };

  return (
    <header>
      <nav className="navbar">
        {/* === Logo === */}
        <div className="logo" onClick={() => cambiarPagina("inicio")}>
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <h1>Tienda Mangas PuertoMontt</h1>
        </div>

        {/* === Botón menú (mobile) === */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* === Menú principal === */}
        <ul className={`menu ${menuActivo ? "activo" : ""}`}>
          <li><button onClick={() => cambiarPagina("inicio")}>Inicio</button></li>
          <li><button onClick={() => cambiarPagina("productos")}>Productos</button></li>
          <li><button onClick={() => cambiarPagina("novedades")}>Novedades</button></li>
          <li><button onClick={() => cambiarPagina("nosotros")}>Nosotros</button></li>
          <li><button onClick={() => cambiarPagina("contacto")}>Contacto</button></li>
        </ul>

        {/* === Lado derecho === */}
        <div className="acciones">
          <button onClick={() => cambiarPagina("carrito")}>🛒</button>

          {!usuario ? (
            <>
              <button onClick={() => cambiarPagina("login")}>🔑</button>
              <button onClick={() => cambiarPagina("registro")}>📝</button>
            </>
          ) : (
            <>
              <button onClick={irAMiCuenta}>
                {usuario.rol === "admin" ? "👑" : "👤"}
              </button>
              <button onClick={cerrarSesion}>🚪</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
