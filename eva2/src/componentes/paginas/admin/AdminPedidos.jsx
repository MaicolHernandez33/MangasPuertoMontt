import { useState, useEffect } from "react";
import Titulo from "../../atomos/Titulo";
import Boton from "../../atomos/Boton";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  // 🔹 Cargar pedidos globales desde localStorage
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(guardados);
  }, []);

  // 🔹 Eliminar un pedido
  const eliminarPedido = (id) => {
    if (confirm("¿Deseas eliminar esta boleta?")) {
      const nuevos = pedidos.filter((p) => p.id !== id);
      setPedidos(nuevos);
      localStorage.setItem("pedidos", JSON.stringify(nuevos));
      alert("🗑️ Boleta eliminada correctamente.");
    }
  };

  // 🔹 Vaciar todos los pedidos
  const vaciarPedidos = () => {
    if (confirm("⚠️ Esto eliminará todo el historial de pedidos. ¿Continuar?")) {
      setPedidos([]);
      localStorage.removeItem("pedidos");
      alert("🧾 Historial eliminado correctamente.");
    }
  };

  return (
    <section className="admin-pedidos">
      <Titulo texto="🧾 Historial de Boletas / Pedidos" />

      {pedidos.length === 0 ? (
        <p>No hay boletas registradas aún.</p>
      ) : (
        <>
          <div className="tabla-contenedor">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Total (CLP)</th>
                  <th>Productos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>{p.fecha}</td>
                    <td>{p.usuario}</td>
                    <td>{p.correo}</td>
                    <td>${p.total.toLocaleString("es-CL")}</td>
                    <td>
                      <details>
                        <summary>Ver detalles</summary>
                        <ul>
                          {p.items.map((item, i) => (
                            <li key={i}>
                              {item.nombre} — ${item.precio.toLocaleString("es-CL")}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <Boton texto="Eliminar" onClick={() => eliminarPedido(p.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="acciones-pedidos">
            <Boton texto="🧹 Vaciar historial" onClick={vaciarPedidos} />
          </div>
        </>
      )}
    </section>
  );
}
