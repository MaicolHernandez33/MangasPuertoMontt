import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";
import { API_BASE_URL } from "../../config"; 

export default function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos`); 
        if (response.ok) {
          const data = await response.json();
          //  Filtrar por productos con descuento
          const ofertas = data.productos.filter(p => p.descuento > 0 && p.stock > 0);
          setProductos(ofertas);
        }
      } catch (error) {
        console.error("Error cargando ofertas:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) return <p style={{ color:"#fff", textAlign:"center" }}>Cargando ofertas...</p>;

  return (
    <section className="productos">
      <Titulo texto=" Productos en Oferta" />
      <div className="grilla-productos">
        {productos.length > 0 ? (
          productos.map(p => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No hay productos en oferta disponibles.</p>
        )}
      </div>
    </section>
  );
}