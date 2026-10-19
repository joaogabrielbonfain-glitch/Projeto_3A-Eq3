"use strict";

/* =====================================================
   1. DADOS
   ===================================================== */

// Lista de gêneros mostrada no painel "Biblioteca Virtual"
const GENEROS = [
  "Livros Infantis",
  "Livros Didáticos",
  "Livros de Cursos",
  "Livros Religiosos",
  "Livros de Receitas",
  "Livros de Romance",
  "Livros de Ação e Aventura",
  "Livros das Ciências Exatas",
  "Livros das Ciências Humanas",
  "Livros das Ciências Biológicas",
  "Livros da Literatura de Cordel",
  "Livros da Literatura Brasileira",
  "Livros da Literatura Estrangeira",
];

// Cada linha: [título, autor, gênero, nota de 1 a 5]
// Troque por seus próprios livros (ou carregue de uma API depois).
const livros = [
  ["Senhora", "José de Alencar", "Livros da Literatura Brasileira", 4],
  ["O Alienista", "Machado de Assis", "Livros da Literatura Brasileira", 5],
  ["Dom Casmurro", "Machado de Assis", "Livros da Literatura Brasileira", 5],
  ["Iracema", "José de Alencar", "Livros da Literatura Brasileira", 4],
  ["O Cortiço", "Aluísio Azevedo", "Livros da Literatura Brasileira", 4],
  ["Memórias Póstumas de Brás Cubas", "Machado de Assis", "Livros da Literatura Brasileira", 5],
  ["A Volta ao Mundo em Oitenta Dias", "Júlio Verne", "Livros de Ação e Aventura", 5],
  ["Vinte Mil Léguas Submarinas", "Júlio Verne", "Livros de Ação e Aventura", 4],
  ["A Ilha do Tesouro", "R. L. Stevenson", "Livros de Ação e Aventura", 4],
  ["Os Três Mosqueteiros", "Alexandre Dumas", "Livros de Ação e Aventura", 5],
  ["Orgulho e Preconceito", "Jane Austen", "Livros de Romance", 5],
  ["Romeu e Julieta", "William Shakespeare", "Livros de Romance", 4],
  ["Persuasão", "Jane Austen", "Livros de Romance", 3],
  ["Drácula", "Bram Stoker", "Livros da Literatura Estrangeira", 4],
  ["Frankenstein", "Mary Shelley", "Livros da Literatura Estrangeira", 4],
  ["Crime e Castigo", "Dostoiévski", "Livros da Literatura Estrangeira", 5],
  ["O Retrato de Dorian Gray", "Oscar Wilde", "Livros da Literatura Estrangeira", 5],
  ["Alice no País das Maravilhas", "Lewis Carroll", "Livros Infantis", 5],
  ["O Pequeno Príncipe", "Antoine de Saint-Exupéry", "Livros Infantis", 5],
  ["Peter Pan", "J. M. Barrie", "Livros Infantis", 4],
  ["A Origem das Espécies", "Charles Darwin", "Livros das Ciências Biológicas", 4],
  ["Os Elementos", "Euclides", "Livros das Ciências Exatas", 3],
  ["O Príncipe", "Maquiavel", "Livros das Ciências Humanas", 4],
  ["A República", "Platão", "Livros das Ciências Humanas", 4],
  ["Folhetos de Cordel", "Antologia popular", "Livros da Literatura de Cordel", 3],
  ["Quincas Borba", "Machado de Assis", "Livros da Literatura Brasileira", 4],
  ["A Moreninha", "Joaquim M. de Macedo", "Livros de Romance", 3],
  ["Moby Dick", "Herman Melville", "Livros de Ação e Aventura", 4],
  ["O Guarani", "José de Alencar", "Livros da Literatura Brasileira", 4],
  ["Hamlet", "William Shakespeare", "Livros da Literatura Estrangeira", 5],
].map(([titulo, autor, genero, nota], i) => ({ id: i + 1, titulo, autor, genero, nota }));

// Livros disponíveis para troca. Vazio = mostra a mensagem da Tela 4.
const trocas = [];

/* =====================================================
   2. FUNÇÕES AUXILIARES
   ===================================================== */

// Cria um elemento HTML de forma segura (textContent evita injeção de HTML)
function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// Capa gerada por código: cor depende do id do livro
function criarCapa(livro) {
  const capa = el("div", "capa");
  const matiz = (livro.id * 47) % 360;
  capa.style.background =
    `linear-gradient(160deg, hsl(${matiz} 60% 35%), hsl(${(matiz + 40) % 360} 70% 18%))`;
  capa.title = `${livro.titulo} – ${livro.autor}`;
  capa.append(el("span", "capa-titulo", livro.titulo), el("span", "capa-autor", livro.autor));
  return capa;
}

function criarEstrelas(nota) {
  const e = el("div", "estrelas", "★".repeat(nota) + "☆".repeat(5 - nota));
  e.setAttribute("aria-label", `${nota} de 5 estrelas`);
  return e;
}

/* =====================================================
   3. TELAS DO APLICATIVO
   ===================================================== */

// Tela 2: livros populares (ordenados pela nota)
function renderLivros(container) {
  container.append(el("h2", "titulo-secao", "populares do momento"));

  const grade = el("div", "grade");
  [...livros]
    .sort((a, b) => b.nota - a.nota)
    .forEach((livro) => {
      const item = el("div", "item-livro");
      item.append(criarCapa(livro), criarEstrelas(livro.nota));
      grade.append(item);
    });
  container.append(grade);
}

