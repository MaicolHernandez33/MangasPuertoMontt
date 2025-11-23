import React from "react";
import CampoTexto from "../atomos/CampoTexto";
import Boton from "../atomos/Boton";
import Titulo from "../atomos/Titulo";

export default function FormularioBase({
  tipo,
  onSubmit,
  campos,
  titulo,
  botonTexto,
  children,
}) {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <header className="auth-head">
          <img src="/img/LogoTienda.png" alt="Logo Tienda" />
          <Titulo texto={titulo} />
        </header>

        <div className="auth-body">
          <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
          > 
            {campos.map((campo, index) => (
              <CampoTexto
                key={index}
                tipo={campo.tipo}
                placeholder={campo.placeholder}
                valor={campo.valor}
                onChange={campo.onChange}
                requerido={campo.requerido}
              />
            ))}
            <button type="submit" className="boton">
              {botonTexto}
            </button>
          </form>

          {children}
        </div>
      </section>
    </main>
  );
}
