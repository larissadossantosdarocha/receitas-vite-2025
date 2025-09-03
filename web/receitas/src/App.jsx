import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://localhost:3001/receitas', 
      );
      setReceitas(result.data);
    };
    fetchData();
  }, []);

  return(
    <>
    <header>
      <h1>Catálogo de Receitas</h1>
    </header>
    <main>
      {
        receitas.map(receita => (
          <div key={receita.id} className="card">
            <h2>Receita: {receita.nome}</h2> 
            <p>Ingredientes: {receita.ingredientes}</p> 
            <p>Modo de Preparo: {receita.modoPreparo}</p> 
            <img src={receita.imagem} alt={receita.nome} /> 
          </div>
        ))
      }
    </main>
    <footer>
      <p>By Larissa</p>
    </footer>
    </>
  )
}

export default App;
