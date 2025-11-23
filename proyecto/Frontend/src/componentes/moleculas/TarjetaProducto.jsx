import { useState } from "react";
import Boton from "../atomos/Boton";
import { API_BASE_URL } from "../config"; 

export default function TarjetaProducto({ producto }) {
  const [verDetalle, setVerDetalle] = useState(false);
  const [cargando, setCargando] = useState(false);

  const agregarAlCarrito = async () => {
    setCargando(true);
    
    try {
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
      
      if (usuarioActivo) {
        const response = await fetch(`${API_BASE_URL}/api/carrito`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'usuario-id': usuarioActivo.id.toString()
          },
          body: JSON.stringify({
            producto_id: producto.id,
            cantidad: 1
          })
        });

        if (response.ok) {
          alert(`✅ ${producto.nombre} agregado al carrito`);
        } else {
          const error = await response.json();
          throw new Error(error.error);
        }
      } else {
        const carritoAnonimo = JSON.parse(localStorage.getItem("carrito_anonimo") || "[]");
        const existente = carritoAnonimo.find((item) => item.id === producto.id);
        if (existente) {
          existente.cantidad = (existente.cantidad || 1) + 1;
        } else {
          carritoAnonimo.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito_anonimo", JSON.stringify(carritoAnonimo));
        alert(`✅ ${producto.nombre} agregado al carrito`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  //  Calcular precio con descuento
  const tieneDescuento = producto.descuento && producto.descuento > 0;
  const precioFinal = tieneDescuento 
    ? producto.precio * (1 - producto.descuento / 100) 
    : producto.precio;

  return (
    <>
      <article className="tarjeta-producto">
        {tieneDescuento && <span className="badge-descuento">-{producto.descuento}%</span>}
        <img src={producto.imagen} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
        <p className="precio">
          {tieneDescuento && <span className="precio-original">${parseFloat(producto.precio).toLocaleString("es-CL")}</span>}
          ${precioFinal.toLocaleString("es-CL")}
        </p>
        <p>🏷️ {producto.categoria}</p>
        {producto.autor && <p>✍️ {producto.autor}</p>}
        <p className="descripcion">
          {producto.descripcion?.length > 80 
            ? producto.descripcion.substring(0, 80) + "..." 
            : producto.descripcion}
        </p>

        <Boton 
          texto={cargando ? "🔄 Agregando..." : "🛒 Agregar al carrito"} 
          onClick={agregarAlCarrito} 
          disabled={cargando}
        />
        <Boton texto="🔍 Ver Detalles" onClick={() => setVerDetalle(true)} />
      </article>

      {verDetalle && (
        <div className="modal">
          <div className="modal-contenido">
            {tieneDescuento && <span className="badge-descuento">-{producto.descuento}%</span>}
            <h2>{producto.nombre}</h2>
            <img src={producto.imagen} alt={producto.nombre} style={{ width: "250px", borderRadius: "10px" }} />
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p><strong>Precio:</strong> 
              {tieneDescuento && <span className="precio-original">${parseFloat(producto.precio).toLocaleString("es-CL")}</span>}
              ${precioFinal.toLocaleString("es-CL")}
            </p>
            <p><strong>Stock:</strong> {producto.stock}</p>
            {producto.autor && <p><strong>Autor:</strong> {producto.autor}</p>}
            <p>{producto.descripcion}</p>
            <Boton 
              texto={cargando ? "🔄 Agregando..." : "🛒 Agregar al carrito"} 
              onClick={agregarAlCarrito} 
              disabled={cargando}
            />
            <Boton texto="❌ Cerrar" onClick={() => setVerDetalle(false)} />
          </div>
        </div>
      )}
    </>
  );
}