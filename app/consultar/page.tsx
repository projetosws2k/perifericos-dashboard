'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Periferico {
  sn: string;
  tipo: 'Câmera' | 'Leitor de Cartão' | 'Leitor de E-CPF' | 'Biometria';
  data: string;
  ocomon: string;
  tecnico: string;
  uncp: string;
  status: string;
  patrimonio?: string;
  local?: string;
}

export default function ConsultarPage() {
  const [uncp, setUncp] = useState('');
  const [perifericos, setPerifericos] = useState<Periferico[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buscarPerifericos = () => {
    if (!uncp.trim()) {
      toast.error('Por favor, digite o número da UNCP');
      return;
    }

    setIsLoading(true);
    try {
      // Buscar dados de todas as chaves do localStorage
      const cameraItems = JSON.parse(localStorage.getItem('cameraItems') || '[]');
      const cardReaderItems = JSON.parse(localStorage.getItem('cardReaderItems') || '[]');
      const ecpfItems = JSON.parse(localStorage.getItem('ecpfItems') || '[]');
      const biometricsItems = JSON.parse(localStorage.getItem('biometricsItems') || '[]');

      // Combinar todos os itens
      const todosOsItens = [
        ...cameraItems,
        ...cardReaderItems,
        ...ecpfItems,
        ...biometricsItems
      ];

      console.log('Todos os itens:', todosOsItens);

      // Normaliza o número da UNCP removendo zeros à esquerda
      const uncpNormalizado = uncp.trim().replace(/^0+/, '');
      console.log('UNCP buscada (normalizada):', uncpNormalizado);

      // Filtra os periféricos apenas pela UNCP
      const perifericosDaUncp = todosOsItens.filter((p: Periferico) => {
        const uncpPerifericoNormalizado = String(p.uncp).replace(/^0+/, '');
        console.log('Comparando:', {
          'UNCP do periférico': uncpPerifericoNormalizado,
          'UNCP buscada': uncpNormalizado,
          'Tipo': p.tipo
        });
        return uncpPerifericoNormalizado === uncpNormalizado;
      });

      console.log('Periféricos encontrados:', perifericosDaUncp);

      if (perifericosDaUncp.length === 0) {
        toast.info('Nenhum periférico encontrado para esta UNCP');
      } else {
        toast.success(`${perifericosDaUncp.length} periférico(s) encontrado(s)`);
        setPerifericos(perifericosDaUncp);
      }
    } catch (error) {
      console.error('Erro ao buscar periféricos:', error);
      toast.error('Erro ao buscar periféricos');
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const CardPeriferico = ({ titulo, tipo, items }: { 
    titulo: string; 
    tipo: string; 
    items: Periferico[] 
  }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div style={{ backgroundColor: '#90EE90' }} className="p-4">
        <h2 className="text-xl font-bold text-white flex items-center justify-between">
          {titulo}
          <span className="text-sm bg-white px-2 py-1 rounded-full" style={{ color: '#90EE90' }}>
            {items.length}
          </span>
        </h2>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum {tipo.toLowerCase()} instalado
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.sn}</h3>
                    <p className="text-sm text-gray-600">
                      Patrimônio: {item.patrimonio || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      title="Detalhes"
                      style={{ color: '#90EE90' }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => toast.info(`Detalhes de ${item.sn}`)}
                    >
                      <FiInfo size={16} />
                    </button>
                    <button 
                      title="Editar"
                      style={{ color: '#90EE90' }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => toast.info(`Editar ${item.sn}`)}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      title="Remover"
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => toast.info(`Remover ${item.sn}`)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Data:</span>
                    <p>{formatarData(item.data)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ocomon:</span>
                    <p>{item.ocomon}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Técnico:</span>
                    <p>{item.tecnico}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Local:</span>
                    <p>{item.local || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer theme="light" />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Consultar Periféricos por UNCP</h1>

        <div className="flex gap-4 max-w-md">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">UNCP</label>
            <input 
              type="text"
              placeholder="Digite o número da UNCP (ex: 0058)"
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#90EE90] focus:border-[#90EE90]"
              value={uncp}
              onChange={(e) => setUncp(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarPerifericos()}
            />
          </div>
          <button 
            style={{ backgroundColor: '#90EE90' }}
            className="self-end px-6 py-2 text-white rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={buscarPerifericos}
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {perifericos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardPeriferico 
            titulo="Câmeras" 
            tipo="Câmera"
            items={perifericos.filter(p => p.tipo === 'Câmera')} 
          />
          <CardPeriferico 
            titulo="Leitores de Cartão" 
            tipo="Leitor de Cartão"
            items={perifericos.filter(p => p.tipo === 'Leitor de Cartão')} 
          />
          <CardPeriferico 
            titulo="Leitores de E-CPF" 
            tipo="Leitor de E-CPF"
            items={perifericos.filter(p => p.tipo === 'Leitor de E-CPF')} 
          />
          <CardPeriferico 
            titulo="Dispositivos de Biometria" 
            tipo="Biometria"
            items={perifericos.filter(p => p.tipo === 'Biometria')} 
          />
        </div>
      )}
    </div>
  );
}