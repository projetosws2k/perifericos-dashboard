'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DisposalItem {
  sn: string;
  tipo: 'Leitor de Cartão' | 'Leitor de E-CPF' | 'Câmera' | 'Biometria';
  data: string;
  ocomon: string;
  motivo: 'Defeito Irreparável' | 'Obsolescência' | 'Dano Físico' | 'Fim da Vida Útil' | 'Outro';
  observacao: string;
  tecnico: string;
}

export default function AdicionarDescartePage() {
  const router = useRouter();
  const loggedInUser = "Técnico Exemplo"; // Simulando usuário logado
  const [items, setItems] = useState<DisposalItem[]>([{
    sn: '',
    tipo: 'Câmera',
    data: new Date().toISOString().split('T')[0],
    ocomon: '',
    motivo: 'Defeito Irreparável',
    observacao: '',
    tecnico: loggedInUser
  }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos vazios
    const hasEmptyFields = items.some(item => 
      !item.sn || !item.tipo || !item.data || !item.ocomon || !item.motivo
    );
    if (hasEmptyFields) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Recuperar itens existentes
      const existingItems = JSON.parse(localStorage.getItem('disposalItems') || '[]');
      
      // Adicionar novos itens
      const updatedItems = [...existingItems, ...items];
      
      // Salvar no localStorage
      localStorage.setItem('disposalItems', JSON.stringify(updatedItems));
      
      toast.success('Itens salvos com sucesso!', {
        onClose: () => router.push('/cadastrar')
      });
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
      toast.error('Erro ao salvar os itens. Por favor, tente novamente.');
    }
  };

  const addItem = () => {
    setItems([...items, {
      sn: '',
      tipo: 'Câmera',
      data: new Date().toISOString().split('T')[0],
      ocomon: '',
      motivo: 'Defeito Irreparável',
      observacao: '',
      tecnico: loggedInUser
    }]);
    toast.success('Novo item adicionado!');
  };

  const removeItem = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      setItems(items.filter((_, i) => i !== index));
      toast.success('Item removido com sucesso!');
    }
  };

  const updateItem = (index: number, field: keyof DisposalItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value as any };
    setItems(newItems);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/cadastrar')}
            className="flex items-center text-primary hover:text-primary-dark transition-colors mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Adicionar Itens para Descarte</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-card rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Item {index + 1}</h3>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    SN/Patrimônio *
                  </label>
                  <input
                    type="text"
                    value={item.sn}
                    onChange={(e) => updateItem(index, 'sn', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tipo *
                  </label>
                  <select
                    value={item.tipo}
                    onChange={(e) => updateItem(index, 'tipo', e.target.value as DisposalItem['tipo'])}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="Câmera">Câmera</option>
                    <option value="Leitor de Cartão">Leitor de Cartão</option>
                    <option value="Leitor de E-CPF">Leitor de E-CPF</option>
                    <option value="Biometria">Biometria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={item.data}
                    onChange={(e) => updateItem(index, 'data', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ocomon *
                  </label>
                  <input
                    type="text"
                    value={item.ocomon}
                    onChange={(e) => updateItem(index, 'ocomon', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Motivo do Descarte *
                  </label>
                  <select
                    value={item.motivo}
                    onChange={(e) => updateItem(index, 'motivo', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="Defeito Irreparável">Defeito Irreparável</option>
                    <option value="Obsolescência">Obsolescência</option>
                    <option value="Dano Físico">Dano Físico</option>
                    <option value="Fim da Vida Útil">Fim da Vida Útil</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Observação
                  </label>
                  <textarea
                    value={item.observacao}
                    onChange={(e) => updateItem(index, 'observacao', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Técnico
                  </label>
                  <input
                    type="text"
                    value={loggedInUser}
                    className="w-full p-2 border rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-4 py-2 text-primary hover:text-primary-dark transition-colors"
            >
              <FiSave className="mr-2" />
              Adicionar Item
            </button>

            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <FiSave className="mr-2" />
              Salvar Todos
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 