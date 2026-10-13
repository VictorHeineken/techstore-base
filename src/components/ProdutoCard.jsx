import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import {
  calcularFaltanteFrete,
  produtoTemPrecoValido,
  temFreteGratis,
} from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar }) {
  const precoValido = produtoTemPrecoValido(produto)
  const esgotado = Number(produto.estoque) === 0 || !precoValido
  const valorProduto = Number(produto.price) || 0
  const faltanteFrete = calcularFaltanteFrete(valorProduto)

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        {precoValido ? (
          <span className="preco">{formatarPreco(produto.price)}</span>
        ) : (
          <span className="preco">Preço indisponível</span>
        )}
      </div>

      <div className="card-selos">
        {temFreteGratis(valorProduto) ? (
          <span className="selo selo-frete">Frete grátis</span>
        ) : faltanteFrete > 0 ? (
          <span className="selo selo-alerta">Faltam {formatarPreco(faltanteFrete)} para frete grátis</span>
        ) : null}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado}>
        {precoValido ? 'Adicionar ao carrinho' : 'Indisponível'}
      </button>
    </article>
  )
}
