import Titulo from "../atomos/Titulo";
import GrillaProductos from "../organismos/GrillaProductos";

export default function Inicio() {
  return (
    <section className="inicio">
      <Titulo texto=" Mangas Recomendados" />
      <GrillaProductos />

      <Titulo texto=" Cómics Destacados" />
      <GrillaProductos /> {/* temporalmente reutilizamos la misma grilla */}
    </section>
  );
}
