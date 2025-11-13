import Titulo from "../../atomos/Titulo";

export default function AdminInicio() {
  return (
    <section className="admin-inicio">
      <Titulo texto=" Bienvenido Administrador" />
      <p className="admin-bienvenida">
        Desde este panel podrás gestionar tus productos, usuarios y revisar los pedidos de clientes.
      </p>

      <div className="admin-dashboard">
        <article className="card-resumen">
          <h3>📦 Productos</h3>
          <p>Agrega, edita o elimina los productos disponibles en tu tienda.</p>
        </article>

        <article className="card-resumen">
          <h3>👥 Usuarios</h3>
          <p>Administra cuentas registradas y controla privilegios de acceso.</p>
        </article>

        <article className="card-resumen">
          <h3>🧾 Pedidos</h3>
          <p>Consulta el historial de compras y boletas generadas.</p>
        </article>
      </div>
    </section>
  );
}
