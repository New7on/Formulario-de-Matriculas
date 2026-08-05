/* ============================================================================
   1) CHUVA DE CORAÇÕES
   Cria vários emojis de coração, cada um com posição, tamanho, velocidade
   e atraso aleatórios, e os joga na tela para caírem (a animação de queda
   em si está definida no estilo.css, na classe .coracao-chuva).
   ============================================================================ */
const emojisDeCoracao = ['💖','💗','💓','💞','💕','❤️','🩷','💝','💜','💘'];
const quantidadeDeCoracoes = 35; // <-- mude esse número para ter mais ou menos chuva de corações

function criarChuvaDeCoracoes(){
  for(let i = 0; i < quantidadeDeCoracoes; i++){
    const coracao = document.createElement('span');
    coracao.classList.add('coracao-chuva');
    coracao.textContent = emojisDeCoracao[Math.floor(Math.random() * emojisDeCoracao.length)];

    // Posição horizontal aleatória (de 0% a 100% da largura da tela)
    coracao.style.left = Math.random() * 100 + 'vw';

    // Tamanho aleatório entre 14px e 34px
    const tamanho = 14 + Math.random() * 20;
    coracao.style.fontSize = tamanho + 'px';

    // Duração da queda aleatória (mais rápido ou mais devagar)
    const duracao = 6 + Math.random() * 8; // entre 6s e 14s
    coracao.style.animationDuration = duracao + 's';

    // Atraso aleatório para não caírem todos ao mesmo tempo
    coracao.style.animationDelay = (Math.random() * 10) + 's';

    // Opacidade variada, dá profundidade (alguns parecem "mais longe")
    coracao.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);

    document.body.appendChild(coracao);
  }
}
criarChuvaDeCoracoes();


/* ============================================================================
   2) CURSOR PERSONALIZADO (coração rosa) + RASTRO "GHOST"
   Em vez de usar o cursor do sistema (que já escondemos no CSS com
   "cursor: none"), seguimos a posição do mouse com um emoji de coração,
   e a cada movimento deixamos um "fantasminha" (rastro) que vai sumindo
   suavemente, criando aquele efeito de rastro/ghost.
   ============================================================================ */
const cursorCoracao = document.createElement('div');
cursorCoracao.classList.add('cursor-coracao');
const cursorEmoji = { normal: '💗', gato: '😺' };
let emojiAtualCursor = cursorEmoji.normal;
cursorCoracao.textContent = emojiAtualCursor;
document.body.appendChild(cursorCoracao);

let ultimoRastro = 0; // controla o tempo do último rastro criado (para não criar rastro demais)

document.addEventListener('mousemove', (evento) => {
  // Move o coração principal para a posição atual do mouse
  cursorCoracao.style.left = evento.clientX + 'px';
  cursorCoracao.style.top = evento.clientY + 'px';

  // Cria um "rastro" a cada 40ms (evita criar centenas de elementos por segundo)
  const agora = Date.now();
  if(agora - ultimoRastro > 40){
    ultimoRastro = agora;

    const pedacoDoRastro = document.createElement('div');
    pedacoDoRastro.classList.add('rastro');
    pedacoDoRastro.textContent = cursorCoracao.textContent;
    pedacoDoRastro.style.left = evento.clientX + 'px';
    pedacoDoRastro.style.top = evento.clientY + 'px';
    document.body.appendChild(pedacoDoRastro);

    // Remove o elemento do rastro depois que a animação de sumir termina (600ms)
    setTimeout(() => pedacoDoRastro.remove(), 600);
  }

  // Aproveitamos o movimento do mouse para iniciar a música (ver função abaixo)
  iniciarMusica();
});


/* ============================================================================
   3) SPOTIFY EMBED
   Coloca o player do Spotify na página e tenta iniciar assim que o
   navegador permitir. Muitos navegadores ainda exigem interação para som.
   ============================================================================ */
const spotifyIframe = document.querySelector('.spotify-iframe');
let spotifyTentouAutoplay = false;

