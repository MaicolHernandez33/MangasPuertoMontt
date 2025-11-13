import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas/TarjetaProducto";
import Titulo from "../atomos/Titulo";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [orden, setOrden] = useState("ninguno");

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados.filter((p) => p.activo !== false));
  }, []);

  const productosFiltrados = productos
    .filter((p) => (filtroCategoria === "todos" ? true : p.categoria === filtroCategoria))
    .sort((a, b) => {
      if (orden === "asc") return a.precio - b.precio;
      if (orden === "desc") return b.precio - a.precio;
      return 0;
    });

  return (
    <section className="productos">
      <Titulo texto="Catálogo de Productos" />

      <div className="filtros">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="manga">Mangas</option>
          <option value="comic">Cómics</option>
          <option value="figura">Figuras</option>
          <option value="otro">Otros</option>
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
