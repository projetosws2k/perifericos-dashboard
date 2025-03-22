'use client';

import { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface Peripheral {
  id: string;
  type: string;
  model: string;
  serialNumber: string;
  installDate: string;
  status: 'installed' | 'stock' | 'disposed';
}

export default function ConsultarPage() {
  const [uncp, setUncp] = useState('');
  const [results, setResults] = useState<Peripheral[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Temporary mock data
    setTimeout(() => {
      setResults([
        {
          id: '1',
          type: 'Câmera',
          model: 'Logitech C920',
          serialNumber: 'LGT123456',
          installDate: '2025-03-21',
          status: 'installed'
        }
      ]);
      setIsLoading(false);
    }, 500);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'installed':
        return 'bg-green-100 text-green-800';
      case 'stock':
        return 'bg-blue-100 text-blue-800';
      case 'disposed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      installed: 'Instalado',
      stock: 'Em Estoque',
      disposed: 'Descartado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Consultar Periféricos
        </h1>

        <form onSubmit={handleSearch} className="max-w-md mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="uncp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                UNCP
              </label>
              <input
                type="text"
                id="uncp"
                value={uncp}
                onChange={(e) => setUncp(e.target.value)}
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="Digite o número da UNCP"
                className="input-field"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                <FiSearch className="w-4 h-4" />
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </form>

        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Número de Série
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data de Instalação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((peripheral) => (
                  <tr key={peripheral.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {peripheral.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {peripheral.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {peripheral.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(peripheral.installDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(peripheral.status)}`}>
                        {getStatusText(peripheral.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalhes"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Editar"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results.length === 0 && !isLoading && uncp && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhum periférico encontrado para esta UNCP.
          </div>
        )}
      </div>
    </div>
  );
}