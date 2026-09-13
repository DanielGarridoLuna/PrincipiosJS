function calcularSueldo() {
    // ─── Lectura de datos ───────────────────────────────
    const ventas     = parseFloat(document.getElementById("ventas").value)     || 0;
    const viaticos   = parseFloat(document.getElementById("viaticos").value)   || 0;
    const comida     = parseFloat(document.getElementById("comida").value)     || 0;
    const transporte = parseFloat(document.getElementById("transporte").value) || 0;
    const hospedaje  = parseFloat(document.getElementById("hospedaje").value)  || 0;

    // ─── Cálculos ───────────────────────────────────────
    const comision      = 0.10;
    const sueldoBase    = ventas * comision;
    const totalGastos   = comida + transporte + hospedaje;
    const sobrante      = viaticos - totalGastos;   // >0 sobra, <0 faltó
    const sueldoFinal   = sueldoBase - sobrante;

    // ─── Formateador de moneda ─────────────────────────
    const fmt = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN"
    });

    // ─── Helper para asignar valor + clase de color ────
    const setVal = (id, valor, signo = "auto") => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = fmt.format(valor);

        el.classList.remove("pos", "neg", "neutro");
        if (signo === "pos") el.classList.add("pos");
        else if (signo === "neg") el.classList.add("neg");
        else if (signo === "neutro") el.classList.add("neutro");
        else {
            // auto: verde si >0, rojo si <0, neutro si 0
            if (valor > 0) el.classList.add("pos");
            else if (valor < 0) el.classList.add("neg");
            else el.classList.add("neutro");
        }
    };

    // ─── Sueldo final destacado ────────────────────────
    document.getElementById("sueldoFinal").textContent = fmt.format(sueldoFinal);

    // ─── Bloque Ingresos ───────────────────────────────
    setVal("dSueldoBase", sueldoBase, "pos");

    // ─── Bloque Viáticos y Gastos ──────────────────────
    setVal("dViaticos",    viaticos,     "pos");
    setVal("dComida",     -comida,       "neg");
    setVal("dTransporte", -transporte,   "neg");
    setVal("dHospedaje",  -hospedaje,    "neg");
    setVal("dTotalGastos", -totalGastos, "neg");

    // Etiqueta y color del sobrante según el caso
    const lblSobrante = document.getElementById("dSobranteLabel");
    if (sobrante >= 0) {
        lblSobrante.textContent = "Sobrante de viáticos";
        setVal("dSobrante", sobrante, "pos");
    } else {
        lblSobrante.textContent = "Faltante de viáticos (de tu bolsa)";
        setVal("dSobrante", sobrante, "neg");
    }

    // ─── Bloque Explicativo ────────────────────────────
    setVal("eSueldoBase", sueldoBase, "pos");

    const ajusteEl  = document.getElementById("eAjuste");
    const ajusteLbl = document.getElementById("eAjusteLabel");
    const mensaje   = document.getElementById("mensajeExplicacion");

    // El ajuste es "-sobrante": si sobró (sobrante>0) → ajuste negativo; si faltó → ajuste positivo
    const ajuste = -sobrante;

    if (ajuste >= 0) {
        ajusteEl.classList.remove("neg", "neutro");
        ajusteEl.classList.add("pos");
        ajusteEl.textContent = "+" + fmt.format(ajuste);
        ajusteLbl.textContent = "Ajuste a favor";
    } else {
        ajusteEl.classList.remove("pos", "neutro");
        ajusteEl.classList.add("neg");
        ajusteEl.textContent = fmt.format(ajuste); // ya incluye el signo -
        ajusteLbl.textContent = "Ajuste en contra";
    }

    // ─── Mensaje narrativo ─────────────────────────────
    mensaje.classList.remove("positivo", "negativo");

    if (sobrante > 0) {
        // Sobró dinero de viáticos → se descuenta del sueldo
        mensaje.classList.add("negativo");
        mensaje.innerHTML =
            `De los <strong>${fmt.format(viaticos)}</strong> de viáticos asignados, ` +
            `gastaste <strong>${fmt.format(totalGastos)}</strong>, por lo que te sobraron ` +
            `<strong>${fmt.format(sobrante)}</strong>. Ese sobrante se <strong>descuenta</strong> ` +
            `de tu sueldo base (${fmt.format(sueldoBase)}), dejando un total de ` +
            `<strong>${fmt.format(sueldoFinal)}</strong>.`;
    } else if (sobrante < 0) {
        // Faltó dinero → se reembolsa al sueldo
        const faltante = Math.abs(sobrante);
        mensaje.classList.add("positivo");
        mensaje.innerHTML =
            `Tus viáticos eran <strong>${fmt.format(viaticos)}</strong>, pero gastaste ` +
            `<strong>${fmt.format(totalGastos)}</strong>. Te faltaron ` +
            `<strong>${fmt.format(faltante)}</strong> que pusiste de tu bolsa, por lo que ese monto ` +
            `se te <strong>reembolsa</strong> sumándose a tu sueldo base (${fmt.format(sueldoBase)}), ` +
            `dando un total de <strong>${fmt.format(sueldoFinal)}</strong>.`;
    } else {
        // Gastaste exactamente los viáticos
        mensaje.classList.add("positivo");
        mensaje.innerHTML =
            `Gastaste exactamente los <strong>${fmt.format(viaticos)}</strong> de viáticos, ` +
            `sin sobrante ni faltante. Tu sueldo final es igual a tu sueldo base: ` +
            `<strong>${fmt.format(sueldoFinal)}</strong>.`;
    }

    // ─── Mostrar contenedor ────────────────────────────
    document.getElementById("resultado").classList.add("visible");
}