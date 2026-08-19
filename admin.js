/* =========================================================
   TIA MARI
   PAINEL ADMINISTRATIVO
   VERSÃO CONSOLIDADA
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://yojocbbnemqzowdudtlr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_QiaYX14yBkbqyBUUaiucqQ_Tz_S2dob";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   VARIÁVEIS
========================================================= */

let agendamentos = [];

let filtroAtual = "todos";

let termoBusca = "";

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const logado =
            await verificarLogin();

        if (!logado) {
            return;
        }

        configurarEventos();

        await carregarAgendamentos();

    }
);


/* =========================================================
   VERIFICAR LOGIN
========================================================= */

async function verificarLogin() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Erro ao verificar login:",
                error
            );

            window.location.href =
                "login.html";

            return false;
        }


        if (!data.session) {

            window.location.href =
                "login.html";

            return false;
        }


        return true;


    } catch (erro) {

        console.error(
            "Erro na sessão:",
            erro
        );

        window.location.href =
            "login.html";

        return false;

    }

}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {


    /* =====================================================
       BOTÃO ATUALIZAR
    ===================================================== */

    const btnAtualizar =
        document.getElementById(
            "btnAtualizar"
        );

    if (btnAtualizar) {

        btnAtualizar.addEventListener(
            "click",
            async () => {

                btnAtualizar.classList.add(
                    "carregando"
                );

                await carregarAgendamentos();

                setTimeout(
                    () => {

                        btnAtualizar.classList.remove(
                            "carregando"
                        );

                    },
                    300
                );

            }
        );

    }


    /* =====================================================
       BOTÃO SAIR
    ===================================================== */

    const btnSair =
        document.getElementById(
            "btnSair"
        );

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sair
        );

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    document
        .querySelectorAll(".filtro")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filtro"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "ativo"
                            );

                        });


                    botao.classList.add(
                        "ativo"
                    );


                    filtroAtual =
                        normalizarStatus(
                            botao.dataset.status
                        );


                    renderizarAgendamentos();

                }
            );

        });

/* =====================================================
   BUSCA DE AGENDAMENTOS
===================================================== */

const campoBusca =
    document.getElementById(
        "campoBusca"
    );

const limparBusca =
    document.getElementById(
        "limparBusca"
    );


if (campoBusca) {

    campoBusca.addEventListener(
        "input",
        () => {

            termoBusca =
                campoBusca.value
                    .trim()
                    .toLowerCase();

            atualizarBotaoLimparBusca();

            renderizarAgendamentos();

        }
    );

}


if (limparBusca) {

    limparBusca.addEventListener(
        "click",
        () => {

            termoBusca = "";

            if (campoBusca) {

                campoBusca.value = "";

                campoBusca.focus();

            }

            atualizarBotaoLimparBusca();

            renderizarAgendamentos();

        }
    );

}


atualizarBotaoLimparBusca();

    /* =====================================================
       FECHAR MODAL
    ===================================================== */

    const fechar =
        document.getElementById(
            "fecharModal"
        );

    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharModal
        );

    }


    /* =====================================================
       CLICAR FORA DO MODAL
    ===================================================== */

    const modal =
        document.getElementById(
            "modalDetalhes"
        );

    if (modal) {

        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === modal
                ) {

                    fecharModal();

                }

            }
        );

    }


    /* =====================================================
       ESC FECHA MODAL
    ===================================================== */

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                fecharModal();

            }

        }
    );

}


/* =========================================================
   CARREGAR AGENDAMENTOS
========================================================= */

