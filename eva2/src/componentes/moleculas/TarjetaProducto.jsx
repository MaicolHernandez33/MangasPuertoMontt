import Boton from "../atomos/Boton";

export default function TarjetaProducto({ producto }) {
  const agregarAlCarrito = () => {
    // Obtener el carrito actual o crear uno nuevo
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregar el producto
    carritoActual.push(producto);

    // Guardar nuevamente en localStorage
    localStorage.setItem("carrito", JSON.stringify(carritoActual));

    alert(`✅ ${producto.nombre} agregado al carrito`);
  };

  return (
    <article className="tarjeta-producto">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio.toLocaleString("es-CL")}</p>
      <Boton texto="Agregar al carrito" onClick={agregarAlCarrito} />
    </article>
  ); 
}
