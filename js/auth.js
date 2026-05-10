// ===== AUTENTICACIÓN =====

const CODIGO_ADMIN = 'CINEMA_ADMIN_2024';

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    btn.textContent = visible ? '👁️' : '🙈';
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    errorMsg.textContent = '';

    if (!email || !password) {
        errorMsg.textContent = 'Completa todos los campos';
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'La contraseña debe tener mínimo 6 caracteres';
        return;
    }

    const passwordHash = await hashPassword(password);
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuariosGuardados.find(u => u.email === email && u.passwordHash === passwordHash);

    if (usuario) {
        const { passwordHash: _, ...usuarioSinHash } = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioSinHash));
        window.location.href = 'principal.html';
    } else {
        errorMsg.textContent = 'Email o contraseña incorrectos';
    }
}

async function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const codigoAdmin = document.getElementById('admin-code').value;
    const errorMsg = document.getElementById('error-message');
    const successMsg = document.getElementById('success-message');

    errorMsg.textContent = '';
    successMsg.textContent = '';

    if (!nombre || !email || !password || !confirmPassword) {
        errorMsg.textContent = 'Completa todos los campos';
        return;
    }

    if (nombre.length < 3) {
        errorMsg.textContent = 'El nombre debe tener al menos 3 caracteres';
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'La contraseña debe tener mínimo 6 caracteres';
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = 'Ingresa un email válido';
        return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuariosGuardados.some(u => u.email === email)) {
        errorMsg.textContent = 'Este email ya está registrado';
        return;
    }

    const passwordHash = await hashPassword(password);
    const tipo = codigoAdmin === CODIGO_ADMIN ? 'Admin' : 'Cliente';

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        passwordHash: passwordHash,
        tipo: tipo,
        fechaRegistro: new Date().toLocaleDateString('es-ES')
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

    successMsg.textContent = '✅ Cuenta creada exitosamente. Redirigiendo...';
    setTimeout(() => {
        window.location.href = 'inicio_sesion.html';
    }, 2000);
}

async function cargarUsuariosPrueba() {
    const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuariosExistentes.length === 0) {
        const adminHash = await hashPassword('123456');
        const clienteHash = await hashPassword('123456');
        const usuariosPrueba = [
            {
                id: 1,
                nombre: 'Admin User',
                email: 'admin@cinema.com',
                passwordHash: adminHash,
                tipo: 'Admin',
                fechaRegistro: new Date().toLocaleDateString('es-ES')
            },
            {
                id: 2,
                nombre: 'Cliente Test',
                email: 'cliente@cinema.com',
                passwordHash: clienteHash,
                tipo: 'Cliente',
                fechaRegistro: new Date().toLocaleDateString('es-ES')
            }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
    }
}

window.addEventListener('DOMContentLoaded', cargarUsuariosPrueba);
