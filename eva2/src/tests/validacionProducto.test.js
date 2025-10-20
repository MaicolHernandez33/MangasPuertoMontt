describe("Validación de productos", () => {
  function validarProducto({ nombre, precio, stock }) {
    if (!nombre || precio <= 0 || stock < 0) return false;
    return true;
  }

  it("debería rechazar un producto con precio negativo", () => {
    expect(validarProducto({ nombre: "Manga", precio: -10, stock: 5 })).toBeFalse();
  });

  it("debería aceptar un producto válido", () => {
    expect(validarProducto({ nombre: "Cómic", precio: 5000, stock: 10 })).toBeTrue();
  });
});
