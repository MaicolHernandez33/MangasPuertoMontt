import Titulo from "../atomos/Titulo";

export default function Novedades() {
  const novedades = [
    {
      id: 1,
      titulo: "Nueva edición de One Piece",
      descripcion: "La esperada edición especial del manga de One Piece ya está disponible en nuestra tienda.",
      imagen: "/img/productos/onepiece3x1.jpg",
      enlace: "/detalle/onepiece"
    },
    {
      id: 2,
      titulo: "DC Comics: Ediciones exclusivas",
      descripcion: "Revisa las últimas novedades de Batman y Superman que llegaron directo desde Estados Unidos.",
      imagen: "/img/productos/comics.jpg",
      enlace: "/detalle/dccomics"
    },
    {
      id: 3,
      titulo: "Top 5 mangas recomendados del mes",
      descripcion: "Nuestra selección especial de títulos que no te puedes perder si eres fanático del manga.",
      imagen: "/img/productos/top5.jpg",
      enlace: "/detalle/top5mangas"
    },
    {
      id: 4,
      titulo: "Berserk Maximum: ¡Nuevo tomo disponible!",
      descripcion: "Llega a Puerto Montt el esperado tomo de Berserk Maximum, con una edición de lujo y páginas ampliadas.",
      imagen: "/img/productos/Maximumberserk.webp",
      enlace: "/detalle/berserkmaximum"
    },
  ];

  return (
    <section className="novedades">
      <Titulo texto=" Novedades" />
      <p className="intro">
        ¡Mantente al día con las últimas novedades del mundo del manga! Aquí publicaremos los nuevos lanzamientos, reediciones y promociones exclusivas.
      </p>

      <div className="novedades-grid">
        {novedades.map((novedad) => (
          <div key={novedad.id} className="novedad-card">
            <img src={novedad.imagen} alt={novedad.titulo} />
            <div className="novedad-content">
              <h3>{novedad.titulo}</h3>
              <p>{novedad.descripcion}</p>
              <a href={novedad.enlace} className="btn-leer-mas">Leer más</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
