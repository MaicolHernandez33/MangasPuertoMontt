import { useState, useEffect } from "react";

export default function BarraNavegacion({ cambiarPagina }) {
  const [menuActivo, setMenuActivo] = useState(false);
  const [submenuActivo, setSubmenuActivo] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuario(usuarioActivo || null);
  }, []);

  const toggleMenu = () => setMenuActivo(!menuActivo);

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setUsuario(null);
    alert("👋 Sesión cerrada correctamente.");
    cambiarPagina("inicio");
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo" onClick={() => cambiarPagina("inicio")}>
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <h1>Tienda Mangas PuertoMontt</h1>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>☰</button>

        <ul className={`menu ${menuActivo ? "activo" : ""}`}>
          <li><button onClick={() => cambiarPagina("inicio")}>Inicio</button></li>

          {/* === Submenu Catálogo === */}
          <li className="submenu">
            <button onClick={() => setSubmenuActivo(!submenuActivo)}>
              Catálogo ▾
            </button>
            <ul className={`submenu-items ${submenuActivo ? "activo" : ""}`}>
              
              <li><button onClick={() => cambiarPagina("mangas")}>Mangas</button></li>
              <li><button onClick={() => cambiarPagina("comics")}>Cómics</button></li>
              <li><button onClick={() => cambiarPagina("ofertas")}>Ofertas</button></li>
              <li><button onClick={() => cambiarPagina("productos")}>Catálogo Completo</button></li>
              
            </ul>
          </li>

          <li><button onClick={() => cambiarPagina("novedades")}>Novedades</button></li>
          <li><button onClick={() => cambiarPagina("nosotros")}>Nosotros</button></li>
          <li><button onClick={() => cambiarPagina("contacto")}>Contacto</button></li>
        </ul>

        <div className="acciones">
          <button onClick={() => cambiarPagina("carrito")}>🛒</button>
          {!usuario ? (
            <>
              <button onClick={() => cambiarPagina("login")}>🔑</button>
              <button onClick={() => cambiarPagina("registro")}>📝</button>
            </>
          ) : (
            <>
              <button onClick={() => cambiarPagina(usuario.rol === "admin" ? "admin" : "perfil")}>
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
