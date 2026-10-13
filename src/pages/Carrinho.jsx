import { useState } from 'react'
import { Link } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { agruparItens, calcularTotal } from '../utils/carrinho'
import { validarCupom } from '../utils/cupons'
import { formatarPreco } from '../utils/formatarPreco'
import { calcularFaltanteFrete, temFreteGratis } from '../utils/produtos'

export default function Carrinho({ carrinho, produtos, clienteAtual, onAdicionar, onRemover }) {
  const [codigoCupom, setCodigoCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(null)
  const [mensagemCupom, setMensagemCupom] = useState('')

  const itens = agruparItens(carrinho)
  const total = calcularTotal(carrinho)
  const totalComDesconto = cupomAplicado ? total * (1 - cupomAplicado.desconto) : total
  const faltanteFrete = calcularFaltanteFrete(totalComDesconto)

  const sugestoes = produtos
    .filter((produto) => !carrinho.find((item) => item.id === produto.id))
    .slice(0, 3)

  function aplicarCupom(evento) {
    evento.preventDefault()
    const resultado = validarCupom(codigoCupom, clienteAtual)

    if (resultado.valido) {
      setCupomAplicado(resultado)
      setMensagemCupom('Cupom aplicado!')
    } else {
      setCupomAplicado(null)
      setMensagemCupom('Cupom inválido')
    }
  }

  if (carrinho.length === 0) {
    return (
      <section>
        <h1>Carrinho</h1>
        <div className="estado-vazio">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="botao botao-secundario">
            Ver produtos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>Carrinho</h1>

      <div className="carrinho-layout">
        <ul className="lista-carrinho">
          {itens.map((item) => (
            <li key={item.produto.id} className="item-carrinho">
              <Link
                to={`/produto/${item.produto.id}`}
                className="item-imagem-moldura"
                aria-label={`Abrir ${item.produto.title}`}
                onClick={(evento) => evento.stopPropagation()}
              >
                <img src={item.produto.image} alt={item.produto.title} />
              </Link>

              <div className="item-info">
                <Link
                  to={`/produto/${item.produto.id}`}
                  className="item-titulo-link"
                  onClick={(evento) => evento.stopPropagation()}
                >
                  <p className="item-titulo">{item.produto.title}</p>
                </Link>
                <p className="item-preco">{formatarPreco(item.produto.price)}</p>
              </div>

              <span className="item-quantidade">{item.quantidade} un.</span>
              <button
                type="button"
                className="botao-texto"
                onClick={(evento) => {
                  evento.preventDefault()
                  evento.stopPropagation()
                  onRemover(item.produto.id)
                }}
              >
                Remover 1
              </button>
            </li>
          ))}
        </ul>

        <aside className="resumo">
          <h2 className="resumo-titulo">Resumo do pedido</h2>

          <form className="cupom" onSubmit={aplicarCupom}>
            <label htmlFor="cupom" className="rotulo">
              Cupom de desconto
            </label>
            <div className="cupom-campo">
              <input
                id="cupom"
                value={codigoCupom}
                onChange={(evento) => setCodigoCupom(evento.target.value)}
                placeholder="Digite o código"
              />
              <button className="botao botao-secundario">Aplicar</button>
            </div>
            {mensagemCupom && <p className="mensagem-cupom">{mensagemCupom}</p>}
          </form>

          {cupomAplicado && (
            <p className="resumo-linha">
              <span>Desconto</span>
              <span>{cupomAplicado.desconto * 100}%</span>
            </p>
          )}

          {!temFreteGratis(totalComDesconto) && (
            <p className="resumo-linha resumo-linha-alerta">
              <span>Frete</span>
              <span>Faltam {formatarPreco(faltanteFrete)} para frete grátis</span>
            </p>
          )}

          <p className="total">
            <span>Total</span>
            <span>{formatarPreco(totalComDesconto)}</span>
          </p>
        </aside>
      </div>

      <h2>Você também pode gostar</h2>
      <div className="sugestoes">
        {sugestoes.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
