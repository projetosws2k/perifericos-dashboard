'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiFilter, FiDownload } from 'react-icons/fi';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Periferico {
  tipo: string;
  data: string;
  tecnico: string;
  uncp?: string;
}

export default function RelatoriosPage() {
  const [perifericos, setPerifericos] = useState<Periferico[]>([]);
  const [filtros, setFiltros] = useState({
    periodo: 'mes',
    tipo: 'todos',
    uncp: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const dados = [
      ...JSON.parse(localStorage.getItem('cameraItems') || '[]'),
      ...JSON.parse(localStorage.getItem('cardReaderItems') || '[]'),
      ...JSON.parse(localStorage.getItem('ecpfItems') || '[]'),
      ...JSON.parse(localStorage.getItem('biometricsItems') || '[]')
    ];
    setPerifericos(dados);
  };

  const getTecnicosMaisAtivos = () => {
    const contagem = perifericos.reduce((acc, item) => {
      acc[item.tecnico] = (acc[item.tecnico] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contagem)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getDadosGraficoPizza = () => {
    const contagem = perifericos.reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: ['Câmeras', 'Leitores de Cartão', 'Leitores de E-CPF', 'Biometria'],
      datasets: [
        {
          data: [
            contagem['Câmera'] || 0,
            contagem['Leitor de Cartão'] || 0,
            contagem['Leitor de E-CPF'] || 0,
            contagem['Biometria'] || 0
          ],
          backgroundColor: [
            'rgba(144, 238, 144, 0.8)',  // Verde claro
            'rgba(144, 238, 144, 0.6)',  // Verde mais claro
            'rgba(144, 238, 144, 0.4)',  // Verde ainda mais claro
            'rgba(144, 238, 144, 0.2)'   // Verde bem claro
          ],
          borderColor: [
            'rgba(144, 238, 144, 1)',
            'rgba(144, 238, 144, 1)',
            'rgba(144, 238, 144, 1)',
            'rgba(144, 238, 144, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDadosGraficoBarras = () => {
    const hoje = new Date();
    const ultimosMeses = Array.from({ length: 6 }, (_, i) => {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      return {
        mes: data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        timestamp: data.getTime()
      };
    }).reverse();

    const instalacoesPorMes = ultimosMeses.map(({ mes, timestamp }) => {
      return {
        mes,
        total: perifericos.filter(item => {
          const dataInstalacao = new Date(item.data);
          return dataInstalacao.getMonth() === new Date(timestamp).getMonth() &&
                 dataInstalacao.getFullYear() === new Date(timestamp).getFullYear();
        }).length
      };
    });

    return {
      labels: instalacoesPorMes.map(item => item.mes),
      datasets: [
        {
          label: 'Instalações',
          data: instalacoesPorMes.map(item => item.total),
          backgroundColor: 'rgba(144, 238, 144, 0.6)',
          borderColor: 'rgba(144, 238, 144, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const exportarRelatorioCompleto = () => {
    const wb = XLSX.utils.book_new();
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    
    // 1. Aba de Resumo Geral
    const resumoGeral = [{
      'Total de Periféricos': perifericos.length,
      'Instalações no Mês Atual': perifericos.filter(item => {
        const data = new Date(item.data);
        const hoje = new Date();
        return data.getMonth() === hoje.getMonth() && 
               data.getFullYear() === hoje.getFullYear();
      }).length,
      'Total de UNCPs Atendidas': new Set(perifericos.map(item => item.uncp)).size,
      'Total de Técnicos Ativos': new Set(perifericos.map(item => item.tecnico)).size
    }];
    const wsResumo = XLSX.utils.json_to_sheet(resumoGeral);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Geral');

    // 2. Aba de Distribuição por Tipo
    const distribuicaoPorTipo = [
      {
        'Tipo': 'Câmeras',
        'Quantidade': perifericos.filter(item => item.tipo === 'Câmera').length
      },
      {
        'Tipo': 'Leitores de Cartão',
        'Quantidade': perifericos.filter(item => item.tipo === 'Leitor de Cartão').length
      },
      {
        'Tipo': 'Leitores de E-CPF',
        'Quantidade': perifericos.filter(item => item.tipo === 'Leitor de E-CPF').length
      },
      {
        'Tipo': 'Biometria',
        'Quantidade': perifericos.filter(item => item.tipo === 'Biometria').length
      }
    ];
    const wsDistribuicao = XLSX.utils.json_to_sheet(distribuicaoPorTipo);
    XLSX.utils.book_append_sheet(wb, wsDistribuicao, 'Distribuição por Tipo');

    // 3. Aba de Instalações por Mês
    const hoje = new Date();
    const ultimosMeses = Array.from({ length: 6 }, (_, i) => {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      return {
        'Mês': data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        'Total de Instalações': perifericos.filter(item => {
          const dataInstalacao = new Date(item.data);
          return dataInstalacao.getMonth() === data.getMonth() &&
                 dataInstalacao.getFullYear() === data.getFullYear();
        }).length
      };
    }).reverse();
    const wsInstalacoes = XLSX.utils.json_to_sheet(ultimosMeses);
    XLSX.utils.book_append_sheet(wb, wsInstalacoes, 'Instalações por Mês');

    // 4. Aba de Técnicos
    const tecnicosMaisAtivos = getTecnicosMaisAtivos().map(([tecnico, total]) => ({
      'Técnico': tecnico,
      'Total de Instalações': total
    }));
    const wsTecnicos = XLSX.utils.json_to_sheet(tecnicosMaisAtivos);
    XLSX.utils.book_append_sheet(wb, wsTecnicos, 'Técnicos Mais Ativos');

    // 5. Aba com Todos os Periféricos
    const todosPerifericosFormatados = perifericos.map(item => ({
      'Tipo': item.tipo,
      'Data de Instalação': new Date(item.data).toLocaleDateString('pt-BR'),
      'Técnico': item.tecnico,
      'UNCP': item.uncp || 'N/A'
    }));
    const wsTodosPerifericos = XLSX.utils.json_to_sheet(todosPerifericosFormatados);
    XLSX.utils.book_append_sheet(wb, wsTodosPerifericos, 'Todos os Periféricos');

    // Baixar arquivo
    const nomeArquivo = `relatorio-completo-${dataAtual}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Relatórios</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-gray-500" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filtros.periodo}
            onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
            className="border rounded-lg px-3 py-2"
          >
            <option value="mes">Último Mês</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="ano">Último Ano</option>
          </select>
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
            className="border rounded-lg px-3 py-2"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="camera">Câmeras</option>
            <option value="leitor">Leitores de Cartão</option>
            <option value="ecpf">Leitores de E-CPF</option>
            <option value="biometria">Biometria</option>
          </select>
          <input
            type="text"
            placeholder="UNCP"
            value={filtros.uncp}
            onChange={(e) => setFiltros({...filtros, uncp: e.target.value})}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Pizza */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição por Tipo</h2>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Pie data={getDadosGraficoPizza()} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Instalações por Mês</h2>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Bar 
              data={getDadosGraficoBarras()} 
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-gray-600 mb-2">Total de Periféricos</h3>
          <p className="text-2xl font-bold">{perifericos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-gray-600 mb-2">Instalações no Mês</h3>
          <p className="text-2xl font-bold">
            {perifericos.filter(item => {
              const data = new Date(item.data);
              const hoje = new Date();
              return data.getMonth() === hoje.getMonth() && 
                     data.getFullYear() === hoje.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-gray-600 mb-2">UNCPs Atendidas</h3>
          <p className="text-2xl font-bold">
            {new Set(perifericos.map(item => item.uncp)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-gray-600 mb-2">Técnicos Ativos</h3>
          <p className="text-2xl font-bold">
            {new Set(perifericos.map(item => item.tecnico)).size}
          </p>
        </div>
      </div>

      {/* Tabela de Técnicos */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Técnicos Mais Ativos</h2>
          <button
            onClick={exportarRelatorioCompleto}
            className="flex items-center gap-2 px-4 py-2 bg-[#90EE90] text-white rounded-lg hover:opacity-90"
          >
            <FiDownload /> Exportar Relatório Completo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Técnico</th>
                <th className="px-4 py-2 text-left">Total de Instalações</th>
              </tr>
            </thead>
            <tbody>
              {getTecnicosMaisAtivos().map(([tecnico, total], index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{tecnico}</td>
                  <td className="px-4 py-2">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 