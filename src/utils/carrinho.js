// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

function arredondarValor(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100
}

export function calcularTotal(carrinho) {
  const total = carrinho.reduce((soma, produto) => {
    const preco = Number(produto?.price)
    return soma + (Number.isFinite(preco) ? preco : 0)
  }, 0)

  return arredondarValor(total)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
