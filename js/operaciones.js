function calcularSueldo() {
    let ventas = parseFloat(document.getElementById("ventas").value);
    let viaticos = parseFloat(document.getElementById("viaticos").value);
    let comida = parseFloat(document.getElementById("comida").value);
    let transporte = parseFloat(document.getElementById("transporte").value);
    let hospedaje = parseFloat(document.getElementById("hospedaje").value);
    const comision = 0.1; 
    let sueldoBase = ventas* comision;
    let sobrante= viaticos - (comida + transporte + hospedaje);
    let sueldoFinal = sueldoBase - sobrante;
    document.getElementById("sueldoFinal").textContent = "Sueldo Final: " + sueldoFinal;
}