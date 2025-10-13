import BarraNavegacion from "../organismos/BarraNavegacion";
import Footer from "../organismos/Footer";

export default function DisenoBase({ children, cambiarPagina }) {
  return (
    <>
      <BarraNavegacion cambiarPagina={cambiarPagina} />
      <main className="contenido">{children}</main>
      <Footer />
    </>
  );
}
