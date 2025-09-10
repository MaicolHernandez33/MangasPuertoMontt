document.querySelector("#btn-checkout").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("⚠️ Tu carrito está vacío.");
    return;
  }

  // Mensaje de compra exitosa
  alert("✅ ¡Gracias por tu compra en Tienda Mangas PuertoMontt!\n\nTu pedido ha sido registrado con éxito.");

  // Vaciar carrito
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
});
