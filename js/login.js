import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

// ─── Referencias DOM ────────────────────────────────
const form       = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passInput  = document.getElementById("password");
const btnLogin   = document.getElementById("btnLogin");
const togglePass = document.getElementById("togglePass");
const mensaje    = document.getElementById("mensaje");
const forgotPass = document.getElementById("forgotPass");

// ─── 🔥 REDIRECCIÓN AUTOMÁTICA SI YA HAY SESIÓN ─────
// Esto es lo que hace que al volver a entrar NO te pida login.
// Firebase lee la sesión guardada localmente y si existe, te manda directo.
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.replace("main.html");
    }
});

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

// ─── Traducción de errores ──────────────────────────
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
        // La persistencia ya está garantizada globalmente
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged hará la redirección automáticamente
    } catch (error) {
        console.error("Error login:", error.code);
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
        showMensaje(traducirError(error.code));
    }
});

// ─── Limpiar mensaje al escribir ────────────────────
[emailInput, passInput].forEach(el => {
    el.addEventListener("input", clearMensaje);
});