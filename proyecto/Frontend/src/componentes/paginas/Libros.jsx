import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";
import { API_BASE_URL } from "../../config"; 

export default function Libros() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos`); 
        if (response.ok) {
          const data = await response.json();
          const libros = data.productos.filter(p => 
            p.tipo === "libro" && p.stock > 0  
          );
          setProductos(libros);
        }
      } catch (error) {
        console.error("Error cargando libros:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) return <p style={{ color:"#fff", textAlign:"center" }}>Cargando libros...</p>;

  return (
    <section className="productos">
      <Titulo texto="Libros Disponibles" />
      <div className="grilla-productos">
        {productos.length > 0 ? (
          productos.map(p => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No hay libros disponibles.</p>
        )}
      </div>
    </section>
  );
}