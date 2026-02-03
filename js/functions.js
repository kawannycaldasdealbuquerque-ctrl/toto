var loader = document.getElementById("loading");
var page = document.getElementById("content-page");
window.addEventListener("load", function () {
    loader.classList.remove("active");
    page.style.display = "block";
});

const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: '.paginacao-home',
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

if (document.getElementById("barra")) {
    const arrayDados = [
        { nome: "Marcos Aurélio", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUzgdX8WIwWqKtqw4-2bG86mE4p9WiOZB7Ow&s", apoiador: 1, doado: 50, coracoes: 1 },
        { nome: "Juliana Aparecida", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS49qDsf3bdk6w-vbsgdENP4AdVhHba2uIxg&s", apoiador: 1, doado: 30.00, coracoes: 0 },
        { nome: "Maria Eduarda", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQBFy0j_72yEKBKNRbPbCzxfNxq1H9Y57ygg&s", apoiador: 1, doado: 100, coracoes: 1 },
        { nome: "Lorena Fonseca", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQBFy0j_72yEKBKNRbPbCzxfNxq1H9Y57ygg&s", apoiador: 1, doado: 100, coracoes: 0 },
        { nome: "Lucas Fernandes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhWP7MVw-2v4YRy1AuXkj4915gTqCPWGaeXw&s", apoiador: 1, doado: 200, coracoes: 1 },
        { nome: "Taina Silva", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTdI5qpFOG00JDyynGV7sk2B-ODByUiGzhLw&s", apoiador: 1, doado: 50, coracoes: 1 },
        { nome: "Fernanda Oliveira", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoBR8s5A8D5-6aN-v8ehp_nl02y1I6QpXqkg&s", apoiador: 1, doado: 200, coracoes: 0 },
        { nome: "Marcos Paulo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB3794pq98kqzv4V5lPq5xU6_ND2Sn3M2bzw&s", apoiador: 1, doado: 50, coracoes: 1 },
        { nome: "João Castro", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pjAshoJbPkL8TY9LJQWPveiutP_vuTyhKA&s", apoiador: 1, doado: 30, coracoes: 0 },
        { nome: "Julio César", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pjAshoJbPkL8TY9LJQWPveiutP_vuTyhKA&s", apoiador: 1, doado: 100, coracoes: 1 },
        { nome: "Marcela de Moraes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR6ScezBGCvWrScZ5pwc6ZcLi00mIPeTkCLg&s", apoiador: 1, doado: 50, coracoes: 0 },
        { nome: "Roberta de Souza", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwmITrZDdHdWWrNO7QqfJDIJQXxjFrlOh_Qg&s", apoiador: 1, doado: 200, coracoes: 1 },
        { nome: "Raquel Oliveira", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsOEZSKSkHd7szlHImPmoBJ7myP70NgSHPrg&s ", apoiador: 1, doado: 500, coracoes: 0 },
        { nome: "Marcelo Rodrigues", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaM0nyzw9_ojppiwzKzAOWqbbS0KY2-9OcUA&s", apoiador: 1, doado: 300, coracoes: 1 },
        { nome: "Taís Costa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNpoWSi1dRcZYTrlzbPb0zmfhh5SBbG2fFg&s", apoiador: 1, doado: 100, coracoes: 1 },
        { nome: "Manuela Ribeiro", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrSy_UsZjc6hPRCpUMf24n92upsF4x4pX7OA&s", apoiador: 1, doado: 100, coracoes: 0 },
        { nome: "Eduardo dos Santos", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjBvRxX9fPleGHHgDt9Dyh1gs-WmA4pymQqA&s", apoiador: 1, doado: 50, coracoes: 1 },
        { nome: "Manoel Caetano Santos", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSua4-7Pc2B14WQYufCEiDsKccONHiHYGhbMg&s", apoiador: 1, doado: 30, coracoes: 0 }
    ];

    let index = 0;

    function atualizarValores() {
        if (index >= arrayDados.length) return;

        let item = arrayDados[index];
        apoiadores += item.apoiador;
        coracoes += item.coracoes;
        animarValor("apoiadores", apoiadores);
        animarValor("coracoes", coracoes);

        let novoValor = arrecadado + item.doado;
        animarValor("doado", novoValor, arrecadado);
        arrecadado = novoValor;

        exibirNotificacao(item.nome, item.image, item.doado);
        atualizarBarra();
        index++;
    }

    function atualizarBarra() {
        let porcentagem = (arrecadado / meta) * 100;
        let porcento = Math.round(porcentagem);
        document.getElementById("barra").style.width = porcentagem + "%";
        document.getElementById("barraMobile").style.width = porcentagem + "%";
        document.getElementById("porcentagem").innerHTML = porcento + "%";
    }

    function animarValor(id, novoValor, valorAntigo = 0) {
        let elementos = document.querySelectorAll(`#${id}, #valorMobile`);
        let inicio = valorAntigo || parseFloat(elementos[0].innerText.replace(/[^0-9.,]/g, "")) || 0;
        let incremento = (novoValor - inicio) / 50;
        let atual = inicio;
        let contador = 0;

        let animacao = setInterval(() => {
            atual += incremento;
            elementos.forEach(elemento => {
                elemento.innerText = id === "doado" ? formatarMoeda(atual) : atual.toFixed(0);
            });

            contador++;
            if (contador >= 50) {
                clearInterval(animacao);
                elementos.forEach(elemento => {
                    elemento.innerText = id === "doado" ? formatarMoeda(novoValor) : novoValor;
                });
            }
        }, 20);
    }

    function exibirNotificacao(nome, image, valor) {
        let notificacao = document.createElement("div");
        notificacao.className = "notificacao";
        notificacao.innerHTML = `<div class="avatar"><img src="${image}" alt="${nome}"></div><div class="content"><h4>${nome}</h4> Acabou de doar <strong>${formatarMoeda(valor)}</strong>.</div>`;

        document.body.appendChild(notificacao);

        setTimeout(() => {
            let rect = notificacao.getBoundingClientRect();

            confetti({
                particleCount: 100,
                spread: 70,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                }
            });
        }, 100);

        setTimeout(() => {
            notificacao.style.transform = "translatey(0)";
            notificacao.style.opacity = "0";
            setTimeout(() => notificacao.remove(), 500);
        }, 6000);
    }

    setInterval(atualizarValores, 30000);

    document.addEventListener("DOMContentLoaded", () => {
        atualizarBarra();
    });

    document.addEventListener("DOMContentLoaded", () => {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
        document.head.appendChild(script);
    });

    jQuery(function ($) {
        $(document).ready(function () {
            $('a[href^="#"]').on('click', function (e) {
                e.preventDefault();
                var id = $(this).attr('href'),
                    targetOffset = $(id).offset().top;

                $('html, body').animate({
                    scrollTop: targetOffset - 60
                }, 1000);
            });

            $('.menu-mobile, .close-menu').click(function () {
                $('.nav-mobile').toggleClass('active');
            })
        });

        $('.btn-ajudar, .fora-modal, .close-modal').click(function () {
            $('.modal-doar').toggleClass('open');
        });
    });
}