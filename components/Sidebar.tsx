'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiPlusCircle, FiFileText, FiSettings, FiInfo } from 'react-icons/fi';

const menuItems = [
  { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { href: '/consultar', icon: FiSearch, label: 'Consultar' },
  { href: '/cadastrar', icon: FiPlusCircle, label: 'Cadastrar' },
  { href: '/relatorios', icon: FiFileText, label: 'Relatório' },
  { href: '/configuracoes', icon: FiSettings, label: 'Configurações' },
  { href: '/sobre', icon: FiInfo, label: 'Sobre' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}