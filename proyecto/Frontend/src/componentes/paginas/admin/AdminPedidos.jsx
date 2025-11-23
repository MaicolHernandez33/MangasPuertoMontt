import { useState, useEffect } from "react";
import Titulo from "../../atomos_temp/Titulo";
import Boton from "../../atomos_temp/Boton";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ Cargar pedidos desde la API
  const cargarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/pedidos');
      if (response.ok) {
        const data = await response.json();
        setPedidos(data.pedidos || []);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      alert("❌ Error al cargar los pedidos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // ✅ Cambiar estado del pedido
  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      // Nota: Necesitaríamos agregar este endpoint en el backend
      const response = await fetch(`http://localhost:5000/api/admin/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        alert(`✅ Pedido marcado como "${nuevoEstado}"`);
        await cargarPedidos(); // Recargar lista
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // ✅ Eliminar un pedido (si decides implementarlo)
  const eliminarPedido = async (id) => {
    if (!confirm("¿Deseas eliminar este pedido?")) return;

    try {
      // Nota: Necesitaríamos agregar este endpoint en el backend
      const response = await fetch(`http://localhost:5000/api/admin/pedidos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert("🗑️ Pedido eliminado correctamente.");
        await cargarPedidos(); // Recargar lista
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  if (cargando) {
    return (
      <section className="admin-pedidos">
        <Titulo texto="🧾 Historial de Pedidos" />
        <p>Cargando pedidos...</p>
      </section>
    );
  }

  return (
    <section className="admin-pedidos">
      <Titulo texto="🧾 Historial de Pedidos" />

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados aún.</p>
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
                  <th>Estado</th>
                  <th>Productos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{new Date(pedido.fecha_pedido).toLocaleString("es-CL")}</td>
                    <td>{pedido.usuario_nombre}</td>
                    <td>{pedido.usuario_correo}</td>
                    <td>${parseFloat(pedido.total).toLocaleString("es-CL")}</td>
                    <td>
                      <span className={`estado-pedido estado-${pedido.estado}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>
                      <details>
                        <summary>Ver productos ({pedido.items?.length || 0})</summary>
                        <ul>
                          {pedido.items?.map((item, i) => (
                            <li key={i}>
                              {item.nombre} - ${parseFloat(item.precio).toLocaleString("es-CL")} x {item.cantidad}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>
                      <div className="acciones-pedido">
                        <select 
                          value={pedido.estado} 
                          onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                          className="select-estado"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        {/* Opcional: Eliminar pedido */}
                        {/* <Boton texto="Eliminar" onClick={() => eliminarPedido(pedido.id)} /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="estadisticas-pedidos">
            <h3>📊 Resumen</h3>
            <p>Total de pedidos: <strong>{pedidos.length}</strong></p>
            <p>Ingresos totales: <strong>$
              {pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0).toLocaleString("es-CL")}
            </strong></p>
          </div>
        </>
      )}
    </section>
  );
}