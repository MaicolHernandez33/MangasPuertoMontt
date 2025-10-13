import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import Boton from "../atomos/Boton";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);

  // 🔹 Cargar el carrito guardado cuando la página se abre
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  // 🔹 Guardar el carrito cada vez que se modifique
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // 🔹 Eliminar un producto individual
  const eliminarItem = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  // 🔹 Vaciar todo el carrito
  const vaciarCarrito = () => {
    if (confirm("¿Vaciar todo el carrito?")) {
      setCarrito([]);
      localStorage.removeItem("carrito");
    }
  };

  // 🔹 Calcular el total
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  // ✅ Nueva función: pagar compra (guardar boleta)
  const pagarCompra = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const compra = {
      fecha: new Date(),
      items: carrito,
      total: total,
    };

    // Guardar los datos de la compra para mostrar luego en ConfirmacionCompra.jsx
    localStorage.setItem("ultimaCompra", JSON.stringify(compra));

    // Limpiar carrito
    localStorage.removeItem("carrito");
    setCarrito([]);

    // Confirmar y redirigir
    alert("✅ Compra realizada correctamente.");
    window.location.href = "/confirmacion";
  };

  return (
    <section className="carrito">
      <Titulo texto="🛒 Carrito de compras" />

      {carrito.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((item) => (
              <article key={item.id} className="tarjeta-carrito">
                <img src={item.imagen} alt={item.nombre} />
                <div className="info">
                  <h4>{item.nombre}</h4>
                  <p>${item.precio.toLocaleString("es-CL")}</p>
                  <Boton texto="Eliminar" onClick={() => eliminarItem(item.id)} />
                </div>
              </article>
            ))}
          </div>

          <div className="resumen-carrito">
            <h3>Total: ${total.toLocaleString("es-CL")}</h3>
            <Boton texto="Vaciar carrito" onClick={vaciarCarrito} />
            <Boton texto="Pagar" onClick={pagarCompra} />
          </div>
        </>
      )}
    </section>
  );
}
