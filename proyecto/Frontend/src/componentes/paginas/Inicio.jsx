import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import TarjetaProducto from "../Moleculas/TarjetaProducto";

export default function Inicio() {
  const banners = [
    { id: 1, imagen: "/img/fondo10.jpg", texto: "Novedades en Mangas 2025" },
    { id: 2, imagen: "/img/productos/dbzbox.png", texto: "Descuentos especiales en BoxSets" },
    { id: 3, imagen: "/img/productos/imgcarrusel.jpg", texto: "¡Colecciona tus series favoritas!" },
  ];

  const [bannerActual, setBannerActual] = useState(0);
  const [mangas, setMangas] = useState([]);
  const [comics, setComics] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cambio automático de banner
  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  //  Cargar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        if (response.ok) {
          const data = await response.json();
          const todosProductos = data.productos || [];
          
          // Separar por categoría (usando la categoría de la BD)
          const mangasFiltrados = todosProductos.filter((p) => 
            p.categoria === "Shonen" || p.categoria === "Shojo" || p.categoria === "Seinen"
          );
          const comicsFiltrados = todosProductos.filter((p) => 
            p.categoria === "Acción" || p.categoria === "Aventura" || p.categoria === "Comedia" || p.categoria === "Drama"
          );

          // Si no hay suficientes por categoría, dividir aleatoriamente
          if (mangasFiltrados.length === 0 && comicsFiltrados.length === 0) {
            const mitad = Math.ceil(todosProductos.length / 2);
            setMangas(todosProductos.slice(0, mitad));
            setComics(todosProductos.slice(mitad));
          } else {
            setMangas(mangasFiltrados.slice(0, 4)); // Mostrar máximo 4 mangas
            setComics(comicsFiltrados.slice(0, 4)); // Mostrar máximo 4 cómics
          }
        }
      } catch (error) {
        console.error("Error cargando productos para inicio:", error);
        setMangas([]);
        setComics([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  if (cargando) {
    return (
      <section className="inicio">
        <div className="hero-bienvenida">
          <h1>Bienvenido a Tienda Mangas PuertoMontt</h1>
          <p>Cargando productos destacados...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="inicio">
      {/* === BIENVENIDA === */}
      <div className="hero-bienvenida">
        <h1>Bienvenido a Tienda Mangas PuertoMontt</h1>
        <p>
          Tu lugar favorito para encontrar <b>mangas, cómics, figuras</b> y mucho más.  
          Disfruta nuestras novedades y colecciones exclusivas del 2025.
        </p>
      </div>

      {/* === CARRUSEL === */}
      <div className="banner-container">
        <img
          src={banners[bannerActual].imagen}
          alt="banner principal"
          className="banner-imagen"
        />
        <div className="banner-texto">
          <h2>{banners[bannerActual].texto}</h2>
        </div>
        <button
          className="banner-btn izq"
          onClick={() =>
            setBannerActual((prev) => (prev - 1 + banners.length) % banners.length)
          }
        >
          ❮
        </button>
        <button
          className="banner-btn der"
          onClick={() => setBannerActual((prev) => (prev + 1) % banners.length)}
        >
          ❯
        </button>
      </div>

      {/* === MANGAS RECOMENDADOS === */}
      <div className="recomendados">
        <Titulo texto="📚 Mangas Recomendados" />
        {mangas.length > 0 ? (
          <div className="grilla-productos">
            {mangas.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p>No hay mangas recomendados disponibles.</p>
        )}
      </div>

      {/* === CÓMICS RECOMENDADOS === */}
      <div className="recomendados">
        <Titulo texto="🎭 Cómics Recomendados" />
        {comics.length > 0 ? (
          <div className="grilla-productos">
            {comics.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p>No hay cómics recomendados disponibles.</p>
        )}
      </div>

 
      <div className="cta-final">
        <Titulo texto="¡Explora nuestro catálogo completo!" />
        <p>Descubre todos nuestros productos, ofertas especiales y nuevas llegadas.</p>

      </div>
    </section>
  );
}