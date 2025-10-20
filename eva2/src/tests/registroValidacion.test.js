describe("Validación de Registro de Usuario", () => {
  function validarUsuario(nombre, correo, password, confirmar) {
    if (!nombre || !correo || !password || !confirmar) return "Campos incompletos";
    if (password !== confirmar) return "Contraseñas no coinciden";
    if (!correo.endsWith("@gmail.com") && !correo.endsWith("@duocuc.cl")) return "Correo inválido";
    return "OK";
  }

  it("debería rechazar cuando faltan campos", () => {
    const resultado = validarUsuario("", "test@gmail.com", "123", "123");
    expect(resultado).toBe("Campos incompletos");
  });

  it("debería rechazar cuando las contraseñas no coinciden", () => {
    const resultado = validarUsuario("Maicol", "test@gmail.com", "123", "456");
    expect(resultado).toBe("Contraseñas no coinciden");
  });

  it("debería aceptar un usuario válido", () => {
    const resultado = validarUsuario("Maicol", "maicol@gmail.com", "123", "123");
    expect(resultado).toBe("OK");
  });
});
