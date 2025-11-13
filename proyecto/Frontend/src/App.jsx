import { useState } from "react";
import DisenoBase from "./componentes/plantillas/DisenoBase";

// Importar los estilos globales
import "./assets/css/estiloBase.css";
import "./assets/css/layout.css";
import "./assets/css/components.css";
import "./assets/css/admin.css";

//  Páginas
import Inicio from "./componentes/paginas/Inicio";
import Productos from "./componentes/paginas/Productos";
import Registro from "./componentes/paginas/Registro";
import Login from "./componentes/paginas/Login";
import Contacto from "./componentes/paginas/Contacto";
import Carrito from "./componentes/paginas/Carrito";
import Novedades from "./componentes/paginas/Novedades";
import Nosotros from "./componentes/paginas/Nosotros";
import PerfilUsuario from "./componentes/paginas/PerfilUsuario";
import AdminPanel from "./componentes/paginas/admin/AdminPanel";

function App() {
  const [pagina, setPagina] = useState("inicio");

  const cambiarPagina = (nueva) => setPagina(nueva);

  const mostrarPagina = () => {
    switch (pagina) {
      case "productos": return <Productos />;
      case "registro":  return <Registro cambiarPagina={cambiarPagina} />;
      case "login":     return <Login cambiarPagina={cambiarPagina} />;
      case "perfil":    return <PerfilUsuario cambiarPagina={cambiarPagina} />;
      case "admin":     return <AdminPanel cambiarPagina={cambiarPagina} />;
      case "contacto":  return <Contacto />;
      case "carrito":   return <Carrito />;
      case "novedades": return <Novedades />;
      case "nosotros":  return <Nosotros />;
      default:          return <Inicio />;
    }
  };

  return (
    <DisenoBase cambiarPagina={cambiarPagina}>
      {mostrarPagina()}
    </DisenoBase>
  );
}

export default App;
