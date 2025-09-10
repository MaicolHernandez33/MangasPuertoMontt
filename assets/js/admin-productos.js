
(() => {
  const $ = (s) => document.querySelector(s);
  const form = $('#form-producto');
  const tbody = $('#productosBody');

  const money = (n) =>
    Number(n || 0).toLocaleString('es-CL', { minimumFractionDigits: 0 });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const codigo = $('#codigo').value.trim();
    const nombre = $('#nombre').value.trim();
    const precio = $('#precio').value.trim();
    const stock  = $('#stock').value.trim();

    if (!codigo || !nombre || !precio || !stock) {
      alert('Completa todos los campos del producto.');
      return;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${codigo}</td>
      <td>${nombre}</td>
      <td>$${money(precio)}</td>
      <td>${stock}</td>
      <td>
        <button class="btn btn-primary btn-edit" disabled>Editar</button>
        <button class="btn btn-danger btn-del">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);

    form.reset();
  });

  // Eliminar fila (solo visual)
  document.addEventListener('click', (e) => {
    const del = e.target.closest('.btn-del');
    if (!del) return;
    if (!confirm('¿Eliminar este producto de la lista?')) return;
    del.closest('tr')?.remove();
  });
})();
