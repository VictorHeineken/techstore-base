export const LIMITE_FRETE_GRATIS = 200

export function produtoTemPrecoValido(produto) {
    return Boolean(produto) && typeof produto.price === 'number' && Number.isFinite(produto.price)
}

export function produtoDisponivel(produto) {
    return produtoTemPrecoValido(produto) && Number(produto.estoque) > 0
}

export function temFreteGratis(valor) {
    return (Number(valor) || 0) >= LIMITE_FRETE_GRATIS
}

export function calcularFaltanteFrete(valor) {
    const total = Number(valor) || 0
    return temFreteGratis(total) ? 0 : LIMITE_FRETE_GRATIS - total
}
