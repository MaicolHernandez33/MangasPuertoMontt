describe("Vaciar carrito", () => {
  let carrito = [
    { id: 1, nombre: "Manga A" },
    { id: 2, nombre: "Cómic B" }
  ];

  const vaciarCarrito = () => (carrito = []);

  it("debería dejar el carrito vacío", () => {
    vaciarCarrito();
    expect(carrito.length).toBe(0);
  });
});