async function carregarAgendamentos() {

    const lista =
        document.getElementById(
            "listaAgendamentos"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML = `
        <div class="carregando">
            <span class="loading-spinner"></span>
            Carregando agendamentos...
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("agendamentos")
                .select("*")
                .order(
                    "data_evento",
                    {
                        ascending: true
                    }
                );


        if (error) {

            throw error;

        }


        agendamentos =
            Array.isArray(data)
                ? data
                : [];


        atualizarCards();

        renderizarAgendamentos();


    } catch (erro) {

        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );


        agendamentos = [];

        atualizarCards();


        lista.innerHTML = `
            <div class="vazio erro-lista">
                <strong>Não foi possível carregar os agendamentos.</strong>
                <br>
                Tente atualizar a página.
            </div>
        `;

    }

}


/* =========================================================
   NORMALIZAR STATUS
========================================================= */

function normalizarStatus(status) {

    if (!status) {
        return "pendente";
    }


    const valor =
        String(status)
            .trim()
            .toLowerCase();


    if (
        valor === "pendente" ||
        valor === "pendentes"
    ) {

        return "pendente";

    }


    if (
        valor === "confirmado" ||
        valor === "confirmados"
    ) {

        return "confirmado";

    }


    if (
        valor === "cancelado" ||
        valor === "cancelados"
    ) {

        return "cancelado";

    }


    return valor;

}


/* =========================================================
   TEXTO DO STATUS
========================================================= */

function textoStatus(status) {

    const normalizado =
        normalizarStatus(status);


    if (
        normalizado === "confirmado"
    ) {

        return "Confirmado";

    }


    if (
        normalizado === "cancelado"
    ) {

        return "Cancelado";

    }


    return "Pendente";

}


/* =========================================================
   ATUALIZAR CARDS
========================================================= */

function atualizarCards() {

    const total =
        agendamentos.length;


    const pendentes =
        agendamentos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) === "pendente"
        ).length;


    const confirmados =
        agendamentos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) === "confirmado"
        ).length;


    const cancelados =
        agendamentos.filter(
            item =>
                normalizarStatus(
                    item.status
                ) === "cancelado"
        ).length;


    const totalElemento =
        document.getElementById(
            "totalAgendamentos"
        );

    const pendentesElemento =
        document.getElementById(
            "pendentes"
        );

    const confirmadosElemento =
        document.getElementById(
            "confirmados"
        );

    const canceladosElemento =
        document.getElementById(
            "cancelados"
        );


    if (totalElemento) {
        totalElemento.textContent =
            total;
    }


    if (pendentesElemento) {
        pendentesElemento.textContent =
            pendentes;
    }


    if (confirmadosElemento) {
        confirmadosElemento.textContent =
            confirmados;
    }


    if (canceladosElemento) {
        canceladosElemento.textContent =
            cancelados;
    }

}


/* =========================================================
   RENDERIZAR AGENDAMENTOS
========================================================= */

function renderizarAgendamentos() {

    const lista =
        document.getElementById(
            "listaAgendamentos"
        );


    if (!lista) {
        return;
    }


    let dados =
        [...agendamentos];

/* =====================================================
   BUSCA
===================================================== */

if (termoBusca) {

    dados =
        dados.filter(
            item => {

                const nome =
                    String(
                        item.nome || ""
                    ).toLowerCase();


                const whatsapp =
                    String(
                        item.whatsapp || ""
                    ).toLowerCase();


                const servico =
                    String(
                        item.servico || ""
                    ).toLowerCase();


                const tipoEvento =
                    String(
                        item.tipo_evento || ""
                    ).toLowerCase();


                return (
                    nome.includes(
                        termoBusca
                    ) ||

                    whatsapp.includes(
                        termoBusca
                    ) ||

                    servico.includes(
                        termoBusca
                    ) ||

                    tipoEvento.includes(
                        termoBusca
                    )
                );

            }
        );

}

    /* =====================================================
       FILTRO
       
       IMPORTANTE:
       "Todos" mostra apenas pendentes e confirmados.
       Cancelados aparecem somente em "Cancelados".
    ===================================================== */

    if (
        filtroAtual === "todos"
    ) {

        dados =
            dados.filter(
                item => {

                    const status =
                        normalizarStatus(
                            item.status
                        );

                    return (
                        status === "pendente" ||
                        status === "confirmado"
                    );

                }
            );

    } else {

        dados =
            dados.filter(
                item =>
                    normalizarStatus(
                        item.status
                    ) === filtroAtual
            );

    }


    /* =====================================================
       NENHUM RESULTADO
    ===================================================== */

    if (!dados.length) {

        let mensagem =
            "Nenhum agendamento encontrado.";


        if (
            filtroAtual === "todos"
        ) {

            mensagem =
                "Nenhum agendamento ativo encontrado.";

        }


        lista.innerHTML = `
            <div class="vazio">
                ${mensagem}
            </div>
        `;

        return;

    }


    /* =====================================================
       ORDENAR POR DATA + HORÁRIO
    ===================================================== */

    dados.sort(
        (a, b) => {

            const dataA =
                `${a.data_evento || ""} ${a.horario || ""}`;

            const dataB =
                `${b.data_evento || ""} ${b.horario || ""}`;


            return dataA.localeCompare(
                dataB
            );

        }
    );


    /* =====================================================
       CRIAR HTML
    ===================================================== */

    lista.innerHTML =
        dados
            .map(
                criarAgendamentoHTML
            )
            .join("");


    adicionarEventosAgendamentos();

}


/* =========================================================
   CRIAR HTML DO AGENDAMENTO
========================================================= */

function criarAgendamentoHTML(
    agendamento
) {

    const status =
        normalizarStatus(
            agendamento.status
        );


    const statusTexto =
        textoStatus(
            agendamento.status
        );


    const data =
        formatarData(
            agendamento.data_evento
        );


    const horario =
        agendamento.horario ||
        "--";


    const nome =
        escaparHTML(
            agendamento.nome ||
            "Sem nome"
        );


    const whatsapp =
        escaparHTML(
            agendamento.whatsapp ||
            "--"
        );


    const tipoEvento =
        escaparHTML(
            agendamento.tipo_evento ||
            "--"
        );


    const servico =
        escaparHTML(
            agendamento.servico ||
            "--"
        );


    return `

        <article
            class="agendamento"
            data-id="${agendamento.id}"
        >

            <div class="agendamento-info">

                <h3>
                    ${nome}
                </h3>


                <div class="info-linha">

                    <span>
                        📅 ${data}
                    </span>

                    <span>
                        🕐 ${escaparHTML(
                            horario
                        )}
                    </span>

                    <span>
                        📱 ${whatsapp}
                    </span>

                </div>


                <div class="info-linha">

                    <span>
                        🎉 ${tipoEvento}
                    </span>

                    <span>
                        🎨 ${servico}
                    </span>

                </div>


                <span
                    class="status status-${status}"
                >
                    ${statusTexto}
                </span>

            </div>


            <div class="agendamento-acoes">

                <button
                    type="button"
                    class="btn btn-ver"
                    data-acao="ver"
                    data-id="${agendamento.id}"
                >
                    👁 Ver
                </button>


                ${
                    status !== "confirmado"
                    ?
                    `
                    <button
                        type="button"
                        class="btn btn-confirmar"
                        data-acao="confirmar"
                        data-id="${agendamento.id}"
                    >
                        ✓ Confirmar
                    </button>
                    `
                    :
                    ""
                }


                ${
                    status !== "cancelado"
                    ?
                    `
                    <button
                        type="button"
                        class="btn btn-cancelar"
                        data-acao="cancelar"
                        data-id="${agendamento.id}"
                    >
                        ✕ Cancelar
                    </button>
                    `
                    :
                    ""
                }


                <button
                    type="button"
                    class="btn btn-excluir"
                    data-acao="excluir"
                    data-id="${agendamento.id}"
                >
                    🗑 Excluir
                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   EVENTOS DOS BOTÕES
========================================================= */

function adicionarEventosAgendamentos() {

    document
        .querySelectorAll(
            "[data-acao]"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                async () => {

                    const id =
                        botao.dataset.id;

                    const acao =
                        botao.dataset.acao;


                    if (
                        acao === "ver"
                    ) {

                        abrirDetalhes(id);

                        return;

                    }


                    if (
                        acao === "confirmar"
                    ) {

                        await alterarStatus(
                            id,
                            "confirmado"
                        );

                        return;

                    }


                    if (
                        acao === "cancelar"
                    ) {

                        await alterarStatus(
                            id,
                            "cancelado"
                        );

                        return;

                    }


                    if (
                        acao === "excluir"
                    ) {

                        await excluirAgendamento(
                            id
                        );

                        return;

                    }

                }
            );

        });

}


/* =========================================================
   ALTERAR STATUS
========================================================= */

async function alterarStatus(
    id,
    novoStatus
) {

    const texto =
        novoStatus === "confirmado"
            ? "confirmar"
            : "cancelar";


    const confirmacao =
        confirm(
            `Deseja ${texto} este agendamento?`
        );


    if (!confirmacao) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("agendamentos")
                .update({
                    status: novoStatus
                })
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        /* =================================================
           ATUALIZA LOCALMENTE
        ================================================= */

        agendamentos =
            agendamentos.map(
                item => {

                    if (
                        String(item.id) ===
                        String(id)
                    ) {

                        return {
                            ...item,
                            status:
                                novoStatus
                        };

                    }


                    return item;

                }
            );


        atualizarCards();

        renderizarAgendamentos();


    } catch (erro) {

        console.error(
            "Erro ao alterar status:",
            erro
        );


        alert(
            "Não foi possível alterar o status."
        );

    }

}


/* =========================================================
   EXCLUIR AGENDAMENTO
========================================================= */

async function excluirAgendamento(
    id
) {

    const confirmacao =
        confirm(
            "Tem certeza que deseja excluir este agendamento?"
        );


    if (!confirmacao) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("agendamentos")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        /* =================================================
           REMOVE DA LISTA LOCAL
        ================================================= */

        agendamentos =
            agendamentos.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );


        atualizarCards();

        renderizarAgendamentos();


        alert(
            "Agendamento excluído com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao excluir agendamento:",
            erro
        );


        alert(
            "Não foi possível excluir o agendamento.\n\n" +
            "Verifique as políticas RLS do Supabase."
        );

    }

}


