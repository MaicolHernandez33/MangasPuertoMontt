import { useEffect, useMemo, useState } from "react";
import Titulo from "../../atomos/Titulo";

/**
 * Convenciones de storage:
 * - productos: [{id, nombre, precio, imagen, tipo, descripcion, stock, stockCritico, activo}]
 * - pedidos:   [{id, usuario, correo, fecha, items:[{id, nombre, precio, cantidad}], total}]
 */
export default function AdminReportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    setUsuarios(JSON.parse(localStorage.getItem("usuarios")) || []);
    setProductos(JSON.parse(localStorage.getItem("productos")) || []);
    setPedidos(JSON.parse(localStorage.getItem("pedidos")) || []);
  }, []);

  // Totales básicos
  const totalUsuarios = usuarios.length;
  const totalProductos = productos.length;
  const totalPedidos = pedidos.length;
  const totalVentas = useMemo(
    () => pedidos.reduce((acc, p) => acc + (p.total || 0), 0),
    [pedidos]
  );

  // Stock crítico / inactivos
  const criticos = useMemo(
    () =>
      productos.filter(
        (p) =>
          (typeof p.stock === "number" &&
            typeof p.stockCritico === "number" &&
            p.stock <= p.stockCritico) ||
          p.activo === false
      ),
    [productos]
  );

  // Top 3 productos más vendidos
  const top3 = useMemo(() => {
    const contador = new Map(); // id -> {nombre, cantidad}
    for (const ped of pedidos) {
      for (const item of ped.items || []) {
        const prev = contador.get(item.id) || { nombre: item.nombre, cantidad: 0 };
        prev.cantidad += item.cantidad || 1;
        contador.set(item.id, prev);
      }
    }
    const arr = Array.from(contador.entries()).map(([id, v]) => ({
      id,
      nombre: v.nombre,
      cantidad: v.cantidad,
    }));
    arr.sort((a, b) => b.cantidad - a.cantidad);
    return arr.slice(0, 3);
  }, [pedidos]);


  const maxCantidad = Math.max(1, ...top3.map((t) => t.cantidad));

  return (
    <section className="admin-reportes">
      <Titulo texto="📊 Reportes Generales del Sistema" />

      {/* Tarjetas de KPIs */}
      <div className="reporte-grid">
        <div className="reporte-card">
          <h3>👥 Usuarios</h3>
          <p>{totalUsuarios}</p>
        </div>
        <div className="reporte-card">
          <h3>📦 Productos</h3>
          <p>{totalProductos}</p>
        </div>
        <div className="reporte-card">
          <h3>🧾 Pedidos</h3>
          <p>{totalPedidos}</p>
        </div>
        <div className="reporte-card total">
          <h3>💰 Ventas Totales</h3>
          <p>${totalVentas.toLocaleString("es-CL")}</p>
        </div>
      </div>

      {/* Productos en riesgo / inactivos */}
      <div className="panel">
        <h3>⚠️ Productos con stock crítico o inactivos</h3>
        {criticos.length === 0 ? (
          <p>Todo OK: no hay productos en estado crítico.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Crítico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.stock ?? "-"}</td>
                    <td>{p.stockCritico ?? "-"}</td>
                    <td>{p.activo === false ? "Inactivo" : "Activo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top 3 más vendidos con barras */}
      <div className="panel">
        <h3>🏆 Top 3 productos más vendidos</h3>
        {top3.length === 0 ? (
          <p>Todavía no hay ventas registradas.</p>
        ) : (
          <div className="bars">
            {top3.map((t) => (
              <div key={t.id} className="bar-item">
                <div className="bar-label">
                  <span>{t.nombre}</span>
                  <span>{t.cantidad} u.</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(t.cantidad / maxCantidad) * 100}%` }}
                    title={`${t.cantidad} unidades`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 
