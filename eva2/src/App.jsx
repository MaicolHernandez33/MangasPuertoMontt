import { useState } from "react";
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

  const cambiarPagina = (nueva) => setPagina(nueva);

  const mostrarPagina = () => {
    switch (pagina) {
      case "productos":
        return <Productos />;
      case "registro":
        return <Registro />;
      case "login":
        return <Login />;
      case "admin":
        return <AdminProductos />;
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
