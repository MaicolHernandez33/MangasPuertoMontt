import { useState, useEffect } from "react";
import TarjetaProducto from "../moleculas_temp/TarjetaProducto";
import Titulo from "../atomos_temp/Titulo";

export default function CatalogoCompleto() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState(""); // "manga" | "comic" | ""
  const [ordenPrecio, setOrdenPrecio] = useState(""); // "asc" | "desc"
  const [soloOfertas, setSoloOfertas] = useState(false);

  // Cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/productos");
        if (response.ok) {
          const data = await response.json();
          setProductos(data.productos || []);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // Aplicar filtros
  let productosFiltrados = productos.filter((p) => {
    // Filtrar por tipo
    if (tipoFiltro === "manga" && !["Shonen", "Shojo", "Seinen"].includes(p.categoria)) return false;
    if (tipoFiltro === "comic" && !["Acción", "Aventura", "Drama", "Comedia"].includes(p.categoria)) return false;

    // Filtrar solo ofertas
    if (soloOfertas && (!p.descuento || p.descuento <= 0)) return false;

    return true;
  });

  // Ordenar por precio
  if (ordenPrecio === "asc") {
    productosFiltrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (ordenPrecio === "desc") {
    productosFiltrados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  }

  if (cargando) return <p style={{ color: "#fff", textAlign: "center" }}>Cargando catálogo...</p>;

  return (
    <section className="catalogo-completo">
      <Titulo texto="📚 Catálogo Completo" />

      {/* === FILTROS === */}
      <div className="filtros">
        <div>
          <label>Tipo:</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="">Todos</option>
            <option value="manga">Mangas</option>
            <option value="comic">Cómics</option>
          </select>
        </div>

        <div>
          <label>Ordenar por precio:</label>
          <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)}>
            <option value="">Sin orden</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={soloOfertas}
              onChange={() => setSoloOfertas(!soloOfertas)}
            />
            Solo productos en oferta
          </label>
        </div>
      </div>

      {/* === LISTA DE PRODUCTOS === */}
      <div className="grilla-productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => <TarjetaProducto key={p.id} producto={p} />)
        ) : (
          <p>No se encontraron productos con los filtros seleccionados.</p>
        )}
      </div>
    </section>
  );
}