function iniciarSpotify(){
  if(spotifyTentouAutoplay) return;
  spotifyTentouAutoplay = true;

  if (!spotifyIframe) return;

  // O Spotify embed fornece o player visual. Alguns navegadores podem liberar
  // a reprodução automaticamente quando o iframe receber foco.
  spotifyIframe.focus({ preventScroll: true });
}

// Tenta iniciar o player assim que a página carrega.
window.addEventListener('load', iniciarSpotify);
// Caso o navegador bloqueie o autoplay, o primeiro toque/deslize também conta
// como interação do usuário para tentar liberar o som.
document.addEventListener('mousemove', iniciarSpotify);
document.addEventListener('touchstart', iniciarSpotify);

/* ----------------------------------------------------------------------------
   O Spotify não permite tocar o áudio diretamente com um <audio> de arquivo.
   O embed acima é a forma correta de usar o link da faixa no site.
   ---------------------------------------------------------------------------- */


/* ============================================================================
   4) BOTÃO "NÃO" QUE FOGE DO MOUSE
   Sempre que o mouse chega perto do botão "Não", ele pula para uma
   posição aleatória na tela, tomando cuidado para não cair em cima
   do cartão principal (para não "tampar" os outros elementos).
   ============================================================================ */
const botaoNao = document.getElementById('btn-nao');
const cartaoPrincipal = document.querySelector('.cartao');
let botaoNaoAtivado = false;
let podeTeletransportarNao = true;

function ativarBotaoNao(){
  if(botaoNaoAtivado) return;

  const retanguloBotao = botaoNao.getBoundingClientRect();
  botaoNao.style.position = 'fixed';
  botaoNao.style.top = retanguloBotao.top + 'px';
  botaoNao.style.left = retanguloBotao.left + 'px';
  botaoNaoAtivado = true;
}

function calcularPosicaoAleatoria(){
  const larguraBotao = botaoNao.offsetWidth;
  const alturaBotao = botaoNao.offsetHeight;
  const margemTela = 14;

  const larguraDisponivel = Math.max(0, window.innerWidth - larguraBotao - margemTela * 2);
  const alturaDisponivel = Math.max(0, window.innerHeight - alturaBotao - margemTela * 2);

  return {
    left: margemTela + Math.random() * larguraDisponivel,
    top: margemTela + Math.random() * alturaDisponivel
  };
}

// Move o botão "Não" para uma posição aleatória, longe do cartão principal
function moverBotaoNaoAleatoriamente(){
  ativarBotaoNao();

  const retanguloCartao = cartaoPrincipal.getBoundingClientRect();
  const larguraBotao = botaoNao.offsetWidth;
  const alturaBotao = botaoNao.offsetHeight;
  const margemTela = 14; // garante que o botão apareça totalmente dentro da janela

  botaoNao.style.display = 'inline-block';
  botaoNao.style.visibility = 'visible';
  botaoNao.style.zIndex = '3';

  let novaEsquerda, novoTopo;
  let tentativas = 0;

  do{
    const posicao = calcularPosicaoAleatoria();
    novaEsquerda = posicao.left;
    novoTopo = posicao.top;
    tentativas++;
  } while(
    sobrepoe(novaEsquerda, novoTopo, larguraBotao, alturaBotao, retanguloCartao) &&
    tentativas < 50
  );

  novaEsquerda = Math.min(Math.max(novaEsquerda, margemTela), window.innerWidth - larguraBotao - margemTela);
  novoTopo = Math.min(Math.max(novoTopo, margemTela), window.innerHeight - alturaBotao - margemTela);

  botaoNao.style.left = novaEsquerda + 'px';
  botaoNao.style.top = novoTopo + 'px';
}

// Verifica se um retângulo (o novo lugar do botão) encosta no retângulo do cartão
function sobrepoe(esquerda, topo, largura, altura, retanguloCartao){
  const margem = 25; // uma "folga" extra para o botão não ficar colado no cartão
  return !(
    esquerda + largura + margem < retanguloCartao.left ||
    esquerda - margem > retanguloCartao.right ||
    topo + altura + margem < retanguloCartao.top ||
    topo - margem > retanguloCartao.bottom
  );
}

// O botão "Não" se teletransporta assim que o cursor toca nele.
botaoNao.addEventListener('mouseenter', () => {
  if (!podeTeletransportarNao) return;
  podeTeletransportarNao = false;
  moverBotaoNaoAleatoriamente();
  setTimeout(() => {
    podeTeletransportarNao = true;
  }, 50);
});

botaoNao.addEventListener('click', (evento) => {
  evento.preventDefault();
  evento.stopImmediatePropagation();

  tentativasNao += 1;
  if (tentativasNao >= 3) {
    botaoNao.style.display = 'none';
    mostrarPopupImagem();
  }
});

function mostrarPopupImagem(){
  if (document.querySelector('.popup-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  const popup = document.createElement('div');
  popup.className = 'popup-conteudo';

  const imagem = document.createElement('img');
  imagem.className = 'popup-imagem';
  imagem.alt = 'Popup';
  imagem.src = 'popup-foto.png'; // Coloque aqui o nome do arquivo da foto no mesmo diretório
  imagem.onerror = () => {
    imagem.alt = 'Foto não encontrada. Coloque um arquivo chamado popup-foto.png na pasta.';
    imagem.style.display = 'none';
    const aviso = document.createElement('div');
    aviso.className = 'popup-aviso';
    aviso.textContent = 'Foto não encontrada. Salve sua foto como popup-foto.png na pasta do projeto.';
    popup.appendChild(aviso);
  };

  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'popup-fechar';
  botaoFechar.textContent = 'Fechar';
  botaoFechar.addEventListener('click', () => {
    overlay.remove();
  });

  popup.appendChild(imagem);
  popup.appendChild(botaoFechar);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
};


/* ============================================================================
   5) CLIQUE NO BOTÃO "SIM"
   Mostra uma mensagem final carinhosa, troca o título e inicia fogos.
   ============================================================================ */
const botaoSim = document.getElementById('btn-sim');
const mensagemFinal = document.getElementById('mensagem-final');
const areaOpcoes = document.querySelector('.opcoes');
const observacaoTexto = document.querySelector('.observacao');
const titulo = document.querySelector('.titulo');

function limparChuvaDeCoracoes(){
  document.querySelectorAll('.coracao-chuva').forEach(coracao => coracao.remove());
}

function explodirFogo(){
  const coresFogos = ['#FF5F85', '#FFD166', '#FB8B24', '#80FFDB', '#6C5CE7', '#FF6B6B'];
  const centroX = 100 + Math.random() * (window.innerWidth - 200);
  const centroY = 100 + Math.random() * (window.innerHeight - 200);
  const particulas = 14 + Math.floor(Math.random() * 8);

  for(let i = 0; i < particulas; i++){
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 80 + Math.random() * 80;
    const cor = coresFogos[Math.floor(Math.random() * coresFogos.length)];

    const particula = document.createElement('div');
    particula.className = 'fogo-particula';
    particula.style.left = centroX + 'px';
    particula.style.top = centroY + 'px';
    particula.style.backgroundColor = cor;
    particula.style.width = 6 + Math.random() * 10 + 'px';
    particula.style.height = 6 + Math.random() * 10 + 'px';
    particula.style.setProperty('--dx', Math.cos(angulo) * distancia + 'px');
    particula.style.setProperty('--dy', Math.sin(angulo) * distancia + 'px');
    document.body.appendChild(particula);

    setTimeout(() => particula.remove(), 1400);
  }
}

let fogosIntervalId = null;
function iniciarFogos(){
  limparChuvaDeCoracoes();
  explodirFogo();
  fogosIntervalId = setInterval(explodirFogo, 900);
}

botaoSim.addEventListener('click', () => {
  titulo.textContent = 'Finalmente!';
  areaOpcoes.style.display = 'none';
  observacaoTexto.style.display = 'none';
  mensagemFinal.style.display = 'block';
  emojiAtualCursor = cursorEmoji.gato;
  cursorCoracao.textContent = emojiAtualCursor;
  cursorCoracao.classList.add('cursor-gato');
  if (!fogosIntervalId) iniciarFogos();
});