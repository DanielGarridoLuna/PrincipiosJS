
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ─── Tu configuración ───────────────────────────────
export const firebaseConfig = {
     apiKey: "AIzaSyB-u6qUBoiolPUy1IkZSRPeYkrYAbJXQUo",
  authDomain: "login-b97b3.firebaseapp.com",
  projectId: "login-b97b3",
  storageBucket: "login-b97b3.firebasestorage.app",
  messagingSenderId: "1024077839421",
  appId: "1:1024077839421:web:d3d613a6c2f415ac57fe54"
};

// ─── Inicializar UNA SOLA VEZ ───────────────────────
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ─── Persistencia LOCAL: sobrevive al cerrar navegador ───
// Se aplica una sola vez, antes de cualquier operación
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error al configurar persistencia:", error);
    });

export { app, auth };