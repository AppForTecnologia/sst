import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building,
  Users,
  ShieldCheck,
  BookOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  HeartPulse,
  Bot,
  FileText,
  Link2,
  Tags
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard' },
  { icon: Building, label: 'Empresas', section: 'companies' },
  { icon: Users, label: 'Funcionários', section: 'employees' },
  { icon: Tags, label: 'Grupos de Perigos', section: 'danger-groups' },
  { icon: ShieldCheck, label: 'Inventário', section: 'inventory' },
  { icon: BookOpen, label: 'NR', section: 'nr' },
  { icon: Link2, label: 'Vincular NRs', section: 'segment-nr-link' },
  { icon: Bot, label: 'Chat IA', section: 'ai-chat' },
  { icon: FileText, label: 'PGR', section: 'pgr' },
  { icon: Settings, label: 'Configurações', section: 'settings' },
];

const sidebarVariants = {
  collapsed: { width: '80px', transition: { duration: 0.3, ease: 'easeInOut' } },
  expanded: { width: '250px', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const logoVariants = {
  collapsed: { opacity: 0, scale: 0.8, x: -10, transition: { duration: 0.2 } },
  expanded: { opacity: 1, scale: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } },
};

const navItemVariants = {
  collapsed: { x: -10, opacity: 0 },
  expanded: { x: 0, opacity: 1 },
};

export function Sidebar({ isCollapsed, isMobile, onToggle, activeSection, onSectionChange }) {
  if (isMobile && isCollapsed) {
    return null;
  }

  const handleItemClick = (section) => {
    onSectionChange(section);
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial={isCollapsed ? 'collapsed' : 'expanded'}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      className={cn(
        "bg-sidebar-background text-white flex flex-col relative",
        isMobile ? 'fixed inset-y-0 left-0 z-50' : ''
      )}
    >
      <div className="flex items-center h-16 px-6 border-b border-border">
        <HeartPulse className="h-8 w-8 text-logo-primary" />
        <motion.h1
          variants={logoVariants}
          className="text-xl font-bold ml-2 whitespace-nowrap text-logo-text"
        >
          SST em Destaque
        </motion.h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.section}
            variant={activeSection === item.section ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start text-base h-12",
              activeSection === item.section ? "bg-accent/20 text-white" : "text-gray-300 hover:bg-accent/10 hover:text-white"
            )}
            onClick={() => handleItemClick(item.section)}
          >
            <item.icon className="h-6 w-6" />
            <motion.span
              variants={navItemVariants}
              className="ml-4 whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </Button>
        ))}
      </nav>

      {!isMobile && (
        <div className="px-4 py-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={onToggle}
          >
            {isCollapsed ? <ChevronsRight className="h-6 w-6" /> : <ChevronsLeft className="h-6 w-6" />}
          </Button>
        </div>
      )}
    </motion.div>
  );
}