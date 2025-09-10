// Manejo de navegación del menú lateral
const links = document.querySelectorAll(".sidebar a");
const contenido = document.getElementById("contenido");

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Quitar 'active' de todos
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Cambiar contenido según sección
    const section = link.dataset.section;
    if (section === "productos") {
      contenido.innerHTML = "<h2>Gestión de Productos</h2><p>Aquí podrás administrar mangas y cómics.</p>";
    } else if (section === "usuarios") {
      contenido.innerHTML = "<h2>Gestión de Usuarios</h2><p>Aquí podrás administrar usuarios registrados.</p>";
    }
  });
});
