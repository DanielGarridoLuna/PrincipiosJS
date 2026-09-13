import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ─── Ocultar el body hasta validar sesión ───────────
document.body.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // No logueado → fuera
        window.location.replace("index.html");
        return;
    }

    // Logueado → mostramos el contenido
    document.body.style.visibility = "visible";

    // Pintamos el correo del usuario en el header (si existe el elemento)
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) userEmailEl.textContent = user.email;
});

// ─── Cerrar sesión global ───────────────────────────
window.cerrarSesion = async () => {
    try {
        await signOut(auth);
        window.location.replace("index.html");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};