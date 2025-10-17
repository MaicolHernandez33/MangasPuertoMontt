import Titulo from "../../atomos/Titulo";
import CampoTexto from "../../atomos/CampoTexto";
import Boton from "../../atomos/Boton";
import { useState, useEffect } from "react";

export default function AdminProductos({ cambiarPagina }) {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [tipo, setTipo] = useState(""); // 👈 nuevo campo
  const [descripcion, setDescripcion] = useState(""); // 👈 nuevo campo

  // 🔹 Cargar productos guardados
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados);
  }, []);

  // 🔹 Guardar nuevos productos
  const agregarProducto = () => {
    if (!nombre || !precio || !imagen || !tipo || !descripcion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre,
      precio: parseFloat(precio),
      imagen,
      tipo,
      descripcion,
    };

    const nuevosProductos = [...productos, nuevo];
    setProductos(nuevosProductos);
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));

    // Limpiar campos
    setNombre("");
    setPrecio("");
    setImagen("");
    setTipo("");
    setDescripcion("");

    alert("✅ Producto agregado correctamente.");
  };

  // 🔹 Cerrar sesión
  const cerrarSesion = () => {
    if (confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("usuarioActivo");
      alert("👋 Sesión cerrada correctamente.");
      cambiarPagina("inicio");
    }
  };

  return (
    <section className="admin-productos">
      {/* Encabezado superior */}
      <div className="admin-header">
        <h2>👑 Bienvenido Administrador</h2>
        <Boton texto="🚪 Cerrar sesión" onClick={cerrarSesion} />
      </div>

      <Titulo texto="⚙️ Administrar Productos" />

      {/* === FORMULARIO === */}
      <div className="formulario-admin">
        <CampoTexto
          placeholder="Nombre del producto"
          valor={nombre}
          onChange={setNombre}
        />
        <CampoTexto
          tipo="number"
          placeholder="Precio (CLP)"
          valor={precio}
          onChange={setPrecio}
        />
        <CampoTexto
          placeholder="Ruta o URL de la imagen"
          valor={imagen}
          onChange={setImagen}
        />

        {/* 🔸 Selector tipo */}
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="campo-texto"
        >
          <option value="">Seleccionar tipo</option>
          <option value="manga">Manga</option>
          <option value="comic">Cómic</option>
        </select>

        {/* 🔸 Campo descripción */}
        <textarea
          placeholder="Descripción breve del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="3"
          className="campo-texto"
        ></textarea>

        <Boton texto="Agregar Producto" onClick={agregarProducto} />
      </div>

      <hr />

      {/* === LISTA DE PRODUCTOS === */}
      <h3>📦 Productos Registrados ({productos.length})</h3>
      <div className="grid-productos">
        {productos.map((p) => (
          <article key={p.id} className="tarjeta-producto">
            <img src={p.imagen} alt={p.nombre} />
            <h4>{p.nombre}</h4>
            <p className="precio">${p.precio.toLocaleString("es-CL")}</p>
            <p className="tipo">🗂️ {p.tipo}</p>
            <p className="descripcion">
              {p.descripcion.length > 60
                ? p.descripcion.substring(0, 60) + "..."
                : p.descripcion}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
