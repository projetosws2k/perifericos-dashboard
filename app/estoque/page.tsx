'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiArrowLeft, FiCamera, FiCreditCard, FiUserCheck, FiBox } from 'react-icons/fi';

interface Periferico {
  tipo: string;
  sn: string;
  data: string;
  tecnico: string;
}

export default function EstoquePage() {
  const [perifericos, setPerifericos] = useState<Periferico[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  useEffect(() => {
    carregarPerifericos();
  }, []);

  const carregarPerifericos = () => {
    const stockItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
    setPerifericos(stockItems);
  };

  const filtrarPerifericos = (tipo: string) => {
    return perifericos.filter(item => 
      item.tipo.toLowerCase() === tipo.toLowerCase() &&
      (termoPesquisa === '' || item.sn.toLowerCase().includes(termoPesquisa.toLowerCase()))
    );
  };

  const TabelaPerifericos = ({ tipo, icone: Icone }: { tipo: string, icone: any }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Icone className="w-6 h-6 text-[#90EE90]" />
        <h2 className="text-xl font-semibold">{tipo}</h2>
        <span className="bg-[#90EE90] text-white px-2 py-1 rounded-full text-sm">
          {filtrarPerifericos(tipo).length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Número de Série</th>
              <th className="px-4 py-3 text-left">Data de Entrada</th>
              <th className="px-4 py-3 text-left">Técnico</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtrarPerifericos(tipo).map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.sn}</td>
                <td className="px-4 py-3">
                  {new Date(item.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">{item.tecnico}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrarPerifericos(tipo).length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhum {tipo.toLowerCase()} em estoque
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Estoque</h1>
      </div>

      {/* Barra de pesquisa */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por número de série..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
          />
        </div>
      </div>

      {/* Resumo do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <FiCamera className="w-5 h-5 text-[#90EE90]" />
            <h3 className="font-medium">Câmeras</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{filtrarPerifericos('Câmera').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <FiCreditCard className="w-5 h-5 text-[#90EE90]" />
            <h3 className="font-medium">Leitores de Cartão</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{filtrarPerifericos('Leitor de Cartão').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <FiUserCheck className="w-5 h-5 text-[#90EE90]" />
            <h3 className="font-medium">Leitores de E-CPF</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{filtrarPerifericos('Leitor de E-CPF').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <FiBox className="w-5 h-5 text-[#90EE90]" />
            <h3 className="font-medium">Biometria</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{filtrarPerifericos('Biometria').length}</p>
        </div>
      </div>

      {/* Tabelas por tipo */}
      <TabelaPerifericos tipo="Câmera" icone={FiCamera} />
      <TabelaPerifericos tipo="Leitor de Cartão" icone={FiCreditCard} />
      <TabelaPerifericos tipo="Leitor de E-CPF" icone={FiUserCheck} />
      <TabelaPerifericos tipo="Biometria" icone={FiBox} />
    </div>
  );
} 