import { useEffect, useState } from 'react'
import './App.css'

function Modal({ receita, onClose }) {
  if (!receita) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Receita de ${receita.titulo}`}
      >
        <h2>{receita.titulo}</h2>
        <h3>Ingredientes:</h3>
        <ul>
          {receita.ingredientes.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
        <h3>Modo de Preparo:</h3>
        <p>{receita.modoPreparo}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  )
}

export default function App() {
  const [receitas, setReceitas] = useState([])
  const [modalReceita, setModalReceita] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mockups/receitas.json')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setReceitas(data.receitas)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <header>
        <h1>Receitas</h1>
      </header>

      <main className="card-container">
        {loading && <p>Carregando receitas...</p>}
        {error && <p style={{ color: 'crimson' }}>Erro: {error}</p>}

        {receitas.map((receita) => (
          <article className="card" key={receita.id}>
            <h2>{receita.titulo}</h2>
            <h3>Ilustração:</h3>
            <img src={receita.imagem} alt={receita.titulo} />
            <button onClick={() => setModalReceita(receita)}>Ver Receita</button>
          </article>
        ))}
      </main>

      <footer>
        <p>Receitas do Fessor © 2025</p>
      </footer>

      <Modal receita={modalReceita} onClose={() => setModalReceita(null)} />
    </>
  )
}
