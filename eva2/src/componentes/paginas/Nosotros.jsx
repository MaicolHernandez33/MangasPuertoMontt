import Titulo from "../atomos/Titulo";

export default function Nosotros() {
  return (
    <section className="nosotros">
      {/* Introducción */}
      <section className="intro">
        <Titulo texto="👥 Sobre Nosotros" />
        <p>
          En <strong>Tienda Mangas PuertoMontt</strong>, somos un equipo apasionado por el mundo
          del manga, los cómics y la cultura otaku. Nacimos con la idea de acercar las mejores
          historias y figuras coleccionables a los fanáticos del sur de Chile.
        </p>
        <p>
          Nuestra misión es ser el punto de encuentro para la comunidad otaku en Puerto Montt, ofreciendo productos
          originales, exclusivos y con mucho cariño para todos los fanáticos.
        </p>
      </section>

      {/* Imagen de la tienda */}
      <section className="imagenes-negocio">
        <h2>Visítanos en Puerto Montt</h2>
        <div className="galeria">
          <figure>
            <img
              src="/img/Tienda1.png"
              alt="Fachada de Tienda Mangas Puerto Montt"
              className="img-tienda"
            />
            <figcaption>Nos ubicamos en Guillermo Gallardo 452, Puerto Montt</figcaption>
          </figure>
        </div>
      </section>

      {/* Valores y lo que ofrecemos */}
      <section className="valores">
        <h2>Lo que ofrecemos</h2>
        <ul>
          <li>📚 Gran variedad de <strong>mangas y cómics</strong> de tus sagas favoritas.</li>
          <li>🎎 Figuras coleccionables exclusivas y oficiales de las mejores marcas.</li>
          <li>🚚 Realizamos envíos a todo Chile, para que recibas tu pedido donde quieras.</li>
        </ul>
      </section>

      {/* Llamada a la acción */}
      <section className="cta">
        <h2>¡Visítanos y descubre más!</h2>
        <p>
          Si te apasionan los mangas y los cómics, no dudes en visitarnos. Estamos ubicados en Puerto Montt, con
          productos nuevos y exclusivos para ti.
        </p>
        <a href="/contacto" className="btn-contacto">
          Contáctanos
        </a>
      </section>
    </section>
  );
}
