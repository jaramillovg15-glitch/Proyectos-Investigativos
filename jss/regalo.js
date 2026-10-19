const textos = [
    { titulo: "T", frase: "Te he estado esperando toda mi vida,\nuna mujer como tú no se encuentra en ninguna parte.\nPor eso soy afortunado de tenerte,\ny estar contigo aquí me hace muy feliz.\n\nTodo lo que soy lo quiero compartir contigo." },
    { titulo: "E", frase: "Eres la razón por la cual soy feliz, a pesar de todos los momentos dificiles, siempre estas ahi conmigo.\n\nHe aprendido que la felicidad no está en lo grande, sino en estar a tu lado, en cualquier lugar y a cualquier hora." },
    { titulo: "A", frase: "A tu lado hasta lo más simple se vuelve mi parte favorita del día.\n\nUna charla, una salida o un silencio contigo valen más que cualquier plan. Gracias por hacer especial hasta lo cotidiano." },
    { titulo: "M", frase: "Me haces sonreir cada vez que estoy a tu lado.\n\nGracias por tus abrazos, tus besos y por cada vez que me hiciste sentir que todo iba a estar bien. Contigo me siento en casa." },
    { titulo: "O", frase: "Olvido todo lo demás cuando estoy contigo.\n\nEres mi lugar favorito, mi calma y mi alegría. Si pudiera volver al principio, te elegiría una y mil veces." },
    { titulo: "S", frase: "Siempre supe que algo bueno venía, pero nunca imaginé que serías tú.\n\nLlegaste sin avisar y cambiaste todo para bien. Hoy no me imagino mis días sin ti." },
    { titulo: "O", frase: "Ojalá el tiempo fuera más lento para quedarme un rato más contigo en cada momento.\n\nQuiero que todos mis mañanas incluyan tu sonrisa, y que nunca falten las ganas de seguir construyendo esto juntos." },
    { titulo: "N", frase: "Nunca me cansaré de elegirte, hoy, mañana y todos los días que vengan.\n\nSi hay dificultades, las hablaremos y las resolveremos juntos. Esta relacion que tenemos es muy bonita y sana, eso es lo que quiero en mi vida compartir todos esos momentos con una mujer como tu" },
    { titulo: "I", frase: "Intento siempre darte lo mejor de mi, todos los dias me levanto para ser una mujer persona y crecer contigo de a poco a poco.\nEn todo momento siempre pienso en ti,\nno hay dia por el cual yo deje de hacer eso, te tengo en mi corazón siempre." },
    { titulo: "A", frase: "Aquí estoy y aquí me quedo, porque contigo encontré mil razones para quedarme.\n\nGracias por este primer año y por todos los que faltan. Feliz aniversario, mi Sonita." }
];

const totalFotos = textos.length;
const cancion = document.getElementById("cancion");
const fotos = document.getElementById("fotos");
const visor = document.getElementById("visor");
const visorImg = document.getElementById("visor-img");
const reproductor = document.querySelector(".reproductor");
let fotoActual = 0;

const capa = document.createElement("div");
capa.className = "corazones";
document.body.prepend(capa);

function nuevoCorazon() {
    if (capa.children.length > 22) return;
    const c = document.createElement("span");
    c.textContent = Math.random() < 0.5 ? "♥" : "♡";
    c.style.left = Math.random() * 100 + "%";
    c.style.fontSize = 14 + Math.random() * 26 + "px";
    c.style.animationDuration = 8 + Math.random() * 8 + "s";
    capa.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
}
setInterval(nuevoCorazon, 900);

let cambiando = false;

function abrirFoto(i, dir = 0) {
    const destino = (i + totalFotos) % totalFotos;
    const contenido = document.querySelector(".visor-contenido");
    const ruta = "../img/Foto" + (destino + 1) + ".jpeg";

    const mostrar = () => {
        fotoActual = destino;
        const t = textos[destino];
        const frase = document.getElementById("visor-frase");
        visorImg.src = ruta;
        visorImg.alt = t.titulo;
        frase.textContent = t.frase;
        frase.classList.toggle("largo", t.frase.length > 70);
        frase.classList.toggle("muy-largo", t.frase.length > 160);
        frase.scrollTop = 0;
    };

    // Primera vez que se abre: sin transición de cambio
    if (dir === 0 || visor.classList.contains("oculto")) {
        mostrar();
        visor.classList.remove("oculto");
        return;
    }

    if (cambiando) return;
    cambiando = true;

    const precarga = new Image();   // carga la foto antes para que no parpadee
    precarga.src = ruta;

    contenido.classList.remove("entra-sig", "entra-ant");
    contenido.classList.add(dir > 0 ? "sale-sig" : "sale-ant");

    setTimeout(() => {
        mostrar();
        contenido.classList.remove("sale-sig", "sale-ant");
        void contenido.offsetWidth;   // reinicia la animación
        contenido.classList.add(dir > 0 ? "entra-sig" : "entra-ant");
        setTimeout(() => {
            contenido.classList.remove("entra-sig", "entra-ant");
            cambiando = false;
        }, 450);
    }, 250);
}

const cerrarFoto = () => visor.classList.add("oculto");
document.getElementById("cerrar").onclick = cerrarFoto;
document.getElementById("visor-ant").onclick = () => abrirFoto(fotoActual - 1, -1);
document.getElementById("visor-sig").onclick = () => abrirFoto(fotoActual + 1, 1);
visor.onclick = (e) => { if (e.target === visor) cerrarFoto(); };

document.addEventListener("keydown", (e) => {
    if (visor.classList.contains("oculto")) return;
    if (e.key === "Escape") cerrarFoto();
    if (e.key === "ArrowRight") abrirFoto(fotoActual + 1, 1);
    if (e.key === "ArrowLeft") abrirFoto(fotoActual - 1, -1);
});

// Deslizar el dedo en el celular
let toqueX = null;
visor.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
visor.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 50) abrirFoto(fotoActual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
}, { passive: true });

// ===== Polaroids =====
for (let n = 1; n <= totalFotos; n++) {
    const t = textos[n - 1];

    const boton = document.createElement("button");
    boton.className = "polaroid aparece";
    boton.style.transitionDelay = ((n - 1) % 3) * 0.2 + "s";
    boton.setAttribute("aria-label", "Ver foto " + n + " en grande");

    const hilo = document.createElement("span");
    hilo.className = "hilo";

    const img = document.createElement("img");
    img.src = "../img/Foto" + n + ".jpeg";
    img.alt = t.titulo;

    const pie = document.createElement("span");
    pie.className = "pie";
    const titulo = document.createElement("b");
    titulo.textContent = t.titulo;
    pie.appendChild(titulo);

    boton.append(hilo, img, pie);
    boton.onclick = () => abrirFoto(n - 1);
    fotos.appendChild(boton);
}

// ===== Aparecer al bajar =====
const observador = new IntersectionObserver((items) => {
    items.forEach((i) => {
        if (!i.isIntersecting) return;
        i.target.classList.add("visto");
        observador.unobserve(i.target);
        setTimeout(() => (i.target.style.transitionDelay = "0s"), 2500);
    });
}, { threshold: 0.15 });

function prepararAparicion() {
    document.querySelectorAll(".seccion > *:not(.fotos)").forEach((el, k) => {
        el.classList.add("aparece");
        el.style.transitionDelay = (k % 3) * 0.15 + "s";
    });
    document.querySelectorAll(".aparece").forEach((el) => observador.observe(el));
}

document.getElementById("comenzar").onclick = () => {
    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("contenido").classList.remove("oculto");
    prepararAparicion();
    cancion.play().catch(() => {});
    window.scrollTo(0, 0);
};

// ===== Reproductor =====
const INICIO = 87;
const FIN = 205;   // pon 0 para que llegue hasta el final de la canción

const play = document.getElementById("play");
const progreso = document.getElementById("progreso");
const barra = document.getElementById("barra");
const dar = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

const finReal = () => (FIN > 0 && FIN < cancion.duration ? FIN : cancion.duration);
const largo = () => finReal() - INICIO;

cancion.loop = false;

function prepararCancion() {
    cancion.currentTime = INICIO;
    document.getElementById("total").textContent = dar(largo());
}
cancion.onloadedmetadata = prepararCancion;
if (cancion.readyState >= 1) prepararCancion();

play.onclick = () => (cancion.paused ? cancion.play() : cancion.pause());
cancion.onplay = () => { play.textContent = "❚❚"; reproductor.classList.add("sonando"); };
cancion.onpause = () => { play.textContent = "▶"; reproductor.classList.remove("sonando"); };

cancion.ontimeupdate = () => {
    if (cancion.currentTime >= finReal() - 0.05) cancion.currentTime = INICIO;
    const avance = Math.max(0, cancion.currentTime - INICIO);
    document.getElementById("actual").textContent = dar(avance);
    if (cancion.duration) progreso.style.width = Math.min(100, (avance / largo()) * 100) + "%";
};

cancion.onended = () => { cancion.currentTime = INICIO; cancion.play(); };

barra.onclick = (e) => {
    const r = barra.getBoundingClientRect();
    if (cancion.duration) cancion.currentTime = INICIO + ((e.clientX - r.left) / r.width) * largo();
};

// ===== Video final: la canción se pausa mientras suena el video =====
const videoFinal = document.getElementById("video-final");
if (videoFinal) {
    videoFinal.addEventListener("play", () => cancion.pause());
    videoFinal.addEventListener("ended", () => cancion.play().catch(() => {}));
    cancion.addEventListener("play", () => videoFinal.pause());
}