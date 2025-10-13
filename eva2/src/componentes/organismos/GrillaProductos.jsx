import TarjetaProducto from "../moleculas/TarjetaProducto";
import { productos } from "../../datos/productos";

export default function GrillaProductos() {
  return (
    <section className="grilla-productos">
      {productos.map((p) => (
        <TarjetaProducto key={p.id} producto={p} />
      ))}
    </section>
  );
}
