import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import Boton from "../atomos/Boton";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [claveCarrito, setClaveCarrito] = useState("carrito_anonimo");

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const clave = usuarioActivo ? `carrito_${usuarioActivo.correo}` : "carrito_anonimo";
    setClaveCarrito(clave);
    const guardado = JSON.parse(localStorage.getItem(clave)) || [];
    setCarrito(guardado);
  }, []);

  useEffect(() => {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
  }, [carrito, claveCarrito]);

  const eliminarItem = (id) => {
    setCarrito(carrito.filter((i) => i.id !== id));
  };

  const vaciarCarrito = () => {
    if (confirm("¿Vaciar todo el carrito?")) {
      setCarrito([]);
      localStorage.setItem(claveCarrito, "[]");
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);

  const pagarCompra = () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) return alert("⚠️ Debes iniciar sesión para pagar.");

    const compra = {
      id: Date.now(),
      usuario: usuarioActivo.nombre,
      correo: usuarioActivo.correo,
      fecha: new Date().toLocaleString(),
      items: carrito,
      total,
    };

    // Guardar historial personal
    const claveCompras = `compras_${usuarioActivo.correo}`;
    const historial = JSON.parse(localStorage.getItem(claveCompras)) || [];
    historial.push(compra);
    localStorage.setItem(claveCompras, JSON.stringify(historial));

    // Guardar en pedidos globales
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(compra);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("✅ Compra realizada correctamente.");
    setCarrito([]);
    localStorage.setItem(claveCarrito, "[]");
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
                  <p>
                    ${item.precio.toLocaleString("es-CL")} × {item.cantidad || 1}
                  </p>
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
