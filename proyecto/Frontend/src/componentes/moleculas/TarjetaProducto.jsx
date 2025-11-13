import { useState } from "react";
import Boton from "../atomos/Boton";

export default function TarjetaProducto({ producto }) {
  const [verDetalle, setVerDetalle] = useState(false);

  const agregarAlCarrito = () => {
    try {
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
      const claveCarrito = usuarioActivo ? `carrito_${usuarioActivo.correo}` : "carrito_anonimo";
      const carritoGuardado = JSON.parse(localStorage.getItem(claveCarrito)) || [];

      const existente = carritoGuardado.find((item) => item.id === producto.id);
      if (existente) existente.cantidad = (existente.cantidad || 1) + 1;
      else carritoGuardado.push({ ...producto, cantidad: 1 });

      localStorage.setItem(claveCarrito, JSON.stringify(carritoGuardado));
      alert(`✅ ${producto.nombre} agregado al carrito`);
    } catch (err) {
      alert("❌ Error al agregar al carrito.");
    }
  };

  return (
    <>
      <article className="tarjeta-producto">
        <img src={producto.imagen} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
        <p className="precio">${producto.precio.toLocaleString("es-CL")}</p>
        <p>🏷️ {producto.categoria}</p>
        <p className="descripcion">
          {producto.descripcion.length > 80 ? producto.descripcion.substring(0, 80) + "..." : producto.descripcion}
        </p>

        <Boton texto="🛒 Agregar al carrito" onClick={agregarAlCarrito} />
        <Boton texto="🔍 Ver Detalles" onClick={() => setVerDetalle(true)} />
      </article>

      {verDetalle && (
        <div className="modal">
          <div className="modal-contenido">
            <h2>{producto.nombre}</h2>
            <img src={producto.imagen} alt={producto.nombre} style={{ width: "250px", borderRadius: "10px" }} />
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p><strong>Precio:</strong> ${producto.precio.toLocaleString("es-CL")}</p>
            <p><strong>Stock:</strong> {producto.stock}</p>
            <p>{producto.descripcion}</p>
            <Boton texto="🛒 Agregar al carrito" onClick={agregarAlCarrito} />
            <Boton texto="❌ Cerrar" onClick={() => setVerDetalle(false)} />
          </div>
        </div>
      )}
    </>
  );
}
