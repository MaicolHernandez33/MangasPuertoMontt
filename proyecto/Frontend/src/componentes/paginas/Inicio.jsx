import { useEffect, useState } from "react";
import Titulo from "../atomos/Titulo";
import TarjetaProducto from "../moleculas/TarjetaProducto";

export default function Inicio() {
  const banners = [
    { id: 1, imagen: "/img/fondo10.jpg", texto: "Novedades en Mangas 2025" },
    { id: 2, imagen: "/img/productos/dbzbox.png", texto: "Descuentos especiales en BoxSets" },
    { id: 3, imagen: "/img/productos/imgcarrusel.jpg", texto: "¡Colecciona tus series favoritas!" },
  ];

  const [bannerActual, setBannerActual] = useState(0);
  const [mangas, setMangas] = useState([]);
  const [comics, setComics] = useState([]);

  // Cambio automático de banner
  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  // Cargar productos guardados y separarlos
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];

    // Si los productos tienen campo "tipo", filtramos
    const mangasFiltrados = guardados.filter((p) => p.tipo === "manga");
    const comicsFiltrados = guardados.filter((p) => p.tipo === "comic");

    // Si aún no tienes ese campo, mostramos la mitad arriba y mitad abajo
    if (mangasFiltrados.length === 0 && comicsFiltrados.length === 0) {
      const mitad = Math.ceil(guardados.length / 2);
      setMangas(guardados.slice(0, mitad));
      setComics(guardados.slice(mitad));
    } else {
      setMangas(mangasFiltrados);
      setComics(comicsFiltrados);
    }
  }, []);

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
        <Titulo texto="Mangas Recomendados" />
        {mangas.length > 0 ? (
          <div className="grilla-productos">
            {mangas.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p>No hay mangas recomendados aún.</p>
        )}
      </div>

      {/* === CÓMICS RECOMENDADOS === */}
      <div className="recomendados">
        <Titulo texto="Cómics Recomendados" />
        {comics.length > 0 ? (
          <div className="grilla-productos">
            {comics.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <p>No hay cómics recomendados aún.</p>
        )}
      </div>
    </section>
  );
}
