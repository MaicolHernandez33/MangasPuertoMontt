export default function BarraNavegacion({ cambiarPagina }) {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <h1>Tienda Mangas PuertoMontt</h1>
        </div>

        <ul className="menu">
          <li><button onClick={() => cambiarPagina("inicio")}>Inicio</button></li>
          <li><button onClick={() => cambiarPagina("productos")}>Productos</button></li>
          <li><button onClick={() => cambiarPagina("novedades")}>Novedades</button></li>
          <li><button onClick={() => cambiarPagina("nosotros")}>Nosotros</button></li>
          <li><button onClick={() => cambiarPagina("contacto")}>Contacto</button></li>
        </ul>

        <div className="acciones">
          <button onClick={() => cambiarPagina("carrito")}>🛒 Carrito</button>
          <button onClick={() => cambiarPagina("login")}>🔑 Iniciar Sesión</button>
          <button onClick={() => cambiarPagina("registro")}>✍️ Registrarse</button>
        </div>
      </nav>
    </header>
  );
}
