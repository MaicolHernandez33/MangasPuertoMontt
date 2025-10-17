import { useState, useEffect } from "react";
import DisenoBase from "./componentes/plantillas/DisenoBase";
import Inicio from "./componentes/paginas/Inicio";
import Productos from "./componentes/paginas/Productos";
import Registro from "./componentes/paginas/Registro";
import Login from "./componentes/paginas/Login";
import AdminProductos from "./componentes/paginas/admin/AdminProductos";
import Contacto from "./componentes/paginas/Contacto";
import Carrito from "./componentes/paginas/Carrito";
import Novedades from "./componentes/paginas/Novedades";
import Nosotros from "./componentes/paginas/Nosotros";

function App() {
  const [pagina, setPagina] = useState("inicio");

  // 🔹 Verifica si hay un usuario guardado (para mantener sesión)
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) {
      if (
        usuarioActivo.correo === "admin@tienda.cl" &&
        usuarioActivo.password === "admin123"
      ) {
        setPagina("admin"); // Si es admin, entra directo
      } else {
        setPagina("inicio"); // Si es usuario normal, va al inicio
      }
    }
  }, []);

  // 🔹 Cambia la página cuando el usuario navega
  const cambiarPagina = (nueva) => setPagina(nueva);

  // 🔹 Renderiza el contenido según la página actual
  const mostrarPagina = () => {
    switch (pagina) {
      case "productos":
        return <Productos />;
      case "registro":
        return <Registro />;
      case "login":
        return <Login cambiarPagina={cambiarPagina} />; // 👈 importante
      case "admin":
        return <AdminProductos cambiarPagina={cambiarPagina} />; // 👈 ahora también lo pasamos aquí
      case "contacto":
        return <Contacto />;
      case "carrito":
        return <Carrito />;
      case "novedades":
        return <Novedades />;
      case "nosotros":
        return <Nosotros />;
      default:
        return <Inicio />;
    }
  };

  return (
    <DisenoBase cambiarPagina={cambiarPagina}>
      {mostrarPagina()}
    </DisenoBase>
  );
}

export default App;
