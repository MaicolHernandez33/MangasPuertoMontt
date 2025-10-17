import React from 'react';
import CampoTexto from '../atomos/CampoTexto';  // Asegúrate de importar el componente de campo de texto
import Boton from '../atomos/Boton';  // Asegúrate de importar el botón

export default function FormularioBase({ tipo, onSubmit, campos, titulo, botonTexto }) {
  return (
    <section className="auth-wrap">
      <div className="auth-card">
        {/* Título del formulario */}
        <header className="auth-head">
          <h2>{titulo}</h2>
        </header>

        {/* Cuerpo del formulario */}
        <form onSubmit={onSubmit} id={tipo}>
          {campos.map((campo, index) => (
            <div className="form-control" key={index}>
              <CampoTexto
                tipo={campo.tipo}
                placeholder={campo.placeholder}
                valor={campo.valor}
                onChange={campo.onChange}
                maxlength={campo.maxlength}
                requerido={campo.requerido}
              />
            </div>
          ))}

          {/* Botón de submit */}
          <Boton texto={botonTexto} />
        </form>
      </div>
    </section>
  );
}
