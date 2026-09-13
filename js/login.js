import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// ─── Inicializar Firebase ───────────────────────────
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ─── Referencias DOM ────────────────────────────────
const form       = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passInput  = document.getElementById("password");
const remember   = document.getElementById("remember");
const btnLogin   = document.getElementById("btnLogin");
const togglePass = document.getElementById("togglePass");
const mensaje    = document.getElementById("mensaje");
const forgotPass = document.getElementById("forgotPass");

// ─── Mostrar / ocultar contraseña ───────────────────
togglePass.addEventListener("click", () => {
    const revealed = passInput.type === "text";
    passInput.type = revealed ? "password" : "text";
    togglePass.classList.toggle("revealed", !revealed);
});

// ─── Helpers de UI ──────────────────────────────────
const showMensaje = (texto, tipo = "error") => {
    mensaje.textContent = texto;
    mensaje.className = "mensaje visible " + tipo;
};

const clearMensaje = () => {
    mensaje.className = "mensaje";
    mensaje.textContent = "";
};

const setLoading = (loading) => {
    btnLogin.classList.toggle("loading", loading);
    btnLogin.disabled = loading;
};

// ─── Traducción de errores Firebase ─────────────────
const traducirError = (code) => {
    const errores = {
        "auth/invalid-email":          "El correo electrónico no es válido.",
        "auth/user-disabled":          "Esta cuenta ha sido deshabilitada.",
        "auth/user-not-found":         "No existe una cuenta con ese correo.",
        "auth/wrong-password":         "Contraseña incorrecta.",
        "auth/invalid-credential":     "Correo o contraseña incorrectos.",
        "auth/too-many-requests":      "Demasiados intentos. Intenta más tarde.",
        "auth/network-request-failed": "Sin conexión. Verifica tu red.",
        "auth/missing-password":       "Ingresa tu contraseña.",
    };
    return errores[code] || "Error al iniciar sesión. Intenta de nuevo.";
};

// ─── Envío del formulario ───────────────────────────
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMensaje();

    const email    = emailInput.value.trim();
    const password = passInput.value;

    // Validación mínima del lado cliente
    if (!email || !password) {
        showMensaje("Por favor completa todos los campos.");
        return;
    }
    if (password.length < 6) {
        showMensaje("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    setLoading(true);

    try {
        // Persistencia según "Recordarme"
        await setPersistence(
            auth,
            remember.checked ? browserLocalPersistence : browserSessionPersistence
        );

        // Autenticación
        await signInWithEmailAndPassword(auth, email, password);

        // Éxito
        showMensaje("Acceso concedido. Redirigiendo...", "exito");

        setTimeout(() => {
            window.location.href = "main.html";
        }, 700);

    } catch (error) {
        console.error("Error login:", error.code, error.message);
        showMensaje(traducirError(error.code));
        setLoading(false);
    }
});

// ─── Recuperar contraseña ───────────────────────────
forgotPass.addEventListener("click", async (e) => {
    e.preventDefault();
    clearMensaje();

    const email = emailInput.value.trim();
    if (!email) {
        showMensaje("Escribe tu correo arriba y luego presiona '¿Olvidaste tu contraseña?'.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showMensaje("Te enviamos un enlace de recuperación a tu correo.", "exito");
    } catch (error) {
        console.error("Error reset:", error.code);
        showMensaje(traducirError(error.code));
    }
});

// ─── Limpiar mensaje al escribir ────────────────────
[emailInput, passInput].forEach(el => {
    el.addEventListener("input", clearMensaje);
});