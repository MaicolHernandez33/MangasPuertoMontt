
describe("Validación de Login", () => {
  function login(correo, password) {
    const usuarios = [{ correo: "admin@tienda.cl", password: "admin123" }];
    const encontrado = usuarios.find(u => u.correo === correo && u.password === password);
    return encontrado ? "Acceso permitido" : "Acceso denegado";
  }

  it("debería permitir acceso con credenciales válidas", () => {
    expect(login("admin@tienda.cl", "admin123")).toBe("Acceso permitido");
  });

  it("debería denegar acceso con credenciales inválidas", () => {
    expect(login("admin@tienda.cl", "xxx")).toBe("Acceso denegado");
  });
});
