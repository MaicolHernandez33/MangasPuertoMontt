import { useState } from "react";
import DisenoBase from "./Componentes/Plantillas/DisenoBase";

// Importar estilos globales
import "./assets/css/estiloBase.css";
import "./assets/css/layout.css";
import "./assets/css/components.css";
import "./assets/css/admin.css";

// Páginas
import Inicio from "./Componentes/Paginas/Inicio";
import CatalogoCompleto from "./Componentes/Paginas/CatalogoCompleto";
import Mangas from "./Componentes/Paginas/Mangas";
import Comics from "./Componentes/Paginas/Comics";
import Ofertas from "./Componentes/Paginas/Ofertas"; 
import Registro from "./Componentes/Paginas/Registro";
import Login from "./Componentes/Paginas/Login";
import Contacto from "./Componentes/Paginas/Contacto"; 
import Carrito from "./Componentes/Paginas/Carrito";
import Novedades from "./Componentes/Paginas/Novedades";
import Nosotros from "./Componentes/Paginas/Nosotros";
import PerfilUsuario from "./Componentes/Paginas/PerfilUsuario";
import AdminPanel from "./Componentes/Paginas/Admin/AdminPanel";

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
