describe("Productos con stock crítico", () => {
  const productos = [
    { nombre: "Naruto", stock: 2, stockCritico: 3 },
    { nombre: "One Piece", stock: 10, stockCritico: 3 }
  ];

  const filtrarCriticos = () => productos.filter(p => p.stock <= p.stockCritico);

  it("debería encontrar productos con stock bajo", () => {
    expect(filtrarCriticos().length).toBe(1);
  });
});