'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { FiUser, FiLogOut } from 'react-icons/fi';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">PerifControl</h1>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <FiUser />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <a
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUser className="inline mr-2" />
                    Perfil
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiLogOut className="inline mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}