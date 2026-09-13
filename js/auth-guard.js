import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

// El html está oculto por el <style> en el <head> de main.html
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // No logueado → fuera
        window.location.replace("index.html");
        return;
    }

    // Logueado → mostramos el contenido
    document.documentElement.style.visibility = "visible";

    // Pintamos el correo del usuario
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) userEmailEl.textContent = user.email;
});

// ─── Cerrar sesión ──────────────────────────────────
window.cerrarSesion = async () => {
    try {
        await signOut(auth);
        window.location.replace("index.html");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};