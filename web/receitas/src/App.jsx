import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function Modal({ receita, onClose }) {
  if (!receita) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{receita.nome}</h2>
        <h3>Ingredientes:</h3>
        <ul>
          {Array.isArray(receita.ingredientes)
            ? receita.ingredientes.map((ing, idx) => <li key={idx}>{ing}</li>)
            : <li>{receita.ingredientes}</li>}
        </ul>
        <h3>Modo de Preparo:</h3>
        <p>{receita.modoPreparo}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

function App() {
  const [receitas, setReceitas] = useState([]);
  const [modalReceita, setModalReceita] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    ingredientes: '',
    modoPreparo: '',
    imagem: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        const jsonResponse = await fetch('/mockups/receitas.json');
        const jsonData = await jsonResponse.json();
        const apiResponse = await axios.get('http://localhost:3001/receitas');

        setReceitas([...jsonData.receitas, ...apiResponse.data]);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novaReceita = {
        ...form,
        ingredientes: form.ingredientes.split(',').map(i => i.trim())
      };
      const response = await axios.post('http://localhost:3001/receitas', novaReceita);
      setReceitas(prev => [...prev, response.data]);
      setForm({ nome: '', ingredientes: '', modoPreparo: '', imagem: '' });
    } catch (error) {
      console.error("Erro ao cadastrar receita:", error);
    }
  };

  return (
    <>
      <header>
        <h1>Catálogo de Receitas</h1>
      </header>

      <main className="card-container">
        {receitas.map((receita, idx) => (
          <div className="card" key={receita.id || idx}>
            <h2>{receita.nome}</h2>
            <img src={receita.imagem} alt={receita.nome} />
            <button onClick={() => setModalReceita(receita)}>Ver Receita</button>
          </div>
        ))}
      </main>

      <footer>
        <p>By Larissa &copy; 2025</p>
      </footer>

      <Modal receita={modalReceita} onClose={() => setModalReceita(null)} />
    </>
  );
}

export default App;
