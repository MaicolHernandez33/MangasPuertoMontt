import { useState } from "react";
import Titulo from "../atomos/Titulo";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarCorreo = (correo) => {
    const regex = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!form.nombre || !form.correo || !form.mensaje) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (!validarCorreo(form.correo)) {
      setError(
        "❌ El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com."
      );
      return;
    }

    if (form.mensaje.length > 500) {
      setError("⚠️ El mensaje no puede superar los 500 caracteres.");
      return;
    }

    // Si todo está bien
    setExito("✅ Mensaje enviado correctamente. ¡Gracias por contactarnos!");
    setForm({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <header className="auth-head">
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <Titulo texto="📞 Contáctanos" />
        </header>

        <div className="auth-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-control">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                maxLength="100"
                required
                className="campo-texto"
              />
            </div>

            <div className="form-control">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="tu_correo@duoc.cl"
                maxLength="100"
                required
                className="campo-texto"
              />
              <small className="hint">
                Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com
              </small>
            </div>

            <div className="form-control">
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                maxLength="500"
                required
                className="campo-texto"
              ></textarea>
              <small className="hint">Máx. 500 caracteres</small>
            </div>

            {error && <p style={{ color: "#ff5050" }}>{error}</p>}
            {exito && <p style={{ color: "#4CAF50" }}>{exito}</p>}

            <button type="submit" className="boton">
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
