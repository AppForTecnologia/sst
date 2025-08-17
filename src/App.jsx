
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CompanyList } from '@/components/Companies/CompanyList';
import { EmployeeList } from '@/components/Employees/EmployeeList';
import { DangerGroupList } from '@/components/DangerGroups/DangerGroupList';
import { RiskInventory } from '@/components/RiskInventory/RiskInventory';
import { Settings } from '@/components/Settings/Settings';
import { NRScreen } from '@/components/NRs/NRScreen';
import { SegmentNrLink } from '@/components/NRs/SegmentNrLink';
import { AIChat } from '@/components/AIChat/AIChat';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarCollapsed(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionChange = (section) => {
    if (section === 'pgr') {
      toast({
        title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
      });
      return;
    }
    setActiveSection(section);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return <CompanyList />;
      case 'employees':
        return <EmployeeList />;
      case 'danger-groups':
        return <DangerGroupList />;
      case 'inventory':
        return <RiskInventory />;
      case 'nr':
        return <NRScreen />;
      case 'segment-nr-link':
        return <SegmentNrLink />;
      case 'ai-chat':
        return <AIChat />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>SST em Destaque - Segurança e Medicina do Trabalho</title>
        <meta name="description" content="Sistema completo para gestão de Segurança e Medicina do Trabalho (SST), incluindo a geração e atualização do Programa de Gerenciamento de Riscos (PGR) conforme NR-01. Gerencie empresas, funcionários, inventários de risco e gere relatórios profissionais." />
      </Helmet>
      
      <div className="flex h-screen bg-page-background text-foreground">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {renderContent()}
          </main>
        </div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;
