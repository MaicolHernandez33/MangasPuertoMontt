import { useEffect, useState } from "react";
import Titulo from "../Atomos/Titulo";
import Boton from "../Atomos/Boton";

export default function ConfirmacionCompra() {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const compraGuardada = JSON.parse(localStorage.getItem("ultimaCompra"));
    setCompra(compraGuardada);
  }, []);

  if (!compra) {
    return (
      <section className="confirmacion">
        <Titulo texto="🧾 No hay ninguna compra registrada" />
        <p>Por favor realiza una compra desde el carrito.</p>
      </section>
    );
  }

  const fecha = new Date(compra.fecha).toLocaleString("es-CL");

  return (
    <section className="confirmacion">
      <Titulo texto="✅ ¡Compra realizada con éxito!" />
      <p>Gracias por confiar en <strong>Tienda Mangas PuertoMontt</strong>.</p>

      <div className="boleta">
        <h3>🧾 Resumen de tu pedido</h3>
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Total:</strong> ${compra.total.toLocaleString("es-CL")}</p>

        <div className="boleta-items">
          {compra.items.map((p, i) => (
            <div key={i} className="boleta-item">
              <img src={p.imagen} alt={p.nombre} />
              <span>{p.nombre}</span>
              <span>${p.precio.toLocaleString("es-CL")}</span>
            </div>
          ))}
        </div>
      </div>

      <Boton
        texto="🏠 Volver al inicio"
        onClick={() => (window.location.href = "/")}
      />
    </section>
  );
}
