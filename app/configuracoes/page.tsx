'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiSettings } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConfiguracoesUsuario {
  tecnicoPadrao: string;
  email: string;
  exibicao: {
    mostrarAlertas: boolean;
    itensPorPagina: number;
    ordenacao: 'data' | 'tipo' | 'uncp';
  };
}

export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>({
    tecnicoPadrao: '',
    email: '',
    exibicao: {
      mostrarAlertas: true,
      itensPorPagina: 10,
      ordenacao: 'data'
    }
  });

  useEffect(() => {
    // Carregar configurações salvas
    const configSalvas = localStorage.getItem('configuracoesUsuario');
    if (configSalvas) {
      setConfiguracoes(JSON.parse(configSalvas));
    }
  }, []);

  const salvarConfiguracoes = () => {
    try {
      localStorage.setItem('configuracoesUsuario', JSON.stringify(configuracoes));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Configurações de Usuário</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Técnico Padrão */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiUser className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Técnico Padrão</h2>
          </div>
          <input
            type="text"
            value={configuracoes.tecnicoPadrao}
            onChange={(e) => setConfiguracoes({
              ...configuracoes,
              tecnicoPadrao: e.target.value
            })}
            placeholder="Nome do técnico padrão"
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Este nome será preenchido automaticamente nos formulários de instalação e manutenção.
          </p>
        </div>

        {/* Email */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Email para Notificações</h2>
          </div>
          <input
            type="email"
            value={configuracoes.email}
            onChange={(e) => setConfiguracoes({
              ...configuracoes,
              email: e.target.value
            })}
            placeholder="seu@email.com"
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Você receberá notificações sobre alertas e atualizações neste email.
          </p>
        </div>

        {/* Preferências de Exibição */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiSettings className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Preferências de Exibição</h2>
          </div>
          
          <div className="space-y-4">
            {/* Mostrar Alertas */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={configuracoes.exibicao.mostrarAlertas}
                onChange={(e) => setConfiguracoes({
                  ...configuracoes,
                  exibicao: {
                    ...configuracoes.exibicao,
                    mostrarAlertas: e.target.checked
                  }
                })}
                className="rounded border-gray-300"
              />
              <span>Mostrar alertas no dashboard</span>
            </div>

            {/* Itens por Página */}
            <div>
              <label className="block mb-2">Itens por página:</label>
              <select
                value={configuracoes.exibicao.itensPorPagina}
                onChange={(e) => setConfiguracoes({
                  ...configuracoes,
                  exibicao: {
                    ...configuracoes.exibicao,
                    itensPorPagina: Number(e.target.value)
                  }
                })}
                className="border rounded-lg px-3 py-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Ordenação Padrão */}
            <div>
              <label className="block mb-2">Ordenação padrão:</label>
              <select
                value={configuracoes.exibicao.ordenacao}
                onChange={(e) => setConfiguracoes({
                  ...configuracoes,
                  exibicao: {
                    ...configuracoes.exibicao,
                    ordenacao: e.target.value as 'data' | 'tipo' | 'uncp'
                  }
                })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="data">Por Data</option>
                <option value="tipo">Por Tipo</option>
                <option value="uncp">Por UNCP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={salvarConfiguracoes}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#90EE90] text-white rounded-lg hover:opacity-90"
        >
          <FiSave />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
} 