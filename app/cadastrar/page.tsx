'use client';

import { useState, useEffect } from 'react';
import { FiCamera, FiCreditCard, FiUserCheck, FiBox, FiTrash2, FiUpload, FiDownload, FiPlus, FiArrowLeft, FiFile } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

type PeripheralType = 'camera' | 'card-reader' | 'ecpf' | 'biometrics' | 'stock' | 'disposal';
type MotivoDaTroca = 'Ponto Novo' | 'Aparelho com Problema' | 'Exigencia do local';
type TipoPeriferico = 'Leitor de Cartão' | 'Leitor de E-CPF' | 'Câmera' | 'Biometria';
type StockMode = 'manual' | 'import' | null;
type MotivoDescarte = 'Defeito Irreparável' | 'Obsolescência' | 'Dano Físico' | 'Fim da Vida Útil' | 'Outro';

interface BatchItem {
  sn: string;
  tipo: TipoPeriferico;
  data: string;
  ocomon: string;
}

interface DisposalItem {
  sn: string;
  tipo: TipoPeriferico;
  data: string;
  ocomon: string;
  motivo: MotivoDescarte;
  observacao: string;
}

interface PeripheralItem {
  sn: string;
  uncp: string;
  data: string;
  ocomon: string;
  motivo: MotivoDaTroca;
  observacao: string;
}

export default function CadastrarPage() {
  const [selectedType, setSelectedType] = useState<PeripheralType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stockMode, setStockMode] = useState<StockMode>(null);
  const [disposalMode, setDisposalMode] = useState<'manual' | 'import' | null>(null);
  
  // Estados para cada tipo de periférico
  const [cameraItems, setCameraItems] = useState<PeripheralItem[]>([]);
  const [cardReaderItems, setCardReaderItems] = useState<PeripheralItem[]>([]);
  const [ecpfItems, setEcpfItems] = useState<PeripheralItem[]>([]);
  const [biometricsItems, setBiometricsItems] = useState<PeripheralItem[]>([]);
  const [stockItems, setStockItems] = useState<BatchItem[]>([]);
  const [disposalItems, setDisposalItems] = useState<DisposalItem[]>([]);

  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCameraItems = localStorage.getItem('cameraItems');
      const savedCardReaderItems = localStorage.getItem('cardReaderItems');
      const savedEcpfItems = localStorage.getItem('ecpfItems');
      const savedBiometricsItems = localStorage.getItem('biometricsItems');
      const savedStockItems = localStorage.getItem('stockItems');
      const savedDisposalItems = localStorage.getItem('disposalItems');

      if (savedCameraItems) setCameraItems(JSON.parse(savedCameraItems));
      if (savedCardReaderItems) setCardReaderItems(JSON.parse(savedCardReaderItems));
      if (savedEcpfItems) setEcpfItems(JSON.parse(savedEcpfItems));
      if (savedBiometricsItems) setBiometricsItems(JSON.parse(savedBiometricsItems));
      if (savedStockItems) setStockItems(JSON.parse(savedStockItems));
      if (savedDisposalItems) setDisposalItems(JSON.parse(savedDisposalItems));
    }
  }, []);

  // Simular usuário logado - Depois será integrado com autenticação
  const loggedInUser = "Técnico Exemplo";

  const peripheralTypes = [
    {
      type: 'camera' as PeripheralType,
      label: 'Câmera',
      icon: FiCamera,
    },
    {
      type: 'card-reader' as PeripheralType,
      label: 'Leitor de Cartão',
      icon: FiCreditCard,
    },
    {
      type: 'ecpf' as PeripheralType,
      label: 'Leitor de E-CPF',
      icon: FiUserCheck,
    },
    {
      type: 'biometrics' as PeripheralType,
      label: 'Biometria',
      icon: FiBox,
    },
    {
      type: 'stock' as PeripheralType,
      label: 'Estoque',
      icon: FiBox,
    },
    {
      type: 'disposal' as PeripheralType,
      label: 'Descarte',
      icon: FiTrash2,
    },
  ];

  const motivosDaTroca: MotivoDaTroca[] = [
    'Ponto Novo',
    'Aparelho com Problema',
    'Exigencia do local'
  ];

  const motivosDescarte: MotivoDescarte[] = [
    'Defeito Irreparável',
    'Obsolescência',
    'Dano Físico',
    'Fim da Vida Útil',
    'Outro'
  ];

  const tiposPeriferico: TipoPeriferico[] = [
    'Leitor de Cartão',
    'Leitor de E-CPF',
    'Câmera',
    'Biometria'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      if (selectedType === 'stock') {
        const items = json.map((item: any) => ({
          sn: item.SN || '',
          tipo: item.Tipo || 'Câmera',
          data: item.Data || '',
          ocomon: item.Ocomon || '',
        }));
        setStockItems([...stockItems, ...items]);
      } else if (selectedType === 'disposal') {
        const items = json.map((item: any) => ({
          sn: item.SN || '',
          tipo: item.Tipo || 'Câmera',
          data: item.Data || '',
          ocomon: item.Ocomon || '',
          motivo: item.Motivo || 'Defeito Irreparável',
          observacao: item.Observacao || '',
        }));
        setDisposalItems([...disposalItems, ...items]);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const downloadExcelTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([]);
    if (selectedType === 'stock') {
      XLSX.utils.sheet_add_aoa(ws, [['SN', 'Tipo', 'Data', 'Ocomon']]);
    } else if (selectedType === 'disposal') {
      XLSX.utils.sheet_add_aoa(ws, [['SN', 'Tipo', 'Data', 'Ocomon', 'Motivo', 'Observacao']]);
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `template_${selectedType}.xlsx`);
  };

  const handlePeripheralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      sn: formData.get('sn') as string,
      uncp: formData.get('uncp') as string,
      data: formData.get('data') as string,
      ocomon: formData.get('ocomon') as string,
      motivo: formData.get('motivo') as MotivoDaTroca,
      observacao: formData.get('observacao') as string
    };

    // Salvar no estado apropriado baseado no tipo selecionado
    switch (selectedType) {
      case 'camera':
        const newCameraItems = [...cameraItems, data];
        setCameraItems(newCameraItems);
        localStorage.setItem('cameraItems', JSON.stringify(newCameraItems));
        break;
      case 'card-reader':
        const newCardItems = [...cardReaderItems, data];
        setCardReaderItems(newCardItems);
        localStorage.setItem('cardReaderItems', JSON.stringify(newCardItems));
        break;
      case 'ecpf':
        const newEcpfItems = [...ecpfItems, data];
        setEcpfItems(newEcpfItems);
        localStorage.setItem('ecpfItems', JSON.stringify(newEcpfItems));
        break;
      case 'biometrics':
        const newBioItems = [...biometricsItems, data];
        setBiometricsItems(newBioItems);
        localStorage.setItem('biometricsItems', JSON.stringify(newBioItems));
        break;
    }

    alert('Item cadastrado com sucesso!');
    (e.target as HTMLFormElement).reset();
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockItems.length === 0) {
      alert('Adicione pelo menos um item antes de salvar.');
      return;
    }

    // Garantir que todos os campos obrigatórios estão preenchidos
    const hasEmptyFields = stockItems.some(item => !item.sn || !item.tipo || !item.data || !item.ocomon);
    if (hasEmptyFields) {
      alert('Por favor, preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    try {
      const currentItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
      const updatedItems = [...currentItems, ...stockItems];
      localStorage.setItem('stockItems', JSON.stringify(updatedItems));
      setStockItems(updatedItems); // Atualiza o estado com todos os itens
      setStockMode(null);
      alert('Itens salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
      alert('Erro ao salvar os itens. Por favor, tente novamente.');
    }
  };

  const handleDisposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentItems = JSON.parse(localStorage.getItem('disposalItems') || '[]');
    const updatedItems = [...currentItems, ...disposalItems];
    localStorage.setItem('disposalItems', JSON.stringify(updatedItems));
    setDisposalItems(updatedItems);
    setDisposalMode(null);
    alert('Itens descartados salvos com sucesso!');
  };

  const addBatchItem = () => {
    const newItem = { 
      sn: '', 
      tipo: 'camera' as TipoPeriferico, 
      data: new Date().toISOString().split('T')[0],
      ocomon: '' 
    };
    setStockItems(prev => [...prev, newItem]);
  };

  const updateBatchItem = (index: number, field: keyof BatchItem, value: string) => {
    setStockItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const removeBatchItem = (index: number) => {
    setStockItems(prev => prev.filter((_: BatchItem, i: number) => i !== index));
  };

  const renderHistory = () => {
    if (!selectedType) return null;

    let items: any[] = [];
    let title = '';

    switch (selectedType) {
      case 'camera':
        items = cameraItems.slice(-10).reverse(); // Últimos 10 itens, mais recentes primeiro
        title = 'Histórico de Câmeras';
        break;
      case 'card-reader':
        items = cardReaderItems.slice(-10).reverse();
        title = 'Histórico de Leitores de Cartão';
        break;
      case 'ecpf':
        items = ecpfItems.slice(-10).reverse();
        title = 'Histórico de Leitores de E-CPF';
        break;
      case 'biometrics':
        items = biometricsItems.slice(-10).reverse();
        title = 'Histórico de Biometrias';
        break;
      case 'stock':
        items = stockItems.slice(-10).reverse();
        title = 'Histórico de Estoque';
        break;
      case 'disposal':
        items = disposalItems.slice(-10).reverse();
        title = 'Histórico de Descarte';
        break;
    }

    if (items.length === 0) return null;

    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{title} (Últimos 10 itens)</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">SN/Patrimônio</span>
                  <p>{item.sn}</p>
                </div>
                {item.uncp && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">UNCP</span>
                    <p>{item.uncp}</p>
                  </div>
                )}
                {item.tipo && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tipo</span>
                    <p>{item.tipo}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Data</span>
                  <p>{item.data}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ocomon</span>
                  <p>{item.ocomon}</p>
                </div>
                {item.motivo && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Motivo</span>
                    <p>{item.motivo}</p>
                  </div>
                )}
                {item.observacao && (
                  <div className="col-span-full">
                    <span className="text-sm font-medium text-gray-500">Observação</span>
                    <p className="mt-1 text-sm">{item.observacao}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    let allItems: any[];
                    switch (selectedType) {
                      case 'camera':
                        allItems = JSON.parse(localStorage.getItem('cameraItems') || '[]');
                        allItems = allItems.filter((_: PeripheralItem, i: number) => i !== allItems.length - 1 - index);
                        setCameraItems(allItems);
                        localStorage.setItem('cameraItems', JSON.stringify(allItems));
                        break;
                      case 'card-reader':
                        allItems = JSON.parse(localStorage.getItem('cardReaderItems') || '[]');
                        allItems = allItems.filter((_: PeripheralItem, i: number) => i !== allItems.length - 1 - index);
                        setCardReaderItems(allItems);
                        localStorage.setItem('cardReaderItems', JSON.stringify(allItems));
                        break;
                      case 'ecpf':
                        allItems = JSON.parse(localStorage.getItem('ecpfItems') || '[]');
                        allItems = allItems.filter((_: PeripheralItem, i: number) => i !== allItems.length - 1 - index);
                        setEcpfItems(allItems);
                        localStorage.setItem('ecpfItems', JSON.stringify(allItems));
                        break;
                      case 'biometrics':
                        allItems = JSON.parse(localStorage.getItem('biometricsItems') || '[]');
                        allItems = allItems.filter((_: PeripheralItem, i: number) => i !== allItems.length - 1 - index);
                        setBiometricsItems(allItems);
                        localStorage.setItem('biometricsItems', JSON.stringify(allItems));
                        break;
                      case 'stock':
                        allItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
                        allItems = allItems.filter((_: BatchItem, i: number) => i !== allItems.length - 1 - index);
                        setStockItems(allItems);
                        localStorage.setItem('stockItems', JSON.stringify(allItems));
                        break;
                      case 'disposal':
                        allItems = JSON.parse(localStorage.getItem('disposalItems') || '[]');
                        allItems = allItems.filter((_: DisposalItem, i: number) => i !== allItems.length - 1 - index);
                        setDisposalItems(allItems);
                        localStorage.setItem('disposalItems', JSON.stringify(allItems));
                        break;
                    }
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStockOptions = () => {
    if (stockMode === null) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/cadastrar/adicionar"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3"
          >
            <FiPlus className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold">Adicionar Manualmente</h3>
            <p className="text-sm text-gray-500 text-center">
              Cadastre vários periféricos de uma vez
            </p>
          </Link>

          <button
            onClick={() => setStockMode('import')}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3"
          >
            <FiUpload className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold">Importar Planilha</h3>
            <p className="text-sm text-gray-500 text-center">
              Importe dados de uma planilha Excel
            </p>
          </button>
        </div>
      );
    }

    return null;
  };

  const renderManualBatchForm = () => {
    if (stockMode !== 'manual') return null;

    return (
      <form onSubmit={handleStockSubmit} className="space-y-4">
        {stockItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SN/Patrimônio *
                </label>
                <input
                  type="text"
                  value={item.sn}
                  onChange={(e) => updateBatchItem(index, 'sn', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo *
                </label>
                <select
                  value={item.tipo}
                  onChange={(e) => updateBatchItem(index, 'tipo', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="camera">Câmera</option>
                  <option value="card-reader">Leitor de Cartão</option>
                  <option value="ecpf">Leitor de E-CPF</option>
                  <option value="biometrics">Biometria</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data *
                </label>
                <input
                  type="date"
                  value={item.data}
                  onChange={(e) => updateBatchItem(index, 'data', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ocomon *
                </label>
                <input
                  type="text"
                  value={item.ocomon}
                  onChange={(e) => updateBatchItem(index, 'ocomon', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeBatchItem(index)}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={addBatchItem}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            + Adicionar Item
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Salvar Todos
          </button>
        </div>
      </form>
    );
  };

  const renderImportForm = () => {
    if (stockMode !== 'import') return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Importar Planilha</h2>
          <button
            onClick={() => setStockMode(null)}
            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="fileUpload"
                className="block w-full cursor-pointer bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors"
              >
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {selectedFile ? selectedFile.name : 'Clique ou arraste o arquivo Excel para importar'}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  Formatos aceitos: .xlsx, .xls, .csv
                </span>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile}
              className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center space-x-2 transition-colors ${
                selectedFile
                  ? 'bg-primary hover:bg-primary-dark'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <FiUpload className="w-5 h-5" />
              <span>Importar Periféricos</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Baixar Modelo da Planilha</h2>
          <button
            onClick={downloadExcelTemplate}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
          >
            <FiDownload className="w-5 h-5" />
            <span>Baixar Planilha Modelo</span>
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Baixe o modelo de planilha para importação em lote de periféricos.
            A planilha deve conter as colunas: SN/Patrimônio, Tipo de Periférico, Data e Número do Ocomon.
          </p>
        </div>
      </div>
    );
  };

  const renderStockForm = () => {
    return (
      <div className="space-y-6">
        {renderStockOptions()}
        {renderManualBatchForm()}
        {renderImportForm()}
      </div>
    );
  };

  const renderDisposalOptions = () => {
    if (disposalMode === null) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/cadastrar/descarte"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3"
          >
            <FiPlus className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold">Adicionar Manualmente</h3>
            <p className="text-sm text-gray-500 text-center">
              Cadastre vários periféricos para descarte
            </p>
          </Link>

          <button
            onClick={() => setDisposalMode('import')}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3"
          >
            <FiUpload className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold">Importar Planilha</h3>
            <p className="text-sm text-gray-500 text-center">
              Importe dados de uma planilha Excel
            </p>
          </button>
        </div>
      );
    }

    return null;
  };

  const renderDisposalForm = () => {
    if (disposalMode === 'import') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Importar Planilha de Descarte</h2>
            <button
              onClick={() => setDisposalMode(null)}
              className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="fileUpload"
                  className="block w-full cursor-pointer bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors"
                >
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
                    {selectedFile ? selectedFile.name : 'Clique ou arraste o arquivo Excel para importar'}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Formatos aceitos: .xlsx, .xls, .csv
                  </span>
                  <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center space-x-2 transition-colors ${
                    selectedFile
                      ? 'bg-primary hover:bg-primary-dark'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiUpload className="w-5 h-5" />
                  <span>Importar Periféricos</span>
                </button>

                <button
                  onClick={downloadExcelTemplate}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Baixar Modelo</span>
                </button>
              </div>
            </div>
          </div>

          {disposalItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Itens Importados</h3>
                <button
                  onClick={() => generateDisposalPDF(disposalItems)}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <FiFile className="w-5 h-5" />
                  <span>Gerar PDF</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {disposalItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <p><strong>SN:</strong> {item.sn}</p>
                      <p><strong>Tipo:</strong> {item.tipo}</p>
                      <p><strong>Data:</strong> {item.data}</p>
                      <p><strong>Ocomon:</strong> {item.ocomon}</p>
                      <p><strong>Motivo:</strong> {item.motivo}</p>
                      <p><strong>Observação:</strong> {item.observacao}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleDisposalSubmit}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md transition-colors"
                >
                  Confirmar Descarte
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Descarte de Periféricos</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => generateDisposalPDF(disposalItems)}
              className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
              disabled={disposalItems.length === 0}
            >
              <FiFile className="w-5 h-5" />
              <span>Gerar PDF</span>
            </button>
            <button
              onClick={() => setDisposalMode(null)}
              className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleDisposalSubmit} className="space-y-4">
          {disposalItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Item {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = disposalItems.filter((_, i: number) => i !== index);
                    setDisposalItems(newItems);
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SN/Patrimônio
                  </label>
                  <input
                    type="text"
                    value={item.sn}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, sn: e.target.value };
                      setDisposalItems(newItems);
                    }}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Periférico
                  </label>
                  <select
                    value={item.tipo}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, tipo: e.target.value as TipoPeriferico };
                      setDisposalItems(newItems);
                    }}
                    className="input-field mt-1"
                    required
                  >
                    {tiposPeriferico.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data
                  </label>
                  <input
                    type="date"
                    value={item.data}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, data: e.target.value };
                      setDisposalItems(newItems);
                    }}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número do Ocomon
                  </label>
                  <input
                    type="text"
                    value={item.ocomon}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, ocomon: e.target.value };
                      setDisposalItems(newItems);
                    }}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Motivo do Descarte
                  </label>
                  <select
                    value={item.motivo}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, motivo: e.target.value as MotivoDescarte };
                      setDisposalItems(newItems);
                    }}
                    className="input-field mt-1"
                    required
                  >
                    {motivosDescarte.map((motivo) => (
                      <option key={motivo} value={motivo}>
                        {motivo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Observação
                  </label>
                  <textarea
                    value={item.observacao}
                    onChange={(e) => {
                      const newItems = [...disposalItems];
                      newItems[index] = { ...item, observacao: e.target.value };
                      setDisposalItems(newItems);
                    }}
                    rows={3}
                    className="input-field mt-1"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setDisposalItems([...disposalItems, { 
                sn: '', 
                tipo: 'Câmera', 
                data: new Date().toISOString().split('T')[0],
                ocomon: '', 
                motivo: 'Defeito Irreparável', 
                observacao: '' 
              }])}
              className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Adicionar Item</span>
            </button>

            {disposalItems.length > 0 && (
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md transition-colors"
              >
                Salvar Todos
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const renderDisposalFormFinal = () => {
    return (
      <div className="space-y-6">
        {renderDisposalOptions()}
        {disposalMode && renderDisposalForm()}
      </div>
    );
  };

  const renderPeripheralForm = () => {
    return (
      <>
        <div>
          <label htmlFor="uncp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            UNCP
          </label>
          <input
            type="text"
            id="uncp"
            name="uncp"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="Ex: 0001"
            className="input-field mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Número de Série
          </label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            className="input-field mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data da Instalação
          </label>
          <input
            type="date"
            id="installDate"
            name="installDate"
            className="input-field mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="motivoTroca" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Motivo da Troca
          </label>
          <select
            id="motivoTroca"
            name="motivoTroca"
            className="input-field mt-1"
            required
          >
            <option value="">Selecione um motivo</option>
            {motivosDaTroca.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ocomon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ocomon
          </label>
          <input
            type="text"
            id="ocomon"
            name="ocomon"
            className="input-field mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Observação
          </label>
          <textarea
            id="observacao"
            name="observacao"
            rows={3}
            className="input-field mt-1"
            placeholder="Digite aqui observações importantes..."
          />
        </div>

        <div>
          <label htmlFor="technician" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Técnico
          </label>
          <input
            type="text"
            id="technician"
            name="technician"
            value={loggedInUser}
            className="input-field mt-1 bg-gray-100"
            readOnly
          />
        </div>
      </>
    );
  };

  const renderForm = () => {
    if (!selectedType) return null;

    return (
      <form onSubmit={handlePeripheralSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">
          {/* Formulário para câmera, leitor de cartão, e-cpf e biometria */}
          {(selectedType === 'camera' || 
            selectedType === 'card-reader' || 
            selectedType === 'ecpf' || 
            selectedType === 'biometrics') && renderPeripheralForm()}

          {/* Formulário de Estoque */}
          {selectedType === 'stock' && renderStockForm()}

          {/* Formulário de Descarte */}
          {selectedType === 'disposal' && renderDisposalFormFinal()}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </form>
    );
  };

  const generateDisposalPDF = (items: DisposalItem[]) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('pt-BR');
    
    // Cabeçalho
    doc.setFontSize(16);
    doc.text('Termo de Descarte de Periféricos', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Data: ${today}`, 20, 30);
    doc.text(`Técnico: ${loggedInUser}`, 20, 40);
    
    // Tabela de itens
    let y = 60;
    doc.setFontSize(10);
    items.forEach((item, index) => {
      if (y > 250) { // Nova página se necessário
        doc.addPage();
        y = 20;
      }
      
      doc.text(`${index + 1}. SN: ${item.sn}`, 20, y);
      doc.text(`Tipo: ${item.tipo}`, 20, y + 5);
      doc.text(`Data: ${item.data}`, 20, y + 10);
      doc.text(`Ocomon: ${item.ocomon}`, 20, y + 15);
      doc.text(`Motivo: ${item.motivo}`, 20, y + 20);
      doc.text(`Observação: ${item.observacao}`, 20, y + 25);
      
      y += 35;
    });
    
    // Assinaturas
    doc.line(20, y + 20, 90, y + 20); // Linha para assinatura
    doc.text('Técnico Responsável', 55, y + 25, { align: 'center' });
    
    doc.line(120, y + 20, 190, y + 20); // Linha para assinatura
    doc.text('Supervisor', 155, y + 25, { align: 'center' });
    
    // Salvar o PDF
    doc.save('termo_descarte.pdf');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cadastrar Periférico</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {peripheralTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center space-y-3 ${
                selectedType === type.type ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Icon className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          );
        })}
      </div>

      {renderForm()}
      {renderHistory()}
    </div>
  );
}