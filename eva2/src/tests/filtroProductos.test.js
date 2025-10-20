describe("Filtro de productos por categoría", () => {
  const productos = [
    { nombre: "Naruto", tipo: "manga" },
    { nombre: "Spiderman", tipo: "comic" }
  ];

  const filtrar = (tipo) => productos.filter(p => tipo === "todos" || p.tipo === tipo);

  it("debería mostrar todos los productos", () => {
    expect(filtrar("todos").length).toBe(2);
  });

  it("debería filtrar solo los mangas", () => {
    expect(filtrar("manga")[0].nombre).toBe("Naruto");
  });
});
