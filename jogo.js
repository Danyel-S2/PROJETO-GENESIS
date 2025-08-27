// CONEXÃO DO JS COM HTML
// Primeiro de tudo é preciso conectar o html com o js, para isso vou usar 3 funções, uma para conectar o canvas (espaço para a interface do jogo) do html que chamei de "canvas" mesmo, dentro dela eu usei uma função nativa do js "getElementById" que vai percorrer todo o documento do html a procura do id que passei como parâmetro, no caso, o canvas que dei o id de "jogo".     Agora que a função canvas ja está conectada, vou usar uma função chamada "ctx", que dentro dela tem uma função também nativa do js "getContext" que dentro do parâmetro dela é passado o contexto do espaço do canvas que coloquei "2d".     E por último a função "placarEL", dentro dela coloquei novavemente a função(getElementeById), mas dessa vez para conectar a tag do html que vai mostrar o placar do jogo, que dei o id de "placar".
const canvas = document.getElementById("jogo")
const ctx = canvas.getContext("2d")
const placarEl = document.getElementById("placar")

// ESTADO INICIAL DO JOGO
// A função "estadoInicial" ela tem o objetivo de definir o estado inicial do jogo, para isso eu criei 3 registros: bola, cesta e pontos. registros como bola e cesta tem dados correspondentes a sua posição e ação no inicio do jogo. Já o registro chamado pontos, vai armazenar a pontuação do jogador começando em 0.
const estadoInicial = {
  bola: { x: 250, y: 460, r: 15, vy: 0, lancada: false },
  cesta: { x: 200, y: 50, w: 100, h: 10, vx: 2 },
  pontos: 0,
  erros: 0,
  mensagem: "" // mensagem de fim de jogo
}

// Fila de ações (imutável dentro do loop, só o browser empilha eventos aqui)
let filaAcoes = []

// FUNÇÃO PARA DESENHAR O JOGO
// Aqui criei uma função chamada "desenhar" que basicamente vai me permitir desenhar os componentes do jogo no canvas. Essa função possui 2 parâmetros, um é o contexto, onde vou desenhar os elemntos em 2d, e o outro é o estado que vai determinar onde e quando o elemento vai ser desenhado. Agora vamos para o que essa função faz na prática. Primeiro para desenhar no canvas é preciso apagar todo o espaço que foi criado, para isso usei a função nativa do js "clearRect" que é a responsável por limpar uma área que é definida por 4 parâmetros, o primeiro e o segundo são cordenadas x e y, que é de onde vai começara limpar, já os outros 2 vão ser a largura e altura da área que vai ser limpa, no caso, o canvas inteiro.      Para conseguir desenhar a cesta de basquete, eu usei 2 funções nativas do js, a primeira é a "fillStyle", ela basicamente da cor ao elemento que eu criar em seguida, no caso, a cesta de baquete. A segunda função é a "fillRect", essa função criar um retângulo baseado em 4 parâmetros, o primeiro e o segundo são as coordenadas x e y, que eu coloquei baseadas no estado e nos dados da coordenada da cesta, já o outros 2 são a largura e altura que coloquei tambèm baseados no registro da cesta.      Agora vanos para a bola. Para fazer a bola de basquete, diferente do outro elemento, aqui eu vou precisar uma função nativa do js chamada "beginPath", que vai dar inicio ao processo de um novo desenho, para o outro não é preciso porque é um retângulo. Depois disso, eu usei a função que ja foi usada antes "fillStyle" que deine a cor da bola, e em seguida usei a função nativa do js "arc", que vai desenhar um círculo baseado em 6 parâmetros, os 2 priemiros coordenada, o terceiro o raio do círculo, e os 2 últimos são os ângulos de início e fim do círculo, o primeiro 0 e o segundo coloquei Math.Pi * 2, que seria 180 * 2 = 360, formando um círculo completo.      Pra finalizar, só falta desenhar o placar de pontos, para isso usei a função nativa do js "textContent" que cria um texto de acordo com o que eu defini, no caso, defini uma string contatenada ao estado de pontos do jogo, que defini lá no estado inicial do jogo.
const desenhar = (ctx, estado) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "blue"
  ctx.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.w, estado.cesta.h)
 
// Desenho da rede na cesta
ctx.strokeStyle = "silver"; // Cor prata
ctx.lineWidth = 2;          // linhas

let xInicio = estado.cesta.x;
let yInicio = estado.cesta.y + estado.cesta.h;

ctx.beginPath();

// Desenho de linhas diagonais formando padrão de corrente
for (let i = 0; i <= estado.cesta.w; i += 20) {
  // Linha pendente para a esquerda
  ctx.moveTo(xInicio + i, yInicio);
  ctx.lineTo(xInicio + i - 10, yInicio + 40);

  // Linha pendente para a direita
  ctx.moveTo(xInicio + i, yInicio);
  ctx.lineTo(xInicio + i + 10, yInicio + 40);
}

ctx.stroke();
  ctx.beginPath()
  ctx.arc(estado.bola.x, estado.bola.y, estado.bola.r, 0, Math.PI * 2) // corrigido Math.PI
  ctx.fillStyle = "red"
  ctx.fill()

  placarEl.textContent = "Pontos: " + estado.pontos + " | Erros: " + estado.erros

  // Exibir mensagem caso exista
  if (estado.mensagem) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(estado.mensagem, canvas.width / 2 - 70, canvas.height / 2);
  }
}

// FUNÇÃO DE ATUALIZAÇÃO
const atualizar = (estado) => {
  // Movimento da cesta
  const novaX = estado.cesta.x + estado.cesta.vx
  const novoVx =
    novaX + estado.cesta.w > canvas.width || novaX < 0
      ? -estado.cesta.vx
      : estado.cesta.vx

  const cestaCorrigida = {
    ...estado.cesta,
    x: Math.min(Math.max(novaX, 0), canvas.width - estado.cesta.w),
    vx: novoVx
  }

  if (!estado.bola.lancada) {
    return { ...estado, cesta: cestaCorrigida }
  }

  // Movimento da bola
  const novaY = estado.bola.y + estado.bola.vy
  const novaVy = estado.bola.vy + 0.5

  const dentroCesta =
    estado.bola.x > cestaCorrigida.x &&
    estado.bola.x < cestaCorrigida.x + cestaCorrigida.w &&
    novaY < cestaCorrigida.y + cestaCorrigida.h &&
    novaY > cestaCorrigida.y - estado.bola.r

  if (dentroCesta) {
    return {
      ...estado,
      cesta: cestaCorrigida,
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false },
      pontos: estado.pontos + 1
    }
  }

  if (novaY > 460) {
    const novosErros = estado.erros + 1;

    if (novosErros >= 5) {
      // Exibe mensagem antes de reiniciar
      return {
        ...estado,
        mensagem: "Game Over",
        erros: novosErros
      };
    }

    return {
      ...estado,
      cesta: cestaCorrigida,
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false },
      erros: novosErros
    }
  }

  return {
    ...estado,
    cesta: cestaCorrigida,
    bola: {
      ...estado.bola,
      y: novaY,
      vy: novaVy,
    }
  }
}

// FUNÇÃO PURA: Deve lançar a bola
// Essa função recebe o estado atual do jogo e verifica se a bola ainda não foi lançada.
// Se ainda não foi, ela retorna um novo objeto de estado, copiando tudo que já existia,
// mas alterando os atributos da bola como vy (velocidade vertical: -15) e marcando lancada como true.
const lancar = (estado) =>
  !estado.bola.lancada
    ? { ...estado, bola: { ...estado.bola, vy: -20, lancada: true } }
    : estado

// FUNÇÃO LOOP: Controla o ciclo principal do jogo
// Essa função recebe o estado atual do jogo e executa o ciclo de um frame.
// Primeiro, verifica se existe alguma ação pendente na fila (como o clique para lançar a bola). 
// Caso exista, aplica essa ação sobre o estado; caso não exista, usa a função identidade, mantendo o estado igual.
// Depois disso, chama a função atualizar, que aplica as regras automáticas do jogo (como gravidade e movimento).
// Em seguida, chama a função desenhar, que renderiza o estado atual no canvas.
// Por fim, usa requestAnimationFrame para agendar a chamada recursiva do loop com o novo estado, garantindo que o jogo continue rodando continuamente.
   const loop = (estado) => {

  if (estado.mensagem === "Game Over") {
    desenhar(ctx, estado);
    setTimeout(() => {
      filaAcoes = [] // limpa ações pendentes
      loop({ ...estadoInicial }) // reinicia do zero
    }, 2000);
    return;
  }

  const acao = filaAcoes.shift() || ((s) => s);
  const depoisAcao = acao(estado);
  const novoEstado = atualizar(depoisAcao);
  desenhar(ctx, novoEstado);
  requestAnimationFrame(() => loop(novoEstado));
}

// EVENTO: só empilha ação
canvas.addEventListener("click", () => {
  filaAcoes.push(lancar)
})

// EVENTO: lançar a bola com a tecla espaço
// Adicionei essa função para que possa utilizar a tecla espaço para lançar a bola, problema o qual o orientador sugeriu para melhor eficácia
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();      // evita rolagem da página
    if (!event.repeat) {         // evita empilhar várias ações segurando a tecla
      filaAcoes.push(lancar);
    }
  }
})

// INICIAR passando o estado inicial do jogo
loop(estadoInicial)
