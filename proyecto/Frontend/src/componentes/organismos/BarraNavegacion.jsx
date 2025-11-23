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
    setMenuActivo(false);
  };

  const navegar = (pagina) => {
    cambiarPagina(pagina);
    setMenuActivo(false);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo" onClick={() => navegar("inicio")}>
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <h1>Tienda Mangas PuertoMontt</h1>
        </div>


        <button className="menu-toggle" onClick={toggleMenu}>☰</button>

        {/* Menú hamburguesa completo */}
        <ul className={`menu ${menuActivo ? "activo" : ""}`}>
          <li><button onClick={() => navegar("inicio")}> Inicio</button></li>

          {/* Catálogo */}
          <li className="submenu">
            <button onClick={() => setSubmenuActivo(!submenuActivo)}>
               Catálogo ▾
            </button>
            <ul className={`submenu-items ${submenuActivo ? "activo" : ""}`}>
              <li><button onClick={() => navegar("mangas")}> Mangas</button></li>
              <li><button onClick={() => navegar("comics")}> Cómics</button></li>
              <li><button onClick={() => navegar("ofertas")}> Ofertas</button></li>
              <li><button onClick={() => navegar("productos")}> Todo el Catálogo</button></li>
            </ul>
          </li>

          <li><button onClick={() => navegar("novedades")}> Novedades</button></li>
          <li><button onClick={() => navegar("nosotros")}> Nosotros</button></li>
          <li><button onClick={() => navegar("contacto")}> Contacto</button></li>

          {/* Separador */}
          <li className="separador"></li>

          {/* Acciones del usuario */}
          <li><button onClick={() => navegar("carrito")}>🛒 </button></li>
          
          {!usuario ? (
            <>
              <li><button onClick={() => navegar("login")}>🔑 </button></li>
              <li><button onClick={() => navegar("registro")}>📝 </button></li>
            </>
          ) : (
            <>
              <li><button onClick={() => navegar(usuario.rol === "admin" ? "admin" : "perfil")}>
                {usuario.rol === "admin" ? "👑 Panel Admin" : "👤 Mi Perfil"}
              </button></li>
              <li><button onClick={cerrarSesion}>🚪 </button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}