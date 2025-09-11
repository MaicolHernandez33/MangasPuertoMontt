// Carrito 
(function () {
  const KEY = 'carrito';

  const get = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const set = (data) => localStorage.setItem(KEY, JSON.stringify(data));

  // Agregar desde catálogo o detalle 
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;

    const nombre = btn.dataset.nombre || 'Producto';
    const precio = parseInt(btn.dataset.precio || '0', 10);

    let cart = get();
    const i = cart.findIndex(p => p.nombre === nombre);
    if (i >= 0) cart[i].cantidad += 1;
    else cart.push({ nombre, precio, cantidad: 1 });

    set(cart);
    alert(`🛒 "${nombre}" agregado al carrito.`);
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tabla-carrito tbody');
    const totalEl = document.getElementById('total');
    const btnCheckout = document.getElementById('btn-checkout');

    
    if (!tbody || !totalEl || !btnCheckout) return;

    const money = (n) => n.toLocaleString();

    function render() {
      const cart = get();
      tbody.innerHTML = '';
      let total = 0;

      if (cart.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align:center">Tu carrito está vacío. Agrega productos.</td>`;
        tbody.appendChild(tr);
        totalEl.textContent = '0';
        return;
      }

      cart.forEach((item, idx) => {
        const sub = item.precio * item.cantidad;
        total += sub;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>$${money(item.precio)}</td>
          <td>${item.cantidad}</td>
          <td>$${money(sub)}</td>
          <td><button class="btn-eliminar" data-i="${idx}">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });

      totalEl.textContent = money(total);
    }

    // Eliminar ítem 
    document.addEventListener('click', (e) => {
      const del = e.target.closest('.btn-eliminar');
      if (!del) return;

      const i = parseInt(del.dataset.i, 10);
      const cart = get();
      cart.splice(i, 1);
      set(cart);
      render();
    });

    // Pagar 
    btnCheckout.addEventListener('click', () => {
      const cart = get();
      if (cart.length === 0) {
        alert(' Tu carrito está vacío. Agrega productos.');
        return;
      }
      alert(' Pago realizado con éxito. ¡Gracias por tu compra!');
      set([]);
      render();
    });

    render();
  });
})();
