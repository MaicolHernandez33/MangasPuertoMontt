import { useEffect, useMemo, useState } from "react";
import Titulo from "../../atomos/Titulo";

export default function AdminReportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ Cargar datos desde la API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar usuarios
        const usuariosResponse = await fetch('http://localhost:5000/api/admin/usuarios');
        const usuariosData = await usuariosResponse.json();
        setUsuarios(usuariosData.usuarios || []);

        // Cargar productos
        const productosResponse = await fetch('http://localhost:5000/api/productos');
        const productosData = await productosResponse.json();
        setProductos(productosData.productos || []);

        // Cargar pedidos
        const pedidosResponse = await fetch('http://localhost:5000/api/admin/pedidos');
        const pedidosData = await pedidosResponse.json();
        setPedidos(pedidosData.pedidos || []);

      } catch (error) {
        console.error("Error cargando datos para reportes:", error);
        alert("❌ Error al cargar los datos para reportes");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Totales básicos
  const totalUsuarios = usuarios.length;
  const totalProductos = productos.length;
  const totalPedidos = pedidos.length;
  const totalVentas = useMemo(
    () => pedidos.reduce((acc, p) => acc + parseFloat(p.total || 0), 0),
    [pedidos]
  );

  // Stock crítico (productos con stock bajo)
  const criticos = useMemo(
    () => productos.filter((p) => p.stock <= 5), // Stock <= 5 como crítico
    [productos]
  );

  // Top 3 productos más vendidos
  const top3 = useMemo(() => {
    const contador = new Map(); // id -> {nombre, cantidad}
    
    for (const pedido of pedidos) {
      for (const item of pedido.items || []) {
        const prev = contador.get(item.producto_id) || { 
          nombre: item.nombre, 
          cantidad: 0 
        };
        prev.cantidad += item.cantidad || 1;
        contador.set(item.producto_id, prev);
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

  if (cargando) {
    return (
      <section className="admin-reportes">
        <Titulo texto="📊 Reportes Generales del Sistema" />
        <p>Cargando datos para reportes...</p>
      </section>
    );
  }

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

      {/* Productos con stock crítico */}
      <div className="panel">
        <h3>⚠️ Productos con stock crítico (≤ 5 unidades)</h3>
        {criticos.length === 0 ? (
          <p>Todo OK: no hay productos con stock crítico.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td style={{ 
                      color: p.stock === 0 ? '#ff5050' : '#ffa500',
                      fontWeight: 'bold' 
                    }}>
                      {p.stock}
                    </td>
                    <td>{p.categoria}</td>
                    <td>{p.stock === 0 ? 'SIN STOCK' : 'STOCK BAJO'}</td>
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

      {/* Información adicional */}
      <div className="panel">
        <h3>📈 Información Adicional</h3>
        <div className="info-adicional">
          <p><strong>Pedidos por estado:</strong></p>
          <ul>
            <li>Pendientes: {pedidos.filter(p => p.estado === 'pendiente').length}</li>
            <li>Confirmados: {pedidos.filter(p => p.estado === 'confirmado').length}</li>
            <li>Enviados: {pedidos.filter(p => p.estado === 'enviado').length}</li>
            <li>Entregados: {pedidos.filter(p => p.estado === 'entregado').length}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}