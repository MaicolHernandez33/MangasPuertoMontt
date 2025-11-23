import { useState } from "react";
import DisenoBase from "./componentes/plantillas/DisenoBase";

// Importar estilos globales
import "./assets/css/estiloBase.css";
import "./assets/css/layout.css";
import "./assets/css/components.css";
import "./assets/css/admin.css";

// Páginas
import Inicio from "./componentes/paginas/Inicio";
import CatalogoCompleto from "./componentes/paginas/CatalogoCompleto";
import Mangas from "./componentes/paginas/Mangas";
import Comics from "./componentes/paginas/Comics"; 
import Registro from "./componentes/paginas/Registro";
import Login from "./componentes/paginas/Login";
import Contacto from "./componentes/paginas/Contacto"; 
import Carrito from "./componentes/paginas/Carrito";
import Novedades from "./componentes/paginas/Novedades";
import Nosotros from "./componentes/paginas/Nosotros";
import PerfilUsuario from "./componentes/paginas/PerfilUsuario";
import AdminPanel from "./componentes/paginas/admin/AdminPanel";
import Ofertas from "./componentes/paginas/Ofertas"; 

function App() {

  //  Cargar última página guardada — si no existe → "inicio"
  const [pagina, setPagina] = useState(
    localStorage.getItem("paginaActual") || "inicio"
  );

  //  Guardar la página cuando cambie
  const cambiarPagina = (nueva) => {
    setPagina(nueva);
    localStorage.setItem("paginaActual", nueva);
  };

  // Renderizador
  const mostrarPagina = () => {
    switch (pagina) {
      case "productos": return <CatalogoCompleto />;
      case "mangas": return <Mangas />;
      case "comics": return <Comics />;
      case "ofertas": return <Ofertas />;
      case "registro": return <Registro cambiarPagina={cambiarPagina} />;
      case "login": return <Login cambiarPagina={cambiarPagina} />;
      case "perfil": return <PerfilUsuario cambiarPagina={cambiarPagina} />;
      case "admin": return <AdminPanel cambiarPagina={cambiarPagina} />;
      case "contacto": return <Contacto />;
      case "carrito": return <Carrito />;
      case "novedades": return <Novedades />;
      case "nosotros": return <Nosotros />;
      default: return <Inicio />;
    }
  };

  return (
    <DisenoBase cambiarPagina={cambiarPagina}>
      {mostrarPagina()}
    </DisenoBase>
  );
}

export default App;
