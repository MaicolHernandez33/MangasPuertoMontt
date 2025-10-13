import { useState, useEffect } from "react";
import CampoTexto from "../../atomos/CampoTexto";
import Boton from "../../atomos/Boton";
import Titulo from "../../atomos/Titulo";

export default function AdminProductos() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [productos, setProductos] = useState([]);

  // Cargar productos desde localStorage al iniciar
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(productosGuardados);
  }, []);

  // Guardar productos cuando cambien
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = () => {
    if (!nombre || !precio || !imagen) {
      alert("⚠️ Completa todos los campos antes de agregar un producto.");
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio: parseInt(precio),
      imagen,
    };

    setProductos([...productos, nuevoProducto]);
    setNombre("");
    setPrecio("");
    setImagen("");
    alert("✅ Producto agregado correctamente.");
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      const nuevosProductos = productos.filter((p) => p.id !== id);
      setProductos(nuevosProductos);
    }
  };

  return (
    <section className="admin-productos">
      <Titulo texto="⚙️ Administrar Productos" />

      <div className="formulario-admin">
        <CampoTexto placeholder="Nombre del producto" valor={nombre} onChange={setNombre} />
        <CampoTexto tipo="number" placeholder="Precio (CLP)" valor={precio} onChange={setPrecio} />
        <CampoTexto placeholder="Ruta o URL de la imagen" valor={imagen} onChange={setImagen} />
        <Boton texto="Agregar Producto" onClick={agregarProducto} />
      </div>

      <hr />

      <div className="lista-productos">
        <h3> Productos Registrados ({productos.length})</h3>
        <div className="grid-productos">
          {productos.map((p) => (
            <article key={p.id} className="tarjeta-producto">
              <img src={p.imagen} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p>${p.precio.toLocaleString("es-CL")}</p>
              <Boton texto="🗑 Eliminar" onClick={() => eliminarProducto(p.id)} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
