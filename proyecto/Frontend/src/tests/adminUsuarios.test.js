describe("Gestión de roles en AdminUsuarios", () => {
  let usuarios = [];

  const cambiarRol = (correo, nuevoRol) => {
    usuarios = usuarios.map(u =>
      u.correo === correo ? { ...u, rol: nuevoRol } : u
    );
  };

  beforeEach(() => {
    usuarios = [
      { nombre: "Ana", correo: "ana@gmail.com", rol: "usuario" },
      { nombre: "Leo", correo: "leo@gmail.com", rol: "admin" }
    ];
  });

  it("debería cambiar el rol de un usuario correctamente", () => {
    cambiarRol("ana@gmail.com", "admin");
    const usuario = usuarios.find(u => u.correo === "ana@gmail.com");
    expect(usuario.rol).toBe("admin");
  });
});