/* =========================================================
   ABRIR DETALHES
========================================================= */

function abrirDetalhes(id) {

    const agendamento =
        agendamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!agendamento) {
        return;
    }


    const detalhes =
        document.getElementById(
            "detalhesAgendamento"
        );


    if (!detalhes) {
        return;
    }


    const whatsappOriginal =
        String(
            agendamento.whatsapp ||
            ""
        );


    const telefone =
        limparTelefone(
            whatsappOriginal
        );


    const mensagemWhatsApp =
        encodeURIComponent(
            `Olá! Aqui é a Tia Mari. Estou entrando em contato sobre o seu agendamento.`
        );


    const whatsappHTML =
        telefone.length >= 10
            ?
            `
            <a
                href="https://wa.me/${telefone}?text=${mensagemWhatsApp}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-whatsapp-modal"
            >
                💬 Falar no WhatsApp
            </a>
            `
            :
            `
            <div class="whatsapp-indisponivel">
                WhatsApp não informado
            </div>
            `;


    detalhes.innerHTML = `

        <div class="detalhe">
            <strong>Nome</strong>

            <span>
                ${escaparHTML(
                    agendamento.nome ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>WhatsApp</strong>

            <span>
                ${escaparHTML(
                    whatsappOriginal ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Data da festa</strong>

            <span>
                ${formatarData(
                    agendamento.data_evento
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Horário</strong>

            <span>
                ${escaparHTML(
                    agendamento.horario ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Tipo de evento</strong>

            <span>
                ${escaparHTML(
                    agendamento.tipo_evento ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Serviço</strong>

            <span>
                ${escaparHTML(
                    agendamento.servico ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Mensagem</strong>

            <span>
                ${escaparHTML(
                    agendamento.mensagem ||
                    agendamento.descricao ||
                    "--"
                )}
            </span>
        </div>


        <div class="detalhe">
            <strong>Status</strong>

            <span class="status status-${normalizarStatus(
                agendamento.status
            )}">
                ${textoStatus(
                    agendamento.status
                )}
            </span>
        </div>


        <div class="modal-whatsapp-area">

            ${whatsappHTML}

        </div>

    `;


    const modal =
        document.getElementById(
            "modalDetalhes"
        );


    if (modal) {

        modal.classList.add(
            "aberto"
        );

        document.body.classList.add(
            "modal-aberto"
        );

    }

}


/* =========================================================
   LIMPAR TELEFONE
========================================================= */

function limparTelefone(
    telefone
) {

    let numero =
        String(
            telefone || ""
        )
        .replace(
            /\D/g,
            ""
        );


    /*
       Se já vier com 55,
       não adicionamos novamente.
    */

    if (
        numero.startsWith("55")
    ) {

        return numero;

    }


    /*
       Número brasileiro comum.
       Adiciona o código do Brasil.
    */

    if (
        numero.length >= 10 &&
        numero.length <= 11
    ) {

        return "55" + numero;

    }


    return numero;

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    const modal =
        document.getElementById(
            "modalDetalhes"
        );


    if (modal) {

        modal.classList.remove(
            "aberto"
        );

    }


    document.body.classList.remove(
        "modal-aberto"
    );

}


/* =========================================================
   SAIR
========================================================= */

async function sair() {

    try {

        await supabaseClient
            .auth
            .signOut();

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

    }


    window.location.href =
        "login.html";

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

    if (!data) {
        return "--";
    }


    const partes =
        String(data).split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return `
        ${partes[2]}/${partes[1]}/${partes[0]}
    `;

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escaparHTML(valor) {

    return String(valor)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}
/* =====================================================
   BOTÃO LIMPAR BUSCA
===================================================== */

function atualizarBotaoLimparBusca() {

    const botao =
        document.getElementById(
            "limparBusca"
        );


    if (!botao) {
        return;
    }


    if (termoBusca) {

        botao.classList.add(
            "visivel"
        );

    } else {

        botao.classList.remove(
            "visivel"
        );

    }

}