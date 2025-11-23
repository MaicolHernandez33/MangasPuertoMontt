import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [orden, setOrden] = useState("ninguno");
  const [cargando, setCargando] = useState(true);

  //  Cargar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        if (response.ok) {
          const data = await response.json();
          // Filtrar productos con stock > 0 (como si fueran "activos")
          const productosActivos = data.productos.filter(p => p.stock > 0);
          setProductos(productosActivos);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]); // En caso de error, mostrar lista vacía
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const productosFiltrados = productos
    .filter((p) => (filtroCategoria === "todos" ? true : p.categoria === filtroCategoria))
    .sort((a, b) => {
      if (orden === "asc") return a.precio - b.precio;
      if (orden === "desc") return b.precio - a.precio;
      return 0;
    });

  if (cargando) {
    return (
      <section className="productos">
        <Titulo texto="Catálogo de Productos" />
        <p style={{ color: "#fff", textAlign: "center" }}>Cargando productos...</p>
      </section>
    );
  }

  return (
    <section className="productos">
      <Titulo texto="Catálogo de Productos" />

      <div className="filtros">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Shonen">Shonen</option>
          <option value="Shojo">Shojo</option>
          <option value="Seinen">Seinen</option>
          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="Drama">Drama</option>
          <option value="Comedia">Comedia</option>
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="ninguno">Ordenar por</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>

      <div className="grilla-productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </section>
  );
}