/* Animaciones al hacer scroll y rebote del contador del carrito */
(function () {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Aparecer al hacer scroll ---------- */
    if (!reducirMovimiento && 'IntersectionObserver' in window) {
        const SELECTOR = '.categoria, .producto, .beneficio, .categorias h2, .productos h2';

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        function preparar(elemento, indice) {
            if (elemento.dataset.revelar) return;
            elemento.dataset.revelar = '1';
            elemento.classList.add('revelar');
            elemento.style.setProperty('--retraso', (indice % 4) * 90 + 'ms');
            observador.observe(elemento);
        }

        function escanear(raiz) {
            if (raiz.matches && raiz.matches(SELECTOR)) preparar(raiz, 0);
            raiz.querySelectorAll(SELECTOR).forEach(preparar);
        }

        escanear(document);

        // Las camisetas se crean después, cuando llegan de la base de datos
        new MutationObserver((cambios) => {
            cambios.forEach((cambio) => {
                cambio.addedNodes.forEach((nodo) => {
                    if (nodo.nodeType === 1) escanear(nodo);
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    /* ---------- 2. El contador del carrito rebota al subir ---------- */
    const contador = document.getElementById('contador-carrito');
    if (contador && !reducirMovimiento) {
        let anterior = Number(contador.textContent) || 0;

        new MutationObserver(() => {
            const actual = Number(contador.textContent) || 0;
            if (actual > anterior) {
                contador.classList.remove('rebote');
                void contador.offsetWidth; // reinicia la animación
                contador.classList.add('rebote');
            }
            anterior = actual;
        }).observe(contador, { childList: true, characterData: true, subtree: true });
    }
})();