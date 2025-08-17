
import React, { useState } from 'react';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CompanyList } from '@/components/Companies/CompanyList';
import { EmployeeList } from '@/components/Employees/EmployeeList';
import { RiskInventory } from '@/components/RiskInventory/RiskInventory';
import { NRScreen } from '@/components/NRs/NRScreen';
import { AIChat } from '@/components/AIChat/AIChat';
import { Settings } from '@/components/Settings/Settings';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/toaster';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return <CompanyList />;
      case 'employees':
        return <EmployeeList />;
      case 'risk-inventory':
        return <RiskInventory />;
      case 'nrs':
        return <NRScreen />;
      case 'ai-chat':
        return <AIChat />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
