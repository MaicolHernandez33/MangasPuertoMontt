describe("Cálculo de total de ventas", () => {
  const pedidos = [
    { total: 5000 },
    { total: 8000 },
    { total: 2000 }
  ];

  const calcularTotal = () => pedidos.reduce((acc, p) => acc + p.total, 0);

  it("debería sumar correctamente las ventas", () => {
    expect(calcularTotal()).toBe(15000);
  });
});