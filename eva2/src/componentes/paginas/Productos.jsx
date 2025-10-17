import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [orden, setOrden] = useState("ninguno");

  // 🔹 Cargar productos desde localStorage
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados);
  }, []);

  // 🔹 Filtrar y ordenar los productos antes de mostrarlos
  const productosFiltrados = productos
    .filter((p) => {
      if (filtroCategoria === "todos") return true;
      return p.tipo === filtroCategoria;
    })
    .sort((a, b) => {
      if (orden === "asc") return a.precio - b.precio;
      if (orden === "desc") return b.precio - a.precio;
      return 0;
    });

  return (
    <section className="productos">
      <Titulo texto="📚 Catálogo de Productos" />

      {/* === FILTROS === */}
      <div className="filtros">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="manga">Mangas</option>
          <option value="comic">Cómics</option>
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="ninguno">Ordenar por</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>

      {/* === PRODUCTOS === */}
      <div className="grilla-productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </section>
  );
}
