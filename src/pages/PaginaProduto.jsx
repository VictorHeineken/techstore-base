import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { calcularFaltanteFrete, produtoDisponivel, produtoTemPrecoValido, temFreteGratis } from '../utils/produtos'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera = [], onNotificar }) {
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const disponivel = produtoDisponivel(produto)
  const faltanteFrete = calcularFaltanteFrete(Number(produto.price) || 0)

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        produtoDisponivel(item)
    )
    .slice(0, 4)

  function lidarComAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagem('Preencha nome e e-mail para receber a notificação.')
      return
    }

    if (typeof onNotificar === 'function') {
      onNotificar(produto.id, nome.trim(), email.trim())
    }

    setMensagem('Você foi cadastrado para receber a notificação quando o produto voltar.')
    setNome('')
    setEmail('')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>

          {produtoTemPrecoValido(produto) ? (
            <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          ) : (
            <p className="detalhe-preco">Preço indisponível</p>
          )}

          <p className="detalhe-descricao">{produto.description}</p>
          {produto.estoque === 0 ? (
            <p className="detalhe-estoque detalhe-estoque-esgotado">Produto esgotado</p>
          ) : (
            <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>
          )}

          {produtoTemPrecoValido(produto) && !temFreteGratis(Number(produto.price) || 0) && (
            <p className="detalhe-frete">
              Faltam {formatarPreco(faltanteFrete)} para ganhar frete grátis.
            </p>
          )}

          {produto.estoque === 0 ? (
            <form className="formulario-aviso" onSubmit={lidarComAviso}>
              <p className="aviso-aviso">Receba um e-mail quando este item voltar ao estoque.</p>
              <input
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
              />
              <button type="submit" className="botao botao-grande">
                Quero ser avisado
              </button>
              {mensagem && <p className="mensagem-aviso">{mensagem}</p>}
            </form>
          ) : (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!disponivel}
            >
              Adicionar ao carrinho
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
