import { useState } from "react";
import DisenoBase from "./componentes_temp/Plantillas/DisenoBase";

// Importar estilos globales
import "./assets/css/estiloBase.css";
import "./assets/css/layout.css";
import "./assets/css/components.css";
import "./assets/css/admin.css";

// Páginas
import Inicio from "./componentes_temp/paginas_temp/Inicio";
import CatalogoCompleto from "./componentes_temp/paginas_temp/CatalogoCompleto";
import Mangas from "./componentes_temp/paginas_temp/Mangas";
import Comics from "./componentes_temp/paginas_temp/Comics";
import Ofertas from "./componentes_temp/paginas_temp/ofertas_temp"; 
import Registro from "./componentes_temp/paginas_temp/Registro";
import Login from "./componentes_temp/paginas_temp/Login";
import Contacto from "./componentes_temp/paginas_temp/Contacto"; 
import Carrito from "./componentes_temp/paginas_temp/Carrito";
import Novedades from "./componentes_temp/paginas_temp/Novedades";
import Nosotros from "./componentes_temp/paginas_temp/Nosotros";
import PerfilUsuario from "./componentes_temp/paginas_temp/PerfilUsuario";
import AdminPanel from "./componentes_temp/paginas_temp/admin_temp/AdminPanel";

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
