/**
 * Gestión de autenticación de clientes para UcabMarket
 * Restringido a correos institucionales @ucab.edu.ve
 */
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email.endsWith('@ucab.edu.ve')) {
        alert('Solo se permite acceso con correos institucionales @ucab.edu.ve');
        return;
      }

      try {
        const res = await api.post('/auth/login', { email, password });
        api.setSession(res.token, res.user);
        window.location.href = 'catalog.html';
      } catch (err) {
        alert('Error al iniciar sesión: ' + err.message);
      }
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombreCompleto = document.getElementById('regNombre').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const carrera = document.getElementById('regCarrera').value.trim();
      const password = document.getElementById('regPassword').value;

      if (!email.endsWith('@ucab.edu.ve')) {
        alert('El correo debe terminar en @ucab.edu.ve');
        return;
      }

      try {
        await api.post('/users/register', { nombreCompleto, email, carrera, password });
        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        window.location.reload();
      } catch (err) {
        alert('Error al registrar cuenta: ' + err.message);
      }
    });
  }
});