// Tela 3: gêneros, com lista lateral e carrossel de 3 livros por página
function renderGeneros(container) {
  const POR_PAGINA = 3;
  let generoAtual = "Livros da Literatura Brasileira";
  let pagina = 0;

  const layout = el("div", "generos-layout");
  const painel = el("aside", "biblioteca");
  const vitrine = el("section", "vitrine");

  painel.append(el("h3", "", "Biblioteca Virtual"));
  const lista = el("ul");
  const botoes = GENEROS.map((nome) => {
    const li = el("li");
    const b = el("button", "", nome);
    b.type = "button";
    b.addEventListener("click", () => {
      generoAtual = nome;
      pagina = 0;
      atualizar();
    });
    li.append(b);
    lista.append(li);
    return b;
  });
  painel.append(lista);

  function atualizar() {
    botoes.forEach((b) => b.classList.toggle("ativo", b.textContent === generoAtual));
    vitrine.replaceChildren();

    const doGenero = livros.filter((l) => l.genero === generoAtual);
    if (doGenero.length === 0) {
      vitrine.append(el("p", "aviso", "Nenhum livro neste gênero ainda."));
      return;
    }

    const totalPaginas = Math.ceil(doGenero.length / POR_PAGINA);
    const faixa = el("div", "faixa");
    doGenero
      .slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)
      .forEach((livro) => {
        const card = el("article", "card-livro");
        card.append(
          criarCapa(livro),
          el("p", "card-titulo", `${livro.titulo} – ${livro.autor}`),
          el("p", "card-status", "Disponível")
        );
        faixa.append(card);
      });

    const anterior = el("button", "", "‹");
    anterior.type = "button";
    anterior.disabled = pagina === 0;
    anterior.setAttribute("aria-label", "Página anterior");
    anterior.addEventListener("click", () => { pagina--; atualizar(); });

    const proximo = el("button", "", "›");
    proximo.type = "button";
    proximo.disabled = pagina >= totalPaginas - 1;
    proximo.setAttribute("aria-label", "Próxima página");
    proximo.addEventListener("click", () => { pagina++; atualizar(); });

    const pontos = el("div", "pontos");
    for (let i = 0; i < totalPaginas; i++) {
      pontos.append(el("span", i === pagina ? "ponto ativo" : "ponto"));
    }

    const controles = el("div", "controles");
    controles.append(anterior, pontos, proximo);
    vitrine.append(faixa, controles);
  }

  layout.append(painel, vitrine);
  container.append(layout);
  atualizar();
}

// Tela 4: trocas (mensagem quando não há nada)
function renderTrocas(container) {
  if (trocas.length === 0) {
    container.append(
      el("p", "aviso", "Nenhum livro disponível para troca no momento, tente novamente mais tarde.")
    );
    return;
  }
  const grade = el("div", "grade");
  trocas.forEach((livro) => {
    const item = el("div", "item-livro");
    item.append(criarCapa(livro));
    grade.append(item);
  });
  container.append(grade);
}

/* =====================================================
   4. NAVEGAÇÃO ENTRE AS ABAS
   ===================================================== */

const telas = { livros: renderLivros, generos: renderGeneros, trocas: renderTrocas };
const conteudo = document.getElementById("conteudo");
const botoesMenu = document.querySelectorAll(".menu button");

function mostrarAba(nome) {
  conteudo.replaceChildren();
  telas[nome](conteudo);
  botoesMenu.forEach((b) => b.classList.toggle("ativo", b.dataset.aba === nome));
}

botoesMenu.forEach((b) => b.addEventListener("click", () => mostrarAba(b.dataset.aba)));

/* =====================================================
   5. LOGIN
   ===================================================== */

const telaLogin = document.getElementById("tela-login");
const app = document.getElementById("app");
const formLogin = document.getElementById("form-login");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const erroLogin = document.getElementById("erro-login");

function entrarNoApp() {
  telaLogin.classList.add("oculto");
  app.classList.remove("oculto");
  mostrarAba("livros");
}

function sairDoApp() {
  sessionStorage.removeItem("blucsUsuario");
  app.classList.add("oculto");
  telaLogin.classList.remove("oculto");
  formLogin.reset();
  erroLogin.textContent = "";
}

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const usuario = campoUsuario.value.trim();
  const senha = campoSenha.value;

  // Validação simples de demonstração.
  // Um login de verdade precisa de um servidor para conferir usuário e senha.
  if (usuario.length < 3) {
    erroLogin.textContent = "Digite seu nome de usuário ou gmail.";
    campoUsuario.focus();
    return;
  }
  if (senha.length < 4) {
    erroLogin.textContent = "A senha precisa ter pelo menos 4 caracteres.";
    campoSenha.focus();
    return;
  }

  erroLogin.textContent = "";
  try { sessionStorage.setItem("blucsUsuario", usuario); } catch (e) { /* ignora */ }
  entrarNoApp();
});

document.getElementById("esqueceu").addEventListener("click", () => {
  alert("Em breve: recuperação de senha por e-mail.");
});
document.getElementById("sair").addEventListener("click", sairDoApp);

// Se já fez login nesta sessão, pula direto para o app
try {
  if (sessionStorage.getItem("blucsUsuario")) entrarNoApp();
} catch (e) { /* ignora */ }
