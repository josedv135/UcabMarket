/**
 * Gestión de autenticación de clientes para UcabMarket
 * Restringido a correos institucionales @ucab.edu.ve
 */
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');
  const alertBox = document.getElementById('authAlert');
  const sessionBanner = document.getElementById('sessionBanner');
  const sessionUserName = document.getElementById('sessionUserName');
  const btnLogoutBanner = document.getElementById('btnLogoutBanner');

  // Si ya hay sesión activa, mostrar banner informativo
  const currentUser = api.getCurrentUser();
  const currentToken = api.getToken();
  if (currentUser && currentToken && sessionBanner && sessionUserName) {
    sessionUserName.textContent = currentUser.nombreCompleto || currentUser.email;
    sessionBanner.classList.remove('d-none');
    sessionBanner.classList.add('d-flex');

    if (btnLogoutBanner) {
      btnLogoutBanner.addEventListener('click', () => {
        api.clearSession();
        sessionBanner.classList.add('d-none');
        sessionBanner.classList.remove('d-flex');
        mostrarAlerta('Sesión cerrada correctamente', 'info');
      });
    }
  }

  function mostrarAlerta(mensaje, tipo = 'danger') {
    if (alertBox) {
      alertBox.className = `alert alert-${tipo} small py-2 mb-3`;
      alertBox.innerHTML = mensaje;
      alertBox.classList.remove('d-none');
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(mensaje);
    }
  }

  function ocultarAlerta() {
    if (alertBox) {
      alertBox.classList.add('d-none');
    }
  }

  // --- Manejo de Inicio de Sesión ---
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      ocultarAlerta();

      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const btnSubmit = document.getElementById('btnLoginSubmit');

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;

      const esDominioUcab = email.endsWith('@ucab.edu.ve') || email.endsWith('.ucab.edu.ve');
      if (!esDominioUcab) {
        mostrarAlerta('Solo se permite el acceso con correos institucionales de la UCAB (<strong>@ucab.edu.ve</strong> o <strong>@est.ucab.edu.ve</strong>)', 'warning');
        return;
      }

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...';
        }

        const res = await api.post('/auth/login', { email, password });
        api.setSession(res.token, res.user);

        mostrarAlerta('¡Bienvenido de nuevo! Redirigiendo...', 'success');
        setTimeout(() => {
          window.location.href = 'catalog.html';
        }, 600);
      } catch (err) {
        mostrarAlerta('Error al iniciar sesión: ' + err.message, 'danger');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Ingresar al Marketplace';
        }
      }
    });
  }

  // --- Manejo de Creación de Cuenta (Registro) ---
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      ocultarAlerta();

      const nombreCompleto = document.getElementById('regNombre').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const carrera = document.getElementById('regCarrera').value.trim();
      const telefonoInput = document.getElementById('regTelefono');
      const telefono = telefonoInput ? telefonoInput.value.trim() : '';
      const password = document.getElementById('regPassword').value;
      const passwordConfirm = document.getElementById('regPasswordConfirm').value;
      const btnSubmit = document.getElementById('btnRegSubmit');

      // Validaciones del lado del cliente
      if (!nombreCompleto) {
        mostrarAlerta('Por favor, ingresa tu nombre completo', 'warning');
        return;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombreCompleto)) {
        mostrarAlerta('El nombre completo no debe contener números ni caracteres especiales', 'warning');
        return;
      }

      const esDominioUcab = email.endsWith('@ucab.edu.ve') || email.endsWith('.ucab.edu.ve');
      if (!esDominioUcab) {
        mostrarAlerta('Registro restringido: El correo debe pertenecer al dominio institucional de la UCAB (<strong>@ucab.edu.ve</strong> o <strong>@est.ucab.edu.ve</strong>)', 'warning');
        return;
      }

      if (!carrera) {
        mostrarAlerta('Por favor, indica tu carrera', 'warning');
        return;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(carrera)) {
        mostrarAlerta('La carrera no debe contener números ni caracteres especiales', 'warning');
        return;
      }

      if (telefono && !/^\d{11}$/.test(telefono)) {
        mostrarAlerta('El número telefónico debe tener exactamente 11 dígitos numéricos (ej. 04141234567)', 'warning');
        return;
      }

      if (password.length < 6) {
        mostrarAlerta('La contraseña debe tener un mínimo de 6 caracteres', 'warning');
        return;
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        mostrarAlerta('La contraseña debe incluir tanto letras como números', 'warning');
        return;
      }

      if (password !== passwordConfirm) {
        mostrarAlerta('Las contraseñas no coinciden. Por favor, verifícalas.', 'warning');
        return;
      }

      const payload = {
        nombreCompleto,
        email,
        carrera,
        password,
      };
      if (telefono) {
        payload.telefono = telefono;
      }

      try {
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creando cuenta...';
        }

        // Registrar usuario en el backend
        await api.post('/users/register', payload);

        // Iniciar sesión automáticamente para mejor experiencia de usuario
        try {
          const loginRes = await api.post('/auth/login', { email, password });
          api.setSession(loginRes.token, loginRes.user);

          mostrarAlerta('¡Cuenta creada con éxito! Bienvenido a UcabMarket. Redirigiendo...', 'success');
          setTimeout(() => {
            window.location.href = 'catalog.html';
          }, 800);
          return;
        } catch (_) {
          // Si el auto-login falla por alguna razón, cambiar a la pestaña de login
        }

        mostrarAlerta('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');
        const loginTabBtn = document.getElementById('tab-login-btn');
        if (loginTabBtn) {
          const tab = new bootstrap.Tab(loginTabBtn);
          tab.show();
          const loginEmail = document.getElementById('loginEmail');
          if (loginEmail) loginEmail.value = email;
          const loginPass = document.getElementById('loginPassword');
          if (loginPass) loginPass.focus();
        }
      } catch (err) {
        mostrarAlerta('Error al registrar cuenta: ' + err.message, 'danger');
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="bi bi-person-check-fill me-1"></i> Registrar Cuenta';
        }
      }
    });
  }
});
