'use client';

import { useState, useEffect } from 'react';
import { 
  FiCamera, 
  FiCreditCard, 
  FiUserCheck, 
  FiBox, 
  FiActivity, 
  FiAlertCircle, 
  FiTrendingUp,
  FiSearch,
  FiTrash2,
  FiPackage,
  FiUser,
  FiList
} from 'react-icons/fi';

interface DashboardData {
  totalPerifericos: number;
  cameras: number;
  leitoresCartao: number;
  leitoresEcpf: number;
  biometria: number;
  instalacoesMes: number;
  uncpsAtendidas: number;
}

interface AtividadeRecente {
  tipo: 'instalacao' | 'descarte' | 'estoque';
  data: string;
  tecnico: string;
  periferico: string;
  uncp?: string;
}

interface Alerta {
  tipo: 'estoque' | 'antiguidade' | 'manutencao';
  mensagem: string;
  nivel: 'baixo' | 'medio' | 'alto';
}

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardData>({
    totalPerifericos: 0,
    cameras: 0,
    leitoresCartao: 0,
    leitoresEcpf: 0,
    biometria: 0,
    instalacoesMes: 0,
    uncpsAtendidas: 0
  });

  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [tecnicosAtivos, setTecnicosAtivos] = useState<{tecnico: string, atividades: number}[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    carregarDados();
    carregarAtividadesRecentes();
    verificarAlertas();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar dados do localStorage
      const cameraItems = JSON.parse(localStorage.getItem('cameraItems') || '[]');
      const cardReaderItems = JSON.parse(localStorage.getItem('cardReaderItems') || '[]');
      const ecpfItems = JSON.parse(localStorage.getItem('ecpfItems') || '[]');
      const biometricsItems = JSON.parse(localStorage.getItem('biometricsItems') || '[]');

      // Calcular UNCPs únicas
      const todasUncps = new Set([
        ...cameraItems.map((item: any) => item.uncp),
        ...cardReaderItems.map((item: any) => item.uncp),
        ...ecpfItems.map((item: any) => item.uncp),
        ...biometricsItems.map((item: any) => item.uncp)
      ]);

      // Calcular instalações do mês atual
      const dataAtual = new Date();
      const mesAtual = dataAtual.getMonth();
      const anoAtual = dataAtual.getFullYear();

      const instalacoesDoMes = [
        ...cameraItems,
        ...cardReaderItems,
        ...ecpfItems,
        ...biometricsItems
      ].filter((item: any) => {
        const dataInstalacao = new Date(item.data);
        return dataInstalacao.getMonth() === mesAtual && 
               dataInstalacao.getFullYear() === anoAtual;
      });

      setDados({
        totalPerifericos: cameraItems.length + cardReaderItems.length + 
                         ecpfItems.length + biometricsItems.length,
        cameras: cameraItems.length,
        leitoresCartao: cardReaderItems.length,
        leitoresEcpf: ecpfItems.length,
        biometria: biometricsItems.length,
        instalacoesMes: instalacoesDoMes.length,
        uncpsAtendidas: todasUncps.size
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const carregarAtividadesRecentes = () => {
    try {
      // Carregar dados do localStorage
      const cameraItems = JSON.parse(localStorage.getItem('cameraItems') || '[]');
      const cardReaderItems = JSON.parse(localStorage.getItem('cardReaderItems') || '[]');
      const ecpfItems = JSON.parse(localStorage.getItem('ecpfItems') || '[]');
      const biometricsItems = JSON.parse(localStorage.getItem('biometricsItems') || '[]');
      const stockItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
      const disposalItems = JSON.parse(localStorage.getItem('disposalItems') || '[]');

      // Combinar todas as atividades
      const todasAtividades: AtividadeRecente[] = [
        ...cameraItems.map((item: any) => ({
          tipo: 'instalacao',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`,
          uncp: item.uncp
        })),
        ...cardReaderItems.map((item: any) => ({
          tipo: 'instalacao',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`,
          uncp: item.uncp
        })),
        ...ecpfItems.map((item: any) => ({
          tipo: 'instalacao',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`,
          uncp: item.uncp
        })),
        ...biometricsItems.map((item: any) => ({
          tipo: 'instalacao',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`,
          uncp: item.uncp
        })),
        ...disposalItems.map((item: any) => ({
          tipo: 'descarte',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`
        })),
        ...stockItems.map((item: any) => ({
          tipo: 'estoque',
          data: item.data,
          tecnico: item.tecnico,
          periferico: `${item.tipo} - ${item.sn}`
        }))
      ];

      // Ordenar por data (mais recentes primeiro)
      const atividadesOrdenadas = todasAtividades
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 10); // Pegar apenas as 10 mais recentes

      // Calcular técnicos mais ativos
      const contagem = todasAtividades.reduce((acc, curr) => {
        acc[curr.tecnico] = (acc[curr.tecnico] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const tecnicosOrdenados = Object.entries(contagem)
        .map(([tecnico, atividades]) => ({ tecnico, atividades }))
        .sort((a, b) => b.atividades - a.atividades)
        .slice(0, 5); // Top 5 técnicos

      setAtividadesRecentes(atividadesOrdenadas);
      setTecnicosAtivos(tecnicosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const verificarAlertas = () => {
    const novosAlertas: Alerta[] = [];
    
    // Verificar estoque baixo
    const estoqueMinimo = 5;
    const stockItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
    const qtdEstoque = stockItems.length;
    
    if (qtdEstoque < estoqueMinimo) {
      novosAlertas.push({
        tipo: 'estoque',
        mensagem: `Estoque baixo: ${qtdEstoque} periféricos disponíveis`,
        nivel: 'alto'
      });
    }

    // Verificar periféricos antigos (mais de 5 anos)
    const perifericos = [
      ...JSON.parse(localStorage.getItem('cameraItems') || '[]'),
      ...JSON.parse(localStorage.getItem('cardReaderItems') || '[]'),
      ...JSON.parse(localStorage.getItem('ecpfItems') || '[]'),
      ...JSON.parse(localStorage.getItem('biometricsItems') || '[]')
    ];

    const dataLimite = new Date();
    dataLimite.setFullYear(dataLimite.getFullYear() - 5);

    const perifericosAntigos = perifericos.filter(item => 
      new Date(item.data) < dataLimite
    );

    if (perifericosAntigos.length > 0) {
      novosAlertas.push({
        tipo: 'antiguidade',
        mensagem: `${perifericosAntigos.length} periféricos com mais de 5 anos`,
        nivel: 'medio'
      });
    }

    // Verificar UNCPs sem manutenção recente (últimos 6 meses)
    const dataManutencao = new Date();
    dataManutencao.setMonth(dataManutencao.getMonth() - 6);

    const uncpsSemManutencao = perifericos
      .filter(item => new Date(item.data) < dataManutencao)
      .map(item => item.uncp)
      .filter((value, index, self) => self.indexOf(value) === index);

    if (uncpsSemManutencao.length > 0) {
      novosAlertas.push({
        tipo: 'manutencao',
        mensagem: `${uncpsSemManutencao.length} UNCPs sem manutenção há 6 meses`,
        nivel: 'alto'
      });
    }

    setAlertas(novosAlertas);
  };

  const AlertaItem = ({ alerta }: { alerta: Alerta }) => {
    const cores = {
      baixo: 'bg-blue-100 text-blue-800',
      medio: 'bg-yellow-100 text-yellow-800',
      alto: 'bg-red-100 text-red-800'
    };

    const icones = {
      estoque: <FiBox className="w-5 h-5" />,
      antiguidade: <FiAlertCircle className="w-5 h-5" />,
      manutencao: <FiActivity className="w-5 h-5" />
    };

    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg ${cores[alerta.nivel]}`}>
        {icones[alerta.tipo]}
        <span className="flex-1">{alerta.mensagem}</span>
      </div>
    );
  };

  const CardResumo = ({ titulo, valor, icone: Icone, cor }: any) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{titulo}</p>
          <h3 className="text-2xl font-bold mt-1">{valor}</h3>
        </div>
        <div className={`p-3 rounded-full ${cor}`}>
          <Icone className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardResumo 
          titulo="Total de Periféricos"
          valor={dados.totalPerifericos}
          icone={FiBox}
          cor="bg-[#90EE90]"
        />
        <CardResumo 
          titulo="Instalações no Mês"
          valor={dados.instalacoesMes}
          icone={FiActivity}
          cor="bg-[#90EE90]"
        />
        <CardResumo 
          titulo="UNCPs Atendidas"
          valor={dados.uncpsAtendidas}
          icone={FiTrendingUp}
          cor="bg-[#90EE90]"
        />
        <CardResumo 
          titulo="Alertas"
          valor={alertas.length}
          icone={FiAlertCircle}
          cor="bg-[#90EE90]"
        />
      </div>

      {/* Distribuição por Tipo */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Distribuição por Tipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <FiCamera className="w-8 h-8 text-[#90EE90]" />
            <div>
              <p className="text-gray-600">Câmeras</p>
              <p className="text-xl font-semibold">{dados.cameras}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <FiCreditCard className="w-8 h-8 text-[#90EE90]" />
            <div>
              <p className="text-gray-600">Leitores de Cartão</p>
              <p className="text-xl font-semibold">{dados.leitoresCartao}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <FiUserCheck className="w-8 h-8 text-[#90EE90]" />
            <div>
              <p className="text-gray-600">Leitores de E-CPF</p>
              <p className="text-xl font-semibold">{dados.leitoresEcpf}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <FiBox className="w-8 h-8 text-[#90EE90]" />
            <div>
              <p className="text-gray-600">Biometria</p>
              <p className="text-xl font-semibold">{dados.biometria}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#90EE90] text-white hover:opacity-90 transition-opacity"
            onClick={() => window.location.href = '/cadastrar'}
          >
            <FiBox className="w-5 h-5" />
            Nova Instalação
          </button>
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#90EE90] text-white hover:opacity-90 transition-opacity"
            onClick={() => window.location.href = '/consultar'}
          >
            <FiSearch className="w-5 h-5" />
            Consultar
          </button>
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#90EE90] text-white hover:opacity-90 transition-opacity"
            onClick={() => window.location.href = '/cadastrar/descarte'}
          >
            <FiTrash2 className="w-5 h-5" />
            Registrar Descarte
          </button>
          <button 
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#90EE90] text-white hover:opacity-90 transition-opacity"
            onClick={() => window.location.href = '/estoque'}
          >
            <FiList className="w-5 h-5" />
            Ver Estoque
          </button>
        </div>
      </div>

      {/* Sistema de Alertas */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Alertas do Sistema</h2>
        <div className="space-y-4">
          {alertas.length > 0 ? (
            alertas.map((alerta, index) => (
              <AlertaItem key={index} alerta={alerta} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhum alerta no momento
            </p>
          )}
        </div>
      </div>

      {/* Atividades Recentes e Técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {atividadesRecentes.map((atividade, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                {atividade.tipo === 'instalacao' && <FiBox className="w-5 h-5 text-[#90EE90]" />}
                {atividade.tipo === 'descarte' && <FiTrash2 className="w-5 h-5 text-red-500" />}
                {atividade.tipo === 'estoque' && <FiPackage className="w-5 h-5 text-blue-500" />}
                <div className="flex-1">
                  <p className="font-medium">
                    {atividade.tipo === 'instalacao' && `Instalação em UNCP ${atividade.uncp}`}
                    {atividade.tipo === 'descarte' && 'Descarte de Periférico'}
                    {atividade.tipo === 'estoque' && 'Adição ao Estoque'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {atividade.periferico} - {atividade.tecnico}
                  </p>
                  <p className="text-xs text-gray-500">{formatarData(atividade.data)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Técnicos Mais Ativos</h2>
          <div className="space-y-4">
            {tecnicosAtivos.map((tecnico, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FiUser className="w-5 h-5 text-[#90EE90]" />
                  <span className="font-medium">{tecnico.tecnico}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{tecnico.atividades} atividades</span>
                  <div className="w-2 h-2 rounded-full bg-[#90EE90]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}