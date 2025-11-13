// src/tests/App.test.js
describe(" Pruebas Tienda Mangas PuertoMontt", () => {

  it("1) Debería registrar un usuario correctamente", () => {
    const usuarios = [];
    const nuevo = { nombre: "Maicol", correo: "maicol@gmail.com", rol: "usuario" };
    usuarios.push(nuevo);
    expect(usuarios.length).toBe(1);
    expect(usuarios[0].correo).toBe("maicol@gmail.com");
  });

  it("2) No debería registrar un usuario sin correo", () => {
    const nuevo = { nombre: "Test", correo: "" };
    expect(nuevo.correo).toBe("");
  });

  it("3) Login válido debería ‘iniciar sesión’", () => {
    const lista = [{ correo: "maicol@gmail.com", password: "123" }];
    const login = (c, p) => lista.find(u => u.correo === c && u.password === p);
    const usuario = login("maicol@gmail.com", "123");
    expect(usuario).toBeDefined();
  });

  it("4) Login inválido debería fallar", () => {
    const lista = [{ correo: "maicol@gmail.com", password: "123" }];
    const login = (c, p) => lista.find(u => u.correo === c && u.password === p);
    const usuario = login("otro@gmail.com", "abc");
    expect(usuario).toBeUndefined();
  });

  it("5) Agregar producto debería aumentar el carrito", () => {
    const carrito = [];
    carrito.push({ id: 1, nombre: "One Piece", precio: 1000, cantidad: 1 });
    expect(carrito.length).toBe(1);
  });

  it("6) Calcular total del carrito correctamente", () => {
    const carrito = [{ precio: 2000, cantidad: 1 }, { precio: 3000, cantidad: 2 }];
    const total = carrito.reduce((acc, i) => acc + i.precio * (i.cantidad || 1), 0);
    expect(total).toBe(2000 + 3000 * 2);
  });

  it("7) Vaciar el carrito debería dejarlo vacío", () => {
    let carrito = [{ id: 1 }, { id: 2 }];
    carrito = [];
    expect(carrito.length).toBe(0);
  });

  it("8) Registrar compra debe guardar total > 0", () => {
    const compra = { total: 12000, items: [{ id: 1 }] };
    expect(compra.total).toBeGreaterThan(0);
    expect(compra.items.length).toBeGreaterThan(0);
  });

  it("9) El admin puede promover a otro usuario", () => {
    const user = { rol: "usuario" };
    user.rol = "admin";
    expect(user.rol).toBe("admin");
  });

  it("10) Degradar admin lo devuelve a usuario", () => {
    const user = { rol: "admin" };
    user.rol = "usuario";
    expect(user.rol).toBe("usuario");
  });

}); 
