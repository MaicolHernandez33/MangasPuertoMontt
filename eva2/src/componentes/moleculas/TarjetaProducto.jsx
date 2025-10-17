import Boton from "../atomos/Boton";

export default function TarjetaProducto({ producto }) {
  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoActual.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    alert(`✅ ${producto.nombre} agregado al carrito`);
  };

  return (
    <article className="tarjeta-producto">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      {/* 👇 Nueva línea para descripción */}
      <p className="descripcion">
        {producto.descripcion?.length > 80
          ? producto.descripcion.substring(0, 80) + "..."
          : producto.descripcion}
      </p>
      <p className="precio">${producto.precio.toLocaleString("es-CL")}</p>
      <Boton texto="Agregar al carrito" onClick={agregarAlCarrito} />
    </article>
  );
}
