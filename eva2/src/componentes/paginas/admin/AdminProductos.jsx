import { useState, useEffect } from "react";
import Titulo from "../../atomos/Titulo";
import CampoTexto from "../../atomos/CampoTexto";
import Boton from "../../atomos/Boton";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState("");
  const [stockCritico, setStockCritico] = useState("");
  const [activo, setActivo] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // 🔹 Cargar productos
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados);
  }, []);

  const guardarProductos = (lista) => {
    setProductos(lista);
    localStorage.setItem("productos", JSON.stringify(lista));
  };

  // 🔹 Validaciones y guardado
  const guardarProducto = () => {
    if (!nombre || !precio || !imagen || !categoria || !descripcion) {
      alert("⚠️ Completa todos los campos obligatorios.");
      return;
    }

    if (parseFloat(precio) <= 0) {
      alert("⚠️ El precio debe ser mayor a 0.");
      return;
    }

    if (parseInt(stock) < 0) {
      alert("⚠️ El stock no puede ser negativo.");
      return;
    }

    const urlValida = /^(https?:\/\/|\/img\/).+/i.test(imagen);
    if (!urlValida) {
      alert("⚠️ Ingresa una URL válida para la imagen.");
      return;
    }

    const nuevoProducto = {
      id: modoEdicion ? idEditar : Date.now(),
      nombre,
      precio: parseFloat(precio),
      imagen,
      categoria,
      descripcion,
      stock: parseInt(stock) || 0,
      stockCritico: parseInt(stockCritico) || 0,
      activo,
    };

    const actualizados = modoEdicion
      ? productos.map((p) => (p.id === idEditar ? nuevoProducto : p))
      : [...productos, nuevoProducto];

    guardarProductos(actualizados);
    alert(modoEdicion ? "✏️ Producto actualizado." : "✅ Producto agregado.");

    limpiarCampos();
    setModoEdicion(false);
  };

  const editarProducto = (p) => {
    setNombre(p.nombre);
    setPrecio(p.precio);
    setImagen(p.imagen);
    setCategoria(p.categoria);
    setDescripcion(p.descripcion);
    setStock(p.stock);
    setStockCritico(p.stockCritico);
    setActivo(p.activo);
    setModoEdicion(true);
    setIdEditar(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      const filtrados = productos.filter((p) => p.id !== id);
      guardarProductos(filtrados);
      alert("🗑️ Producto eliminado.");
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setPrecio("");
    setImagen("");
    setCategoria("");
    setDescripcion("");
    setStock("");
    setStockCritico("");
    setActivo(true);
  };

  return (
    <section className="admin-productos">
      <Titulo texto="⚙️ Gestión de Productos" />

      {/* === FORMULARIO === */}
      <div className="formulario-admin">
        <CampoTexto placeholder="Nombre del producto" valor={nombre} onChange={setNombre} />
        <CampoTexto tipo="number" placeholder="Precio (CLP)" valor={precio} onChange={setPrecio} />
        <CampoTexto placeholder="URL o ruta de la imagen" valor={imagen} onChange={setImagen} />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="campo-texto"
        >
          <option value="">Seleccionar categoría</option>
          <option value="manga">Manga</option>
          <option value="comic">Cómic</option>
          <option value="figura">Figura</option>
          <option value="otro">Otro</option>
        </select>

        <CampoTexto tipo="number" placeholder="Stock disponible" valor={stock} onChange={setStock} />
        <CampoTexto tipo="number" placeholder="Stock crítico" valor={stockCritico} onChange={setStockCritico} />

        <label style={{ color: "white", marginBottom: "8px" }}>
          <input type="checkbox" checked={activo} onChange={() => setActivo(!activo)} /> Producto activo
        </label>

        <textarea
          placeholder="Descripción del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="3"
          className="campo-texto"
        ></textarea>

        <Boton
          texto={modoEdicion ? "💾 Guardar Cambios" : "Agregar Producto"}
          onClick={guardarProducto}
        />
        {modoEdicion && <Boton texto="❌ Cancelar" onClick={limpiarCampos} />}
      </div>

      <hr />

      <h3>📦 Productos Registrados ({productos.length})</h3>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="grid-productos">
          {productos.map((p) => (
            <article
              key={p.id}
              className="tarjeta-producto"
              style={{
                opacity: p.activo ? 1 : 0.5,
                border: p.stock < p.stockCritico ? "2px solid red" : "1px solid #444",
              }}
            >
              <img src={p.imagen} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p className="precio">${p.precio.toLocaleString("es-CL")}</p>
              <p>📦 Stock: {p.stock}</p>
              <p>⚠️ Crítico: {p.stockCritico}</p>
              <p>🏷️ {p.categoria}</p>
              <p className="descripcion">
                {p.descripcion.length > 60
                  ? p.descripcion.substring(0, 60) + "..."
                  : p.descripcion}
              </p>

              <div className="acciones-admin">
                <Boton texto="✏️ Editar" onClick={() => editarProducto(p)} />
                <Boton texto="🗑️ Eliminar" onClick={() => eliminarProducto(p.id)} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
