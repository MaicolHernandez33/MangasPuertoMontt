document.addEventListener('DOMContentLoaded', () => {
  const filtro = document.getElementById('filtro');
  const productos = document.querySelectorAll('.producto');

  filtro.addEventListener('change', () => {
    const value = filtro.value;
    productos.forEach(prod => {
      if (value === "todos" || prod.dataset.categoria === value) {
        prod.style.display = "block";
      } else {
        prod.style.display = "none";
      }
    });
  });
});

// Añadir al carrito 
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  const nombre = btn.dataset.nombre;
  const precio = parseInt(btn.dataset.precio, 10) || 0;

  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const idx = carrito.findIndex(i => i.nombre === nombre);

  if (idx >= 0) carrito[idx].cantidad += 1;
  else carrito.push({ nombre, precio, cantidad: 1 });

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`🛒 "${nombre}" agregado al carrito.`);
});
