// CONEXÃO DO JS COM HTML
// Primeiro de tudo é preciso conectar o html com o js, para isso vou usar 3 funções, uma para conectar o canvas (espaço para a interface do jogo) do html que chamei de "canvas" mesmo, dentro dela eu usei uma função nativa do js "getElementById" que vai percorrer todo o documento do html a procura do id que passei como parâmetro, no caso, o canvas que dei o id de "jogo".     Agora que a função canvas ja está conectada, vou usar uma função chamada "contexto", que dentro dela tem uma função também nativa do js "getContext" que dentro do parâmetro dela é passado o contexto do espaço do canvas que coloquei "2d".     E por último a função "placar", dentro dela coloquei novavemente a função(getElementeById), mas dessa vez para conectar a tag do html que vai mostrar o placar do jogo, que dei o id de "placar".

const canvas = document.getElementById("jogo")
const contexto = canvas.getContext("2d")
const placar = document.getElementById("placar")

// ESTADO INICIAL DO JOGO
// A função "estadoInicial" ela tem o objetivo de definir o estado inicial do jogo, para isso eu criei 3 registros: bola, cesta e pontos. registros como bola e cesta tem dados correspondentes a sua posição e ação no inicio do jogo. Já o registro chamado pontos, vai armazenar a pontuação do jogador começando em 0.

const estadoInicial = {
  bola: { x: 250, y: 460, raio: 15, velocidade: 0, lancada: false },
  cesta: { x: 200, y: 50, largura: 100, altura: 10, velocidade: 2 },
  pontos: 0
}

// FUNÇÃO PARA DESENHAR O JOGO
// Aqui criei uma função chamada "desenhar" que basicamente vai me permitir desenhar os componentes do jogo no canvas. Essa função possui 2 parâmetros, um é o contexto, onde vou desenhar os elemntos em 2d, e o outro é o estado que vai determinar onde e quando o elemento vai ser desenhado. Agora vamos para o que essa função faz na prática. Primeiro para desenhar no canvas é preciso apagar todo o espaço que foi criado, para isso usei a função nativa do js "clearRect" que é a responsável por limpar uma área que é definida por 4 parâmetros, o primeiro e o segundo são cordenadas x e y, que é de onde vai começara limpar, já os outros 2 vão ser a largura e altura da área que vai ser limpa, no caso, o canvas inteiro.      Para conseguir desenhar a cesta de basquete, eu usei 2 funções nativas do js, a primeira é a "fillStyle", ela basicamente da cor ao elemento que eu criar em seguida, no caso, a cesta de baquete. A segunda função é a "fillRect", essa função criar um retângulo baseado em 4 parâmetros, o primeiro e o segundo são as coordenadas x e y, que eu coloquei baseadas no estado e nos dados da coordenada da cesta, já o outros 2 são a largura e altura que coloquei tambèm baseados no registro da cesta. Ainda no desenho da cesta, para deixar mais legazinha fiz uma borda usando as funções nativas do js "lineWidth", que vai definir a espessura da borda, a "StrokeStyle", que vai definir a cor da borda, e por útimo a "strokeRect", responsável por o retângulo da borda recebendo 4 parâmetros referentes as coordenas x e y, largura e altura.      Agora vanos para a bola. Para fazer a bola de basquete, diferente dos outros 2 elementos, aqui eu vou precisar uma função nativa do js chamada "beginPath", que vai dar inicio ao processo de um novo desenho, para os outros 2 não é preciso porque são retângulos. Depois disso, eu usei a função que ja foi usada antes "fillStyle" que deine a cor da bola, e em seguida usei a função nativa do js "arc", que vai desenhar um círculo baseado em 6 parâmetros, os 2 priemiros coordenada, o terceiro o raio do círculo, e os 2 últimos são os ângulos de início e fim do círculo, o primeiro 0 e o segundo coloquei Math.Pi * 2, que seria 180 * 2 = 360, formando um círculo completo.      Pra finalizar, só falta desenhar o placar de pontos, para isso usei a função nativa do js "textContent" que cria um texto de acordo com o que eu defini, no caso, defini uma string contatenada ao estado de pontos do jogo, que defini lá no estado inicial do jogo.

const desenhar = (contexto, estado) => {
  contexto.clearRect(0, 0, canvas.width, canvas.height)

  // -------------Cesta de Basquete---------------
  contexto.fillStyle = "blue"
  contexto.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.largura, estado.cesta.altura)

  contexto.lineWidth = 3
  contexto.strokeStyle = "red"
  contexto.strokeRect(201, 51, 100, 10)

  // -------------Bola de basquete---------------
  contexto.beginPath()
  contexto.fillStyle = "red"
  contexto.arc(estado.bola.x, estado.bola.y, estado.bola.raio, 0, Math.PI * 2)
  contexto.fill()

  // -------------Placar de pontos---------------
  placar.textContent = "Pontos: " + estado.pontos
}
function atualizar(estado) {
  // movimento da cesta de um lado pro outro
  let novaX = estado.cesta.x + estado.cesta.vx
  let novoVx = estado.cesta.vx
  if (novaX + estado.cesta.w > canvas.width) {
    novaX = canvas.width - estado.cesta.w
    novoVx *= -1
  }
  if (novaX < 0) {
    novaX = 0
    novoVx *= -1
  }

 if (novaX < 0) {
    novaX = 0
    novoVx *= -1
  }

  if (!estado.bola.lancada) {
    return {
      ...estado,
      cesta: { ...estado.cesta, x: novaX, vx: novoVx }
    }
  }

  const novaY = estado.bola.y + estado.bola.vy
  const novaVy = estado.bola.vy + 0.5

  const dentroCesta =
    estado.bola.x > estado.cesta.x &&
    estado.bola.x < estado.cesta.x + estado.cesta.w &&
    estado.bola.y < estado.cesta.y + estado.cesta.h &&
    estado.bola.y > estado.cesta.y - estado.bola.r
if (dentroCesta) {
    return {
      ...estado,
      cesta: { ...estado.cesta, x: novaX, vx: novoVx },
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false },
      pontos: estado.pontos + 1
    }
  }

  // A bola voltou pro chão
  if (novaY > 460) {
    return {
      ...estado,
      cesta: { ...estado.cesta, x: novaX, vx: novoVx },
      bola: { x: canvas.width / 2, y: 460, r: 15, vy: 0, lancada: false }
    }
  }

  return {
    ...estado,
    cesta: { ...estado.cesta, x: novaX, vx: novoVx },
    bola: { ...estado.bola, y: novaY, vy: novaVy, lancada: true }
  }
}
// Função pura: Deve lançar a bola
const lancar = (estado) => {
  if (!estado.bola.lancada) {
    return {
      ...estado,
      bola: { ...estado.bola, velocidade: -20, lancada: true }
    };
  }
  return estado;
};

let estado = estadoInicial;

// Loop do jogo
const loop = () => {
  estado = atualizar(estado);
  desenhar(contexto, estado);
  requestAnimationFrame(loop);
};
loop();

// clique → lança a bola
canvas.addEventListener("click", () => {
  estado = lancar(estado);
