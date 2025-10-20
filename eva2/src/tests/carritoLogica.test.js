describe("Lógica del Carrito de Compras", () => {
  let carrito = [];

  const agregarProducto = (producto) => {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
  };

  beforeEach(() => {
    carrito = [];
  });

  it("debería agregar un nuevo producto o aumentar cantidad si ya existe", () => {
    agregarProducto({ id: 1, nombre: "Manga A", precio: 5000 });
    agregarProducto({ id: 1, nombre: "Manga A", precio: 5000 });
    expect(carrito[0].cantidad).toBe(2);
  });
});
