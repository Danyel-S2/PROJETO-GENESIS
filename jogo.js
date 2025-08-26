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
  pontos: 0
}

// Fila de ações (imutável dentro do loop, só o browser empilha eventos aqui)
let filaAcoes = []

// FUNÇÃO PARA DESENHAR O JOGO
// Aqui criei uma função chamada "desenhar" que basicamente vai me permitir desenhar os componentes do jogo no canvas. Essa função possui 2 parâmetros, um é o contexto, onde vou desenhar os elemntos em 2d, e o outro é o estado que vai determinar onde e quando o elemento vai ser desenhado. Agora vamos para o que essa função faz na prática. Primeiro para desenhar no canvas é preciso apagar todo o espaço que foi criado, para isso usei a função nativa do js "clearRect" que é a responsável por limpar uma área que é definida por 4 parâmetros, o primeiro e o segundo são cordenadas x e y, que é de onde vai começara limpar, já os outros 2 vão ser a largura e altura da área que vai ser limpa, no caso, o canvas inteiro.      Para conseguir desenhar a cesta de basquete, eu usei 2 funções nativas do js, a primeira é a "fillStyle", ela basicamente da cor ao elemento que eu criar em seguida, no caso, a cesta de baquete. A segunda função é a "fillRect", essa função criar um retângulo baseado em 4 parâmetros, o primeiro e o segundo são as coordenadas x e y, que eu coloquei baseadas no estado e nos dados da coordenada da cesta, já o outros 2 são a largura e altura que coloquei tambèm baseados no registro da cesta.      Agora vanos para a bola. Para fazer a bola de basquete, diferente do outro elemento, aqui eu vou precisar uma função nativa do js chamada "beginPath", que vai dar inicio ao processo de um novo desenho, para o outro não é preciso porque é um retângulo. Depois disso, eu usei a função que ja foi usada antes "fillStyle" que deine a cor da bola, e em seguida usei a função nativa do js "arc", que vai desenhar um círculo baseado em 6 parâmetros, os 2 priemiros coordenada, o terceiro o raio do círculo, e os 2 últimos são os ângulos de início e fim do círculo, o primeiro 0 e o segundo coloquei Math.Pi * 2, que seria 180 * 2 = 360, formando um círculo completo.      Pra finalizar, só falta desenhar o placar de pontos, para isso usei a função nativa do js "textContent" que cria um texto de acordo com o que eu defini, no caso, defini uma string contatenada ao estado de pontos do jogo, que defini lá no estado inicial do jogo.

const desenhar = (ctx, estado) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "blue"
  ctx.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.w, estado.cesta.h)

  ctx.beginPath()
  ctx.arc(estado.bola.x, estado.bola.y, estado.bola.r, 0, Math.PI * 2)
  ctx.fillStyle = "red"
  ctx.fill()

  placarEl.textContent = "Pontos: " + estado.pontos
}

const atualizar = (estado) => {
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

  const novaY = estado.bola.y + estado.bola.vy
  const novaVy = estado.bola.vy + 0.5

  const dentroCesta =
    estado.bola.x > cestaCorrigida.x &&
    estado.bola.x < cestaCorrigida.x + cestaCorrigida.w &&
    estado.bola.y < cestaCorrigida.y + cestaCorrigida.h &&
    estado.bola.y > cestaCorrigida.y - estado.bola.r

  if (dentroCesta) {
    return {
      ...estado,
      cesta: cestaCorrigida,
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false },
      pontos: estado.pontos + 1
    }
  }

  if (novaY > 460) {
    return {
      ...estado,
      cesta: cestaCorrigida,
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false }
    }
  }

  return {
    ...estado,
    cesta: cestaCorrigida,
    bola: { ...estado.bola, y: novaY, vy: novaVy, lancada: true }
  }
}
// Função pura: Deve lançar a bola
//essa função recebe o estado atual do jogo e verifica se a bola ainda não foi lançada. Se ainda não foi ela retorna um novo objeto de estado, copiando tudo oq já existia, mas alterando os atributos da bola como (velocidade: -15). 
const lancar = (estado) =>
  !estado.bola.lancada
    ? { ...estado, bola: { ...estado.bola, vy: -15, lancada: true } }
    : estado
// Loop do jogo
// A função loop recebe o estado atual do jogo como argumento, gera um novo estado (atualizar(estado)), desenha o estado atualizado na tela (canvas)(desenhar(contexto, novoEstado)) e agenda a próxima chamada do loop, passando o novo estado (requestAnimationFrame(() => loop(novoEstado))).
const loop = (estado) => {
  const novoEstado = atualizar(estado)
  desenhar(ctx, novoEstado)
  requestAnimationFrame(() => loop(novoEstado))
}
//Dá o pontapé inicial chamando o loop pela primeira vez, passando o estado inicial do jogo (estadoInicial).
loop(estadoInicial)


// clique → lança a bola
//Escuta cliques no canvas. Quando o jogador clica, chama lancar(estado) para tentar lançar a bola e ainda atualiza a variável estado com o novo estado retornado.(utilizei a variavel pq precisava que essa parte sempre atualiza-se)

canvas.addEventListener("click", () => {
  estado = lancar(estado) })
