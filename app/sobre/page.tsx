'use client';

import { FiArrowLeft, FiGithub, FiMail, FiBook, FiInfo, FiTag } from 'react-icons/fi';
import jsPDF from 'jspdf';

export default function SobrePage() {
  const gerarDocumentacao = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 10;
    const indent = 20;

    // Função auxiliar para adicionar texto com quebra de linha
    const addText = (text: string, y: number, fontSize = 12, isTitle = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isTitle ? 'bold' : 'normal');
      doc.text(text, 20, y);
      return y + lineHeight;
    };

    // Título principal
    yPos = addText('Documentação PerifControl', yPos, 20, true);
    yPos += 10;

    // Manual do Usuário
    yPos = addText('1. Manual do Usuário', yPos, 16, true);
    yPos += 5;
    yPos = addText('1.1. Visão Geral', yPos);
    yPos = addText('O PerifControl é um sistema de gerenciamento de periféricos que permite:', yPos);
    yPos += 5;
    [
      'Cadastrar e controlar instalações de equipamentos',
      'Gerenciar estoque de periféricos',
      'Registrar manutenções',
      'Controlar descarte de equipamentos',
      'Gerar relatórios e estatísticas'
    ].forEach(item => {
      yPos = addText(`• ${item}`, yPos);
    });

    // Guia de Instalação
    yPos += 10;
    yPos = addText('2. Guia de Instalação', yPos, 16, true);
    yPos += 5;
    [
      '2.1. Requisitos do Sistema:',
      '• Navegador web atualizado',
      '• Conexão com internet',
      '• Resolução mínima: 1024x768',
      '',
      '2.2. Primeiro Acesso:',
      '• Acesse o sistema através do link fornecido',
      '• Configure seu perfil em "Configurações"',
      '• Defina suas preferências de exibição'
    ].forEach(item => {
      yPos = addText(item, yPos);
    });

    // FAQ
    doc.addPage();
    yPos = 20;
    yPos = addText('3. Perguntas Frequentes (FAQ)', yPos, 16, true);
    yPos += 5;
    [
      'P: Como cadastrar um novo periférico?',
      'R: Acesse o menu "Cadastrar" e selecione o tipo de periférico desejado.',
      '',
      'P: Como consultar instalações por UNCP?',
      'R: Use a função "Consultar" no menu principal e digite o número da UNCP.',
      '',
      'P: Como gerar relatórios?',
      'R: Acesse a seção "Relatórios" e selecione o tipo de relatório desejado.'
    ].forEach(item => {
      yPos = addText(item, yPos);
    });

    // Políticas de Uso
    doc.addPage();
    yPos = 20;
    yPos = addText('4. Políticas de Uso', yPos, 16, true);
    yPos += 5;
    [
      '4.1. Responsabilidades do Usuário:',
      '• Manter a confidencialidade dos dados',
      '• Registrar informações precisas',
      '• Seguir os procedimentos estabelecidos',
      '',
      '4.2. Boas Práticas:',
      '• Realizar backups regularmente',
      '• Manter registros atualizados',
      '• Reportar problemas ao suporte'
    ].forEach(item => {
      yPos = addText(item, yPos);
    });

    // Termos de Serviço
    doc.addPage();
    yPos = 20;
    yPos = addText('5. Termos de Serviço', yPos, 16, true);
    yPos += 5;
    [
      '5.1. Uso do Sistema:',
      '• O sistema é de uso exclusivo da WS2K SUPORTE TÉCNICO',
      '• Todos os dados são confidenciais',
      '• O acesso é controlado e monitorado',
      '',
      '5.2. Suporte:',
      '• Email: suporte@ws2k.com.br',
      '• Telefone: (11) 4444-4444',
      '• Horário: Segunda a Sexta, 8h às 18h'
    ].forEach(item => {
      yPos = addText(item, yPos);
    });

    // Salvar o PDF
    doc.save('documentacao-perifcontrol.pdf');
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Sobre o Sistema</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Sobre o Sistema */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiInfo className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Sobre o PerifControl</h2>
          </div>
          <p className="text-gray-600 mb-4">
            O PerifControl é um sistema de gerenciamento de periféricos desenvolvido para a WS2K SUPORTE TÉCNICO.
            Ele permite o controle completo de instalações, manutenções e descarte de equipamentos como câmeras,
            leitores de cartão, leitores de e-CPF e dispositivos biométricos.
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Principais funcionalidades:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
              <li>Cadastro e controle de instalações</li>
              <li>Gerenciamento de estoque</li>
              <li>Registro de manutenções</li>
              <li>Controle de descarte</li>
              <li>Relatórios e estatísticas</li>
              <li>Dashboard interativo</li>
            </ul>
          </div>
        </div>

        {/* Versão */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiTag className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Versão do Sistema</h2>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Versão 1.0.0</p>
            <p className="text-sm text-gray-600">Data de lançamento: Janeiro 2024</p>
          </div>
        </div>

        {/* Notas da Versão */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBook className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Notas da Versão</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Versão 1.0.0 (Janeiro 2024)</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4 space-y-1">
                <li>Lançamento inicial do sistema</li>
                <li>Dashboard com visão geral e alertas</li>
                <li>Sistema de cadastro de periféricos</li>
                <li>Consulta por UNCP</li>
                <li>Relatórios e exportação para Excel</li>
                <li>Gerenciamento de estoque</li>
                <li>Sistema de descarte</li>
                <li>Configurações personalizáveis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Informações de Contato</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Suporte Técnico</p>
              <p className="text-sm text-gray-600">Email: suporte@ws2k.com.br</p>
              <p className="text-sm text-gray-600">Telefone: (11) 4444-4444</p>
            </div>
            <div>
              <p className="font-medium">Desenvolvimento</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiGithub />
                <a 
                  href="https://github.com/ws2k/perifcontrol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#90EE90] hover:underline"
                >
                  github.com/ws2k/perifcontrol
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Documentação */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBook className="text-[#90EE90]" />
            <h2 className="text-lg font-semibold">Documentação</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              A documentação completa do sistema está disponível para consulta, incluindo:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
              <li>Manual do usuário</li>
              <li>Guia de instalação</li>
              <li>FAQ (Perguntas frequentes)</li>
              <li>Políticas de uso</li>
              <li>Termos de serviço</li>
            </ul>
            <div className="mt-4">
              <button 
                onClick={gerarDocumentacao}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#90EE90] text-white rounded-lg hover:opacity-90"
              >
                <FiBook />
                Baixar Documentação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 