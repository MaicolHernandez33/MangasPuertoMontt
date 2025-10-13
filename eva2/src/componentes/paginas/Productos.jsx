import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos desde localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));

    // Si hay productos guardados, usarlos
    if (productosGuardados && productosGuardados.length > 0) {
      setProductos(productosGuardados);
    } 
    // Si no hay, usar productos por defecto
    else {
      const productosPorDefecto = [
        {
          id: 1,
          nombre: "Berserk Maximum Vol. 1",
          precio: 23990,
          imagen: "/img/productos/tomo1berserk.jpg",
        },
        {
          id: 2,
          nombre: "Monster Vol. 1",
          precio: 19990,
          imagen: "/img/productos/tomo1Monster.jpg",
        },
        {
          id: 3,
          nombre: "Attack on Titan Vol. 1",
          precio: 24990,
          imagen: "/img/productos/tomo1SNK.jpeg",
        },
      ];

      setProductos(productosPorDefecto);
      localStorage.setItem("productos", JSON.stringify(productosPorDefecto));
    }
  }, []);

  return (
    <section className="productos">
      <Titulo texto="📚 Catálogo de Productos" />
      <div className="grilla-productos">
        {productos.length > 0 ? (
          productos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </section>
  );
}
