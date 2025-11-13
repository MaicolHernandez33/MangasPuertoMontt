describe("Historial de compras vacío", () => {
  const obtenerHistorial = (correo) => JSON.parse(localStorage.getItem(`compras_${correo}`)) || [];

  beforeEach(() => localStorage.clear());

  it("debería devolver un arreglo vacío si no hay compras", () => {
    expect(obtenerHistorial("usuario@correo.com").length).toBe(0);
  });
});
