// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const clientesEsperando = listaEspera.reduce((acumulador, item) => {
    const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)

    if (!produto) {
      return acumulador
    }

    acumulador.push({
      ...item,
      produto: produto.title,
      categoria: produto.category,
    })

    return acumulador
  }, [])

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  {typeof produto.price !== 'number' && (
                    <span className="selo selo-alerta">Sem preço</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="painel-espera">
        <h2>Clientes aguardando retorno</h2>
        {clientesEsperando.length === 0 ? (
          <p className="aviso">Nenhum cliente está esperando um produto voltar ao estoque.</p>
        ) : (
          <ul className="lista-espera">
            {clientesEsperando.map((cliente) => (
              <li key={cliente.id} className="item-espera">
                <strong>{cliente.produto}</strong>
                <span>{cliente.nome}</span>
                <span>{cliente.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
