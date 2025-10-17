import { useState } from "react";

export default function BarraNavegacion({ cambiarPagina }) {
  const [menuActivo, setMenuActivo] = useState(false);

  const toggleMenu = () => {
    setMenuActivo(!menuActivo);
  };

  return (
    <header>
      <nav className="navbar">
        {/* Logo y título */}
        <div className="logo" onClick={() => cambiarPagina("inicio")}>
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <h1>Tienda Mangas PuertoMontt</h1>
        </div>

        {/* Botón hamburguesa */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* Menú de navegación (desplegable en móviles) */}
        <ul className={`menu ${menuActivo ? "activo" : ""}`}>
          <li><button onClick={() => cambiarPagina("inicio")}>Inicio</button></li>
          <li><button onClick={() => cambiarPagina("productos")}>Productos</button></li>
          <li><button onClick={() => cambiarPagina("novedades")}>Novedades</button></li>
          <li><button onClick={() => cambiarPagina("nosotros")}>Nosotros</button></li>
          <li><button onClick={() => cambiarPagina("contacto")}>Contacto</button></li>
        </ul>

        {/* Sección con Carrito e Iniciar sesión / Registrarse */}
        <div className="acciones">
          <button onClick={() => cambiarPagina("carrito")}>🛒</button>
          <button onClick={() => cambiarPagina("login")}>🔑 </button>
          <button onClick={() => cambiarPagina("registro")}>📝 </button>
        </div>
      </nav>
    </header>
  );
}
