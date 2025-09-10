import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function Modal({ receita, onClose }) {
  if (!receita) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{receita.titulo}</h2>
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

function FormModal({ form, setForm, onClose, onSubmit }) {
  if (!form) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{form.id && !form.isLocal ? 'Editar Receita' : 'Nova Receita'}</h2>
        <form onSubmit={onSubmit}>
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
          />
          <textarea
            name="ingredientes"
            placeholder="Ingredientes (separados por vírgula)"
            value={form.ingredientes}
            onChange={handleChange}
            required
          />
          <textarea
            name="modoPreparo"
            placeholder="Modo de Preparo"
            value={form.modoPreparo}
            onChange={handleChange}
            required
          />
          <input
            name="imagem"
            placeholder="URL da Imagem"
            value={form.imagem}
            onChange={handleChange}
          />
          <div className="faixa">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [receitas, setReceitas] = useState([]);
  const [modalReceita, setModalReceita] = useState(null);
  const [formModal, setFormModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Receitas JSON local
        const jsonResponse = await axios.get('/mockups/receitas.json');
        const jsonData = jsonResponse.data;

        // Receitas API
        const apiResponse = await axios.get('http://localhost:3001/receitas');

        const receitasJson = (jsonData.receitas || []).map(r => ({
          ...r,
          id: `local-${r.id || Math.random()}`,
          isLocal: true
        }));

        const receitasApi = (apiResponse.data || []).map(r => ({
          ...r,
          isLocal: false
        }));

        setReceitas([...receitasJson, ...receitasApi]);
      } catch (err) {
        console.error('Erro ao buscar receitas:', err);
      }
    };
    fetchData();
  }, []);

  const handleOpenFormModal = (receita = null) => {
    if (receita) {
      const ingStr = Array.isArray(receita.ingredientes)
        ? receita.ingredientes.join(', ')
        : receita.ingredientes;
      setFormModal({ ...receita, ingredientes: ingStr });
    } else {
      setFormModal({ titulo: '', ingredientes: '', modoPreparo: '', imagem: '' });
    }
  };

  const handleCloseFormModal = () => setFormModal(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      titulo: formModal.titulo,
      ingredientes: formModal.ingredientes.split(',').map(i => i.trim()),
      modoPreparo: formModal.modoPreparo,
      imagem: formModal.imagem
    };

    try {
      if (formModal.id && !formModal.isLocal) {
        // Edita receita da API
        const res = await axios.patch(`http://localhost:3001/receitas/${formModal.id}`, payload);
        setReceitas(receitas.map(r => r.id === formModal.id ? res.data : r));
      } else if (formModal.id && formModal.isLocal) {
        // Edita receita local
        setReceitas(receitas.map(r => r.id === formModal.id ? { ...r, ...payload } : r));
      } else {
        // Nova receita API
        const res = await axios.post('http://localhost:3001/receitas', payload);
        setReceitas([...receitas, res.data]);
      }
      handleCloseFormModal();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar receita!');
    }
  };

  const handleDelete = async (receita) => {
    if (receita.isLocal) {
      setReceitas(receitas.filter(r => r.id !== receita.id));
      return;
    }
    if (!window.confirm('Deseja realmente excluir esta receita?')) return;
    try {
      await axios.delete(`http://localhost:3001/receitas/${receita.id}`);
      setReceitas(receitas.filter(r => r.id !== receita.id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir receita!');
    }
  };

  return (
    <>
      <header>
        <h1>Catálogo de Receitas</h1>
      </header>

      <main className="card-container">
        {receitas.map(r => (
          <div className="card" key={r.id}>
            <h2>{r.titulo}</h2>
            {r.imagem ? <img src={r.imagem} alt={r.titulo} /> : <div className="placeholder">Sem imagem</div>}

            <button className="btn-ver" onClick={() => setModalReceita(r)}>Ver Receita</button>

            <div className="faixa-baixo">
              <button onClick={() => handleOpenFormModal(r)}>Editar</button>
              <button onClick={() => handleDelete(r)}>Excluir</button>
            </div>
          </div>
        ))}
      </main>

      <footer>
        <p>By Larissa &copy; 2025</p>
        <button onClick={() => handleOpenFormModal()}>Novo</button>
      </footer>

      {/* Modais */}
      <Modal receita={modalReceita} onClose={() => setModalReceita(null)} />
      <FormModal form={formModal} setForm={setFormModal} onClose={handleCloseFormModal} onSubmit={handleSubmit} />
    </>
  );
}

export default App;
