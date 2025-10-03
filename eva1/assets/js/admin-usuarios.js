
(() => {
  const KEY = 'usuarios';

  const $ = (sel) => document.querySelector(sel);
  const getUsers = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const setUsers = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  const form = $('#form-usuario');
  const tbody = $('#usuariosBody');

  function render() {
    const usuarios = getUsers();
    tbody.innerHTML = '';

    if (usuarios.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="5">No hay usuarios registrados.</td>`;
      tbody.appendChild(tr);
      return;
    }

    usuarios.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.rut}</td>
        <td>${u.nombre}</td>
        <td>${u.apellido}</td>
        <td>${u.correo}</td>
        <td>
          <button class="btn btn-danger btn-del" data-rut="${u.rut}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function addUser(u) {
    const usuarios = getUsers();

    // evitar duplicados por RUT
    if (usuarios.some(x => x.rut.toLowerCase() === u.rut.toLowerCase())) {
      alert('⚠️ Ya existe un usuario con ese RUT.');
      return false;
    }

    usuarios.push(u);
    setUsers(usuarios);
    return true;
  }

 
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const rut = $('#rut').value.trim();
    const nombre = $('#nombre').value.trim();
    const apellido = $('#apellido').value.trim();
    const correo = $('#correo').value.trim();

    if (!rut || !nombre || !apellido || !correo) {
      alert('Completa todos los campos.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(correo)) {
      alert('Correo no válido.');
      return;
    }

    const ok = addUser({ rut, nombre, apellido, correo });
    if (ok) {
      form.reset();
      render();
      alert(' Usuario agregado.');
    }
  });

  // eliminar usuario
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-del');
    if (!btn) return;

    const rut = btn.dataset.rut;
    if (!confirm(`¿Eliminar usuario ${rut}?`)) return;

    const usuarios = getUsers().filter(u => u.rut.toLowerCase() !== rut.toLowerCase());
    setUsers(usuarios);
    render();
  });

  // inicial
  document.addEventListener('DOMContentLoaded', render);
})();
