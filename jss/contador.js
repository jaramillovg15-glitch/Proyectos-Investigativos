const fechaObjetivo = new Date(2026, 9, 31, 0, 0, 0); // 31 de octubre de 2026, 00:00
const MESES_FIJOS = 0;

const pad = (n) => String(n).padStart(2, "0");

const anillo = (id, valor, max) => {
    const el = document.getElementById(id);
    if (el) el.style.strokeDashoffset = 100 - Math.min(100, (valor / max) * 100);
};

function actualizar() {
    const resto = fechaObjetivo - new Date();

    // Desde el 31 de octubre en adelante, se da acceso al regalo
    if (resto <= 0) {
        clearInterval(intervalo);
        window.location.replace("regalo.html");
        return;
    }

    const dias = Math.floor(resto / 86400000);
    const horas = Math.floor((resto % 86400000) / 3600000);
    const minutos = Math.floor((resto % 3600000) / 60000);
    const segundos = Math.floor((resto % 60000) / 1000);

    document.getElementById("meses").textContent = pad(MESES_FIJOS);
    document.getElementById("dias").textContent = pad(dias);
    document.getElementById("horas").textContent = pad(horas);
    document.getElementById("minutos").textContent = pad(minutos);
    document.getElementById("segundos").textContent = pad(segundos);

    anillo("anillo-meses", MESES_FIJOS, 12);
    anillo("anillo-dias", dias, 31);
    anillo("anillo-horas", horas, 24);
    anillo("anillo-minutos", minutos, 60);
    anillo("anillo-segundos", segundos, 60);
}

const intervalo = setInterval(actualizar, 1000);
actualizar();

// ===== Corazones flotando =====
const capaCorazonesPortada = document.createElement("div");
capaCorazonesPortada.className = "corazones";
document.body.prepend(capaCorazonesPortada);

function crearCorazonPortada() {
    if (capaCorazonesPortada.children.length > 22) return;
    const c = document.createElement("span");
    c.textContent = Math.random() < 0.5 ? "♥" : "♡";
    c.style.left = Math.random() * 100 + "%";
    c.style.fontSize = 14 + Math.random() * 26 + "px";
    c.style.animationDuration = 8 + Math.random() * 8 + "s";
    capaCorazonesPortada.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
}
setInterval(crearCorazonPortada, 900);