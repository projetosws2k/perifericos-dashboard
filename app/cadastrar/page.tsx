'use client';

import { useState } from 'react';
import { FiCamera, FiCreditCard, FiUserCheck, FiBox, FiTrash2 } from 'react-icons/fi';

type PeripheralType = 'camera' | 'card-reader' | 'ecpf' | 'biometrics' | 'stock' | 'disposal';

export default function CadastrarPage() {
  const [selectedType, setSelectedType] = useState<PeripheralType | null>(null);

  const peripheralTypes = [
    { id: 'camera', label: 'Câmera', icon: FiCamera },
    { id: 'card-reader', label: 'Leitor de Cartão', icon: FiCreditCard },
    { id: 'ecpf', label: 'Leitor de e-CPF', icon: FiCreditCard },
    { id: 'biometrics', label: 'Biometria', icon: FiUserCheck },
    { id: 'stock', label: 'Estoque', icon: FiBox },
    { id: 'disposal', label: 'Descarte', icon: FiTrash2 },
  ];

  const renderForm = () => {
    if (!selectedType) return null;

    return (
      <form className="mt-6 space-y-6">
        <div className="space-y-4">
          {/* Common Fields */}
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
            <label htmlFor="uncp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              UNCP
            </label>
            <input
              type="text"
              id="uncp"
              name="uncp"
              pattern="[0-9]{4}"
              maxLength={4}
              className="input-field mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Instalação
            </label>
            <input
              type="date"
              id="installDate"
              name="installDate"
              className="input-field mt-1"
              required
            />
          </div>

          {/* Specific Fields */}
          {selectedType === 'camera' && (
            <>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modelo
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resolução
                </label>
                <input
                  type="text"
                  id="resolution"
                  name="resolution"
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Localização
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="input-field mt-1"
                  required
                />
              </div>
            </>
          )}

          {selectedType === 'disposal' && (
            <>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Motivo do Descarte
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  className="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label htmlFor="disposalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data do Descarte
                </label>
                <input
                  type="date"
                  id="disposalDate"
                  name="disposalDate"
                  className="input-field mt-1"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Responsável
            </label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              className="input-field mt-1"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            Cadastrar
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Cadastrar Periférico
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {peripheralTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as PeripheralType)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm text-center">{type.label}</span>
              </button>
            );
          })}
        </div>

        {renderForm()}
      </div>
    </div>
  );
}