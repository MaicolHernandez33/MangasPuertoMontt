import { useState, useEffect } from "react";
import Titulo from "../../Atomos/Titulo";
import CampoTexto from "../../Atomos/CampoTexto";
import Boton from "../../Atomos/Boton";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState("");
  const [autor, setAutor] = useState("");
  const [tipo, setTipo] = useState(""); 
  const [descuento, setDescuento] = useState(""); 
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar productos desde la BD
  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data.productos || []);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  //  Guardar producto en la BD
  const guardarProducto = async () => {
    if (!nombre || !precio || !imagen || !categoria || !descripcion || !stock || !tipo) {
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

    if (parseFloat(descuento) < 0 || parseFloat(descuento) > 100) {
      alert("⚠️ Descuento inválido (0-100%).");
      return;
    }

    setCargando(true);

    try {
      const productoData = {
        nombre,
        precio: parseFloat(precio),
        imagen,
        categoria,
        descripcion,
        stock: parseInt(stock),
        autor: autor || "Desconocido",
        tipo,
        descuento: parseFloat(descuento) || 0
      };

      let response;
      
      if (modoEdicion) {
        // Actualizar producto existente
        response = await fetch(`http://localhost:5000/api/admin/productos/${idEditar}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoData)
        });
      } else {
        //  Crear nuevo producto
        response = await fetch('http://localhost:5000/api/admin/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoData)
        });
      }

      if (response.ok) {
        alert(modoEdicion ? "✏️ Producto actualizado." : "✅ Producto agregado.");
        await cargarProductos(); // Recargar lista
        limpiarCampos();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  //  Eliminar producto de la BD
  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/productos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert("🗑️ Producto eliminado.");
        await cargarProductos();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const editarProducto = (p) => {
    setNombre(p.nombre);
    setPrecio(p.precio);
    setImagen(p.imagen);
    setCategoria(p.categoria);
    setDescripcion(p.descripcion);
    setStock(p.stock);
    setAutor(p.autor || "");
    setTipo(p.tipo || "manga");
    setDescuento(p.descuento || 0);
    setModoEdicion(true);
    setIdEditar(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const limpiarCampos = () => {
    setNombre("");
    setPrecio("");
    setImagen("");
    setCategoria("");
    setDescripcion("");
    setStock("");
    setAutor("");
    setTipo("");
    setDescuento("");
    setModoEdicion(false);
    setIdEditar(null);
  };

  return (
    <section className="admin-productos">
      <Titulo texto="⚙️ Gestión de Productos" />

      {/* === FORMULARIO === */}
      <div className="formulario-admin">
        <CampoTexto placeholder="Nombre del producto" valor={nombre} onChange={setNombre} />
        <CampoTexto tipo="number" placeholder="Precio (CLP)" valor={precio} onChange={setPrecio} />
        <CampoTexto placeholder="URL o ruta de la imagen" valor={imagen} onChange={setImagen} />
        <CampoTexto placeholder="Autor" valor={autor} onChange={setAutor} />

        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="campo-texto">
          <option value="">Seleccionar categoría</option>
          <option value="Shonen">Shonen</option>
          <option value="Shojo">Shojo</option>
          <option value="Seinen">Seinen</option>
          <option value="Acción">Acción</option>
          <option value="Aventura">Aventura</option>
          <option value="Drama">Drama</option>
          <option value="Comedia">Comedia</option>
        </select>

        {/* NUEVO: Tipo */}
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="campo-texto">
          <option value="">Seleccionar tipo</option>
          <option value="manga">Manga</option>
          <option value="comic">Comic</option>
        </select>

        {/* NUEVO: Descuento */}
        <CampoTexto tipo="number" placeholder="Descuento (%)" valor={descuento} onChange={setDescuento} />

        <CampoTexto tipo="number" placeholder="Stock disponible" valor={stock} onChange={setStock} />

        <textarea
          placeholder="Descripción del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows="3"
          className="campo-texto"
        ></textarea>

        <Boton
          texto={cargando ? "Guardando..." : (modoEdicion ? "💾 Guardar Cambios" : "Agregar Producto")}
          onClick={guardarProducto}
          disabled={cargando}
        />
        {modoEdicion && <Boton texto="❌ Cancelar" onClick={limpiarCampos} disabled={cargando} />}
      </div>

      <hr />

      <h3>📦 Productos Registrados ({productos.length})</h3>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="grid-productos">
          {productos.map((p) => (
            <article key={p.id} className="tarjeta-producto">
              <img src={p.imagen} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p className="precio">
                ${parseFloat(p.precio).toLocaleString("es-CL")}
                {p.descuento > 0 && <span> (-{p.descuento}%)</span>}
              </p>
              <p>📦 Stock: {p.stock}</p>
              <p>✍️ Autor: {p.autor}</p>
              <p>🏷️ {p.categoria}</p>
              <p>🎯 Tipo: {p.tipo}</p>
              <p className="descripcion">
                {p.descripcion?.length > 60 ? p.descripcion.substring(0, 60) + "..." : p.descripcion}
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
