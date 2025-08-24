function atualizar(estado) {
  // movimento da cesta
  let novaX = estado.cesta.x + estado.cesta.vx
  let novoVx = estado.cesta.vx
  if (novaX + estado.cesta.w > canvas.width) {
    novaX = canvas.width - estado.cesta.w
    novoVx *= -1
  }
  if (novaX < 0) {
    novaX = 0
    novoVx *= -1
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
