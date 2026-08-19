/* =========================================================
   TIA MARI ANIMAÇÕES
   SCRIPT PRINCIPAL
   VERSÃO CONSOLIDADA
========================================================= */

const SUPABASE_URL =
    "https://yojocbbnemqzowdudtlr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_QiaYX14yBkbqyBUUaiucqQ_Tz_S2dob";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================================
           SUPABASE
        ===================================================== */

        let supabaseClient = null;

        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

        }


        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const header =
            document.getElementById("header");

        const menuButton =
            document.getElementById("menuButton");

        const nav =
            document.getElementById("nav");

        const bookingModal =
            document.getElementById("bookingModal");

        const modalClose =
            document.getElementById("modalClose");

        const modalOverlay =
            document.querySelector(".modal-overlay");

        const bookingForm =
            document.getElementById("bookingForm");

        const successModal =
            document.getElementById("successModal");

        const successClose =
            document.getElementById("successClose");

        const confettiContainer =
            document.getElementById(
                "confettiContainer"
            );

        const openBookingButtons =
            document.querySelectorAll(
                ".open-booking"
            );

        const phoneInput =
            document.getElementById("phone");

        const dateInput =
            document.getElementById("date");


        /* =====================================================
           MENSAGEM BONITA
        ===================================================== */

        function mostrarMensagem(
            mensagem,
            tipo = "erro"
        ) {

            let toast =
                document.getElementById(
                    "tiaMariToast"
                );


            if (!toast) {

                toast =
                    document.createElement(
                        "div"
                    );

                toast.id =
                    "tiaMariToast";

                document.body.appendChild(
                    toast
                );

            }


            const icone =
                tipo === "sucesso"
                    ? "✓"
                    : tipo === "aviso"
                        ? "!"
                        : "×";


            toast.innerHTML = `
                <div class="tia-toast-icon">
                    ${icone}
                </div>

                <div class="tia-toast-content">
                    <strong>
                        ${
                            tipo === "sucesso"
                                ? "Tudo certo!"
                                : tipo === "aviso"
                                    ? "Atenção"
                                    : "Ops!"
                        }
                    </strong>

                    <span>
                        ${mensagem}
                    </span>
                </div>

                <button
                    type="button"
                    class="tia-toast-close"
                    aria-label="Fechar">
                    ×
                </button>
            `;


            toast.className =
                `tia-toast tia-toast-${tipo}`;


            const fechar =
                toast.querySelector(
                    ".tia-toast-close"
                );


            if (fechar) {

                fechar.addEventListener(
                    "click",
                    () => {

                        toast.classList.remove(
                            "mostrar"
                        );

                    }
                );

            }


            requestAnimationFrame(
                () => {

                    toast.classList.add(
                        "mostrar"
                    );

                }
            );


            clearTimeout(
                window.tiaMariToastTimer
            );


            window.tiaMariToastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "mostrar"
                        );

                    },
                    5000
                );

        }


        /* =====================================================
           ESTILO DAS MENSAGENS
        ===================================================== */

        const toastStyle =
            document.createElement("style");


        toastStyle.textContent = `

            #tiaMariToast {

                position: fixed;

                top: 24px;

                right: 24px;

                width: min(
                    390px,
                    calc(100% - 32px)
                );

                display: flex;

                align-items: center;

                gap: 13px;

                padding: 15px 16px;

                background: #ffffff;

                border-radius: 18px;

                box-shadow:
                    0 18px 50px
                    rgba(50, 20, 35, .18);

                border: 1px solid #f3dce5;

                z-index: 99999;

                opacity: 0;

                transform:
                    translateY(-15px)
                    scale(.97);

                pointer-events: none;

                transition:
                    opacity .25s ease,
                    transform .25s ease;

                font-family:
                    Arial,
                    sans-serif;
            }


            #tiaMariToast.mostrar {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

                pointer-events: auto;

            }


            .tia-toast-icon {

                width: 38px;

                height: 38px;

                min-width: 38px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 50%;

                font-size: 20px;

                font-weight: 800;

            }


            .tia-toast-content {

                display: flex;

                flex-direction: column;

                gap: 3px;

                flex: 1;

            }


            .tia-toast-content strong {

                font-size: 14px;

                color: #292329;

            }


            .tia-toast-content span {

                font-size: 13px;

                line-height: 1.45;

                color: #777;

            }


            .tia-toast-close {

                border: 0;

                background: transparent;

                color: #999;

                font-size: 22px;

                cursor: pointer;

                padding: 4px;

            }


            .tia-toast-erro
            .tia-toast-icon {

                background: #fff0f2;

                color: #d9365f;

            }


            .tia-toast-aviso
            .tia-toast-icon {

                background: #fff6df;

                color: #b77700;

            }


            .tia-toast-sucesso
            .tia-toast-icon {

                background: #e9f9ef;

                color: #168548;

            }


            @media(max-width:600px) {

                #tiaMariToast {

                    top: 15px;

                    right: 16px;

                    width:
                        calc(100% - 32px);

                }

            }

        `;


        document.head.appendChild(
            toastStyle
        );


        /* =====================================================
           HEADER
        ===================================================== */

        if (header) {

            function atualizarHeader() {

                if (
                    window.scrollY > 30
                ) {

                    header.classList.add(
                        "scrolled"
                    );

                } else {

                    header.classList.remove(
                        "scrolled"
                    );

                }

            }


            window.addEventListener(
                "scroll",
                atualizarHeader
            );


            atualizarHeader();

        }


        /* =====================================================
           MENU MOBILE
        ===================================================== */

        if (
            menuButton &&
            nav
        ) {

            menuButton.addEventListener(
                "click",
                () => {

                    nav.classList.toggle(
                        "active"
                    );


                    const aberto =
                        nav.classList.contains(
                            "active"
                        );


                    menuButton.setAttribute(
                        "aria-expanded",
                        String(aberto)
                    );

                }
            );


            nav.querySelectorAll("a")
                .forEach(
                    link => {

                        link.addEventListener(
                            "click",
                            () => {

                                nav.classList.remove(
                                    "active"
                                );

                            }
                        );

                    }
                );

        }


        /* =====================================================
           REVEAL
        ===================================================== */

        const elementosReveal =
            document.querySelectorAll(
                ".reveal"
            );


        if (
            "IntersectionObserver"
            in window
        ) {

            const observer =
                new IntersectionObserver(
                    entradas => {

                        entradas.forEach(
                            entrada => {

                                if (
                                    entrada.isIntersecting
                                ) {

                                    entrada.target.classList.add(
                                        "visible"
                                    );

                                    observer.unobserve(
                                        entrada.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            elementosReveal.forEach(
                elemento => {

                    observer.observe(
                        elemento
                    );

                }
            );

        } else {

            elementosReveal.forEach(
                elemento => {

                    elemento.classList.add(
                        "visible"
                    );

                }
            );

        }


        /* =====================================================
           ABRIR AGENDAMENTO
        ===================================================== */

        function abrirAgendamento() {

            if (!bookingModal) {
                return;
            }


            bookingModal.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";


            setTimeout(
                () => {

                    const nome =
                        document.getElementById(
                            "name"
                        );


                    if (nome) {

                        nome.focus();

                    }

                },
                350
            );

        }


        openBookingButtons.forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    abrirAgendamento
                );

            }
        );


        /* =====================================================
           FECHAR AGENDAMENTO
        ===================================================== */

        function fecharAgendamento() {

            if (!bookingModal) {
                return;
            }


            bookingModal.classList.remove(
                "active"
            );


            document.body.style.overflow =
                "";

        }


        if (modalClose) {

            modalClose.addEventListener(
                "click",
                fecharAgendamento
            );

        }


        if (modalOverlay) {

            modalOverlay.addEventListener(
                "click",
                fecharAgendamento
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    bookingModal &&
                    bookingModal.classList.contains(
                        "active"
                    )
                ) {

                    fecharAgendamento();

                }

            }
        );


        /* =====================================================
           MÁSCARA WHATSAPP
        ===================================================== */

        if (phoneInput) {

            phoneInput.addEventListener(
                "input",
                event => {

                    let valor =
                        event.target.value
                            .replace(
                                /\D/g,
                                ""
                            )
                            .slice(
                                0,
                                11
                            );


                    if (
                        valor.length <= 10
                    ) {

                        valor =
                            valor.replace(
                                /^(\d{2})(\d)/,
                                "($1) $2"
                            );


                        valor =
                            valor.replace(
                                /(\d{4})(\d)/,
                                "$1-$2"
                            );

                    } else {

                        valor =
                            valor.replace(
                                /^(\d{2})(\d)/,
                                "($1) $2"
                            );


                        valor =
                            valor.replace(
                                /(\d{5})(\d)/,
                                "$1-$2"
                            );

                    }


                    event.target.value =
                        valor;

                }
            );

        }


        /* =====================================================
           DATA MÍNIMA
        ===================================================== */

        function atualizarDataMinima() {

            if (!dateInput) {
                return;
            }


            const hoje =
                new Date();


            const ano =
                hoje.getFullYear();


            const mes =
                String(
                    hoje.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const dia =
                String(
                    hoje.getDate()
                ).padStart(
                    2,
                    "0"
                );


            dateInput.min =
                `${ano}-${mes}-${dia}`;

        }


        atualizarDataMinima();


        /* =====================================================
           VALIDAR DATA
        ===================================================== */

        function dataValida(data) {

            if (!data) {
                return false;
            }


            const hoje =
                new Date();


            hoje.setHours(
                0,
                0,
                0,
                0
            );


            const escolhida =
                new Date(
                    `${data}T00:00:00`
                );


            return (
                !Number.isNaN(
                    escolhida.getTime()
                ) &&
                escolhida >= hoje
            );

        }


        /* =====================================================
           FORMATAR DATA
        ===================================================== */

        function formatarData(data) {

            if (!data) {
                return "";
            }


            const partes =
                data.split("-");


            if (
                partes.length !== 3
            ) {

                return data;

            }


            return (
                `${partes[2]}/${partes[1]}/${partes[0]}`
            );

        }


        /* =====================================================
           VERIFICAR DISPONIBILIDADE
        ===================================================== */

        async function verificarDisponibilidade(
            dataEvento,
            horario
        ) {

            if (!supabaseClient) {

                throw new Error(
                    "O sistema de agendamento não foi carregado."
                );

            }


            const resposta =
                await supabaseClient
                    .from("agendamentos")
                    .select(
                        "id,data_evento,horario,status"
                    )
                    .eq(
                        "data_evento",
                        dataEvento
                    )
                    .eq(
                        "horario",
                        horario
                    );


            if (resposta.error) {

                throw resposta.error;

            }


            const conflitos =
                (resposta.data || [])
                    .filter(
                        item => {

                            const status =
                                String(
                                    item.status || ""
                                )
                                .trim()
                                .toLowerCase();


                            return (
                                status ===
                                    "pendente" ||
                                status ===
                                    "confirmado"
                            );

                        }
                    );


            return {
                disponivel:
                    conflitos.length === 0,

                conflitos
            };

        }


        /* =====================================================
           ENVIO DO AGENDAMENTO
        ===================================================== */

        if (bookingForm) {

            bookingForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const submitButton =
                        document.getElementById(
                            "submitButton"
                        );


                    const originalText =
                        submitButton
                            ? submitButton.innerHTML
                            : "Enviar solicitação";


                    if (
                        submitButton &&
                        submitButton.disabled
                    ) {

                        return;

                    }


                    /* =============================================
                       PEGAR DADOS
                    ============================================= */

                    const formData =
                        new FormData(
                            bookingForm
                        );


                    const nome =
                        String(
                            formData.get(
                                "name"
                            ) || ""
                        ).trim();


                    const whatsapp =
                        String(
                            formData.get(
                                "phone"
                            ) || ""
                        ).trim();


                    const dataEvento =
                        String(
                            formData.get(
                                "date"
                            ) || ""
                        ).trim();


                    const horario =
                        String(
                            formData.get(
                                "time"
                            ) || ""
                        ).trim();


                    /*
                     * CORREÇÃO IMPORTANTE:
                     *
                     * O HTML usa:
                     *
                     * name="event"
                     *
                     * e não:
                     *
                     * name="eventType"
                     */

                    const tipoEvento =
                        String(
                            formData.get(
                                "event"
                            ) || ""
                        ).trim();


                    const servico =
                        String(
                            formData.get(
                                "service"
                            ) || ""
                        ).trim();


                    const mensagem =
                        String(
                            formData.get(
                                "message"
                            ) || ""
                        ).trim();


                    /* =============================================
                       VALIDAÇÃO
                    ============================================= */

                    const camposObrigatorios = [
                        {
                            valor: nome,
                            elemento:
                                document.getElementById(
                                    "name"
                                ),
                            mensagem:
                                "Digite seu nome."
                        },

                        {
                            valor: whatsapp,
                            elemento:
                                document.getElementById(
                                    "phone"
                                ),
                            mensagem:
                                "Digite seu WhatsApp."
                        },

                        {
                            valor: dataEvento,
                            elemento:
                                document.getElementById(
                                    "date"
                                ),
                            mensagem:
                                "Escolha a data da festa."
                        },

                        {
                            valor: horario,
                            elemento:
                                document.getElementById(
                                    "time"
                                ),
                            mensagem:
                                "Escolha o horário."
                        },

                        {
                            valor: tipoEvento,
                            elemento:
                                document.getElementById(
                                    "event"
                                ),
                            mensagem:
                                "Escolha o tipo de evento."
                        },

                        {
                            valor: servico,
                            elemento:
                                document.getElementById(
                                    "service"
                                ),
                            mensagem:
                                "Escolha o serviço."
                        }
                    ];


                    const campoVazio =
                        camposObrigatorios.find(
                            campo =>
                                !campo.valor
                        );


                    if (campoVazio) {

                        mostrarMensagem(
                            campoVazio.mensagem,
                            "aviso"
                        );


                        if (
                            campoVazio.elemento
                        ) {

                            campoVazio.elemento.focus();

                        }


                        return;

                    }


                    /* =============================================
                       VALIDAR WHATSAPP
                    ============================================= */

                    const numerosWhatsApp =
                        whatsapp.replace(
                            /\D/g,
                            ""
                        );


                    if (
                        numerosWhatsApp.length < 10
                    ) {

                        mostrarMensagem(
                            "Digite um WhatsApp válido.",
                            "aviso"
                        );


                        if (phoneInput) {
                            phoneInput.focus();
                        }


                        return;

                    }


                    /* =============================================
                       VALIDAR DATA
                    ============================================= */

                    if (
                        !dataValida(
                            dataEvento
                        )
                    ) {

                        mostrarMensagem(
                            "Escolha uma data de hoje em diante.",
                            "aviso"
                        );


                        if (dateInput) {
                            dateInput.focus();
                        }


                        return;

                    }


                    /* =============================================
                       CARREGANDO
                    ============================================= */

                    if (submitButton) {

                        submitButton.disabled =
                            true;

                        submitButton.innerHTML =
                            "Verificando disponibilidade...";

                    }


                    try {

                        if (!supabaseClient) {

                            throw new Error(
                                "Supabase não foi carregado."
                            );

                        }


                        /* =========================================
                           VERIFICAR HORÁRIO
                        ========================================= */

                        const disponibilidade =
                            await verificarDisponibilidade(
                                dataEvento,
                                horario
                            );


                        if (
                            !disponibilidade.disponivel
                        ) {

                            mostrarMensagem(
                                `O horário de ${formatarData(dataEvento)} às ${horario} já possui uma solicitação ativa. Escolha outro horário.`,
                                "aviso"
                            );


                            if (submitButton) {

                                submitButton.disabled =
                                    false;

                                submitButton.innerHTML =
                                    originalText;

                            }


                            return;

                        }


                        /* =========================================
                           DADOS
                        ========================================= */

                        const dados = {

                            nome:
                                nome,

                            whatsapp:
                                whatsapp,

                            data_evento:
                                dataEvento,

                            horario:
                                horario,

                            tipo_evento:
                                tipoEvento,

                            servico:
                                servico,

                            mensagem:
                                mensagem,

                            status:
                                "Pendente"

                        };


                        /* =========================================
                           ENVIAR
                        ========================================= */

                        if (submitButton) {

                            submitButton.innerHTML =
                                "Enviando solicitação...";

                        }


                        const resultado =
                            await supabaseClient
                                .from(
                                    "agendamentos"
                                )
                                .insert([
                                    dados
                                ]);


                        if (
                            resultado.error
                        ) {

                            throw resultado.error;

                        }


                        console.log(
                            "Agendamento salvo:",
                            dados
                        );


                        /* =========================================
                           LIMPAR
                        ========================================= */

                        bookingForm.reset();

                        atualizarDataMinima();


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                            submitButton.innerHTML =
                                originalText;

                        }


                        fecharAgendamento();


                        mostrarMensagem(
                            "Sua solicitação foi enviada com sucesso!",
                            "sucesso"
                        );


                        setTimeout(
                            () => {

                                mostrarSucesso();

                            },
                            350
                        );


                    } catch (erro) {

                        console.error(
                            "Erro ao enviar agendamento:",
                            erro
                        );


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                            submitButton.innerHTML =
                                originalText;

                        }


                        mostrarMensagem(
                            "Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.",
                            "erro"
                        );

                    }

                }
            );

        }


        /* =====================================================
           SUCESSO
        ===================================================== */

        function mostrarSucesso() {

            if (!successModal) {
                return;
            }


            successModal.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";


            criarConfetes();

        }


        /* =====================================================
           FECHAR SUCESSO
        ===================================================== */

        if (successClose) {

            successClose.addEventListener(
                "click",
                () => {

                    if (successModal) {

                        successModal.classList.remove(
                            "active"
                        );

                    }


                    document.body.style.overflow =
                        "";

                }
            );

        }


        /* =====================================================
           CONFETES
        ===================================================== */

        function criarConfetes() {

            if (!confettiContainer) {
                return;
            }


            confettiContainer.innerHTML =
                "";


            for (
                let i = 0;
                i < 35;
                i++
            ) {

                const confetti =
                    document.createElement(
                        "span"
                    );


                confetti.className =
                    "confetti";


                confetti.style.left =
                    `${Math.random() * 100}%`;


                confetti.style.animationDelay =
                    `${Math.random() * 0.8}s`;


                confetti.style.setProperty(
                    "--rotation",
                    `${Math.random() * 360}deg`
                );


                confettiContainer.appendChild(
                    confetti
                );

            }

        }


        /* =====================================================
           LOGIN ADMINISTRATIVO
        ===================================================== */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (
            loginForm &&
            supabaseClient
        ) {

            loginForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const email =
                        document
                            .getElementById(
                                "email"
                            )
                            ?.value
                            .trim();


                    const senha =
                        document
                            .getElementById(
                                "senha"
                            )
                            ?.value;


                    const loginButton =
                        document.getElementById(
                            "loginButton"
                        );


                    const mensagem =
                        document.getElementById(
                            "mensagem"
                        );


                    if (
                        !email ||
                        !senha
                    ) {

                        if (mensagem) {

                            mensagem.textContent =
                                "Preencha seu e-mail e senha.";

                            mensagem.className =
                                "erro";

                        }

                        return;

                    }


                    if (loginButton) {

                        loginButton.disabled =
                            true;

                        loginButton.textContent =
                            "Entrando...";

                    }


                    try {

                        const resultado =
                            await supabaseClient
                                .auth
                                .signInWithPassword({

                                    email:
                                        email,

                                    password:
                                        senha

                                });


                        if (
                            resultado.error
                        ) {

                            throw resultado.error;

                        }


                        if (mensagem) {

                            mensagem.textContent =
                                "Login realizado com sucesso!";

                            mensagem.className =
                                "sucesso";

                        }


                        setTimeout(
                            () => {

                                window.location.href =
                                    "admin.html";

                            },
                            500
                        );


                    } catch (erro) {

                        console.error(
                            "Erro no login:",
                            erro
                        );


                        if (mensagem) {

                            mensagem.textContent =
                                "E-mail ou senha incorretos.";

                            mensagem.className =
                                "erro";

                        }


                        if (loginButton) {

                            loginButton.disabled =
                                false;

                            loginButton.textContent =
                                "Entrar";

                        }

                    }

                }
            );

        }


    }
);