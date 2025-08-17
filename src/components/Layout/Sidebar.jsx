import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Shield, 
  FileText, 
  Settings, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard' },
  { icon: Building2, label: 'Empresas', section: 'companies' },
  { icon: Users, label: 'Funcionários', section: 'employees' },
  { icon: AlertTriangle, label: 'Inventário de Perigos', section: 'risk-inventory' },
  { icon: FileText, label: 'NRs', section: 'nrs' },
  { icon: MessageSquare, label: 'Chat IA', section: 'ai-chat' },
  { icon: Settings, label: 'Configurações', section: 'settings' },
];

export function Sidebar({ activeSection, onSectionChange }) {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-card border-r border-border h-screen flex flex-col"
    >
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-title-foreground">SST Manager</h1>
        <p className="text-sm text-subtitle-foreground">Sistema de Gestão SST</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.section}
            variant={activeSection === item.section ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3',
              activeSection === item.section && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onSectionChange(item.section)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>Versão 1.0.0</p>
          <p>© 2024 SST Manager</p>
        </div>
      </div>
    </motion.div>
  );
}