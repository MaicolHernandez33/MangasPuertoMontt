import { useState, useEffect } from "react";
import TarjetaProducto from "../Moleculas/TarjetaProducto";
import Titulo from "../Atomos/Titulo";

export default function Comics() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        if (response.ok) {
          const data = await response.json();
          const comics = data.productos.filter(p => 
            ["Acción", "Aventura", "Comedia", "Drama"].includes(p.categoria) && p.stock > 0
          );
          setProductos(comics);
        }
      } catch (error) {
        console.error("Error cargando comics:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) return <p style={{ color:"#fff", textAlign:"center" }}>Cargando comics...</p>;

  return (
    <section className="productos">
      <Titulo texto=" Cómics Disponibles" />
      <div className="grilla-productos">
        {productos.length > 0 ? (
          productos.map(p => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No hay cómics disponibles.</p>
        )}
      </div>
    </section>
  );
}
