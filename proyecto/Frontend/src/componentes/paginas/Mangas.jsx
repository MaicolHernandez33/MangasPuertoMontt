import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";

export default function Mangas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        if (response.ok) {
          const data = await response.json();
          const mangas = data.productos.filter(p => 
            ["Shonen", "Shojo", "Seinen"].includes(p.categoria) && p.stock > 0
          );
          setProductos(mangas);
        }
      } catch (error) {
        console.error("Error cargando mangas:", error);
        setProductos([]); 
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) return <p style={{ color:"#fff", textAlign:"center" }}>Cargando mangas...</p>;

  return (
    <section className="productos">
      <Titulo texto=" Mangas Disponibles" />
      <div className="grilla-productos">
        {productos.length > 0 ? (
          productos.map(p => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No hay mangas disponibles.</p>
        )}
      </div>
    </section>
  );
}
