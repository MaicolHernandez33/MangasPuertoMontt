document.addEventListener('DOMContentLoaded', () => {
  const formRegistro = document.querySelector('#form-registro');

  if (formRegistro) {
    const nombre = formRegistro.querySelector('#nombre');
    const email = formRegistro.querySelector('#email');
    const pass = formRegistro.querySelector('#password');
    const pass2 = formRegistro.querySelector('#password2');

    // Mostrar error
    function setError(input, message) {
      let error = input.parentElement.querySelector('.error');
      if (!error) {
        error = document.createElement('div');
        error.className = 'error';
        input.parentElement.appendChild(error);
      }
      error.textContent = message;
    }

    // Limpiar error
    function clearError(input) {
      const error = input.parentElement.querySelector('.error');
      if (error) error.textContent = '';
    }

    // Validar dominio
    function dominioValido(correo) {
      const dominios = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
      const partes = correo.split('@');
      if (partes.length !== 2) return false;
      return dominios.includes(partes[1].toLowerCase());
    }

    formRegistro.addEventListener('submit', (e) => {
      let valido = true;

      // Nombre
      if (nombre.value.trim() === '') {
        setError(nombre, 'El nombre es obligatorio');
        valido = false;
      } else {
        clearError(nombre);
      }

      // Email
      if (email.value.trim() === '') {
        setError(email, 'El correo es obligatorio');
        valido = false;
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        setError(email, 'Formato de correo no válido');
        valido = false;
      } else if (!dominioValido(email.value.trim())) {
        setError(email, 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        valido = false;
      } else {
        clearError(email);
      }

      // Password
      if (pass.value.length < 4 || pass.value.length > 10) {
        setError(pass, 'La contraseña debe tener entre 4 y 10 caracteres');
        valido = false;
      } else {
        clearError(pass);
      }

      // Confirmación
      if (pass2.value !== pass.value) {
        setError(pass2, 'Las contraseñas no coinciden');
        valido = false;
      } else {
        clearError(pass2);
      }

      if (!valido) {
        e.preventDefault(); // No se envía si hay errores
      } else {
        alert('Registro completado con éxito (simulado)');
      }
    });
  }
});

// VALIDACIÓN CONTACTO 
document.addEventListener('DOMContentLoaded', () => {
  const formContacto = document.querySelector('#form-contacto');

  if (formContacto) {
    const nombre = formContacto.querySelector('#nombre');
    const correo = formContacto.querySelector('#correo');
    const mensaje = formContacto.querySelector('#mensaje');

    const setError = (input, msg) => {
      let error = input.parentElement.querySelector('.error');
      if (!error) {
        error = document.createElement('div');
        error.className = 'error';
        input.parentElement.appendChild(error);
      }
      error.textContent = msg;
    };

    const clearError = (input) => {
      const error = input.parentElement.querySelector('.error');
      if (error) error.textContent = '';
    };

    const dominioValido = (mail) => {
      const dominios = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
      const partes = mail.split('@');
      return partes.length === 2 && dominios.includes(partes[1].toLowerCase());
    };

    formContacto.addEventListener('submit', (e) => {
      let ok = true;

      // Nombre
      if (!nombre.value.trim()) {
        setError(nombre, 'El nombre es obligatorio');
        ok = false;
      } else if (nombre.value.trim().length > 100) {
        setError(nombre, 'El nombre no puede superar 100 caracteres');
        ok = false;
      } else {
        clearError(nombre);
      }

      // Correo
      if (!correo.value.trim()) {
        setError(correo, 'El correo es obligatorio');
        ok = false;
      } else if (!/\S+@\S+\.\S+/.test(correo.value)) {
        setError(correo, 'Formato de correo no válido');
        ok = false;
      } else if (!dominioValido(correo.value.trim())) {
        setError(correo, 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
        ok = false;
      } else if (correo.value.length > 100) {
        setError(correo, 'El correo no puede superar 100 caracteres');
        ok = false;
      } else {
        clearError(correo);
      }

      // Mensaje
      if (!mensaje.value.trim()) {
        setError(mensaje, 'El mensaje es obligatorio');
        ok = false;
      } else if (mensaje.value.trim().length > 500) {
        setError(mensaje, 'El mensaje no puede superar 500 caracteres');
        ok = false;
      } else {
        clearError(mensaje);
      }

      if (!ok) {
        e.preventDefault();
      } else {
        e.preventDefault(); 
        alert(' Mensaje enviado con éxito (simulado)');
        formContacto.reset();
      }
    });
  }
});

