import BarraNavegacion from "../Organismos/BarraNavegacion";
import Footer from "../Organismos/Footer";

export default function DisenoBase({ children, cambiarPagina }) {
  return (
    <>
      <BarraNavegacion cambiarPagina={cambiarPagina} />
      <main className="contenido">{children}</main>
      <Footer />
    </>
  );
}
