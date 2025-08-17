import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="relative overflow-hidden border-l-4 border-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-subtitle-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-accent`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-title-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const RiskChart = () => {
  const riskData = [
    { level: 'Muito Alto', count: 3, color: 'bg-red-500' },
    { level: 'Alto', count: 8, color: 'bg-orange-500' },
    { level: 'Médio', count: 15, color: 'bg-yellow-500' },
    { level: 'Baixo', count: 22, color: 'bg-green-500' },
    { level: 'Muito Baixo', count: 12, color: 'bg-blue-500' }
  ];

  const maxCount = Math.max(...riskData.map(item => item.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Distribuição de Perigos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskData.map((item, index) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-24 text-sm font-medium text-subtitle-foreground truncate">{item.level}</div>
              <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / maxCount) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
              <div className="w-8 text-sm font-bold text-title-foreground">{item.count}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivities = () => {
  const activities = [
    { id: 1, action: 'PGR atualizado', company: 'Construtora ABC', time: '2 horas atrás', type: 'update' },
    { id: 2, action: 'Novo perigo identificado', company: 'Metalúrgica XYZ', time: '4 horas atrás', type: 'risk' },
    { id: 3, action: 'Funcionário cadastrado', company: 'Escritório 123', time: '1 dia atrás', type: 'employee' },
    { id: 4, action: 'Medida implementada', company: 'Hospital Central', time: '2 dias atrás', type: 'measure' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'update': return FileText;
      case 'risk': return AlertTriangle;
      case 'employee': return Users;
      case 'measure': return Target;
      default: return FileText;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'update': return 'text-accent';
      case 'risk': return 'text-destructive';
      case 'employee': return 'text-green-500';
      case 'measure': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon className={`h-4 w-4 mt-1 ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-title-foreground">{activity.action}</p>
                  <p className="text-sm text-subtitle-foreground truncate">{activity.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export function Dashboard() {
  const [companies] = useLocalStorage('pgr_companies', []);
  const [employees] = useLocalStorage('pgr_employees', []);
  const [inventories] = useLocalStorage('pgr_inventories', []);

  const totalRisks = inventories.reduce((total, inv) => total + (inv.risks?.length || 0), 0);
  const criticalRisks = inventories.reduce((total, inv) => {
    return total + (inv.risks?.filter(risk => risk.riskLevel?.level === 'Muito Alto' || risk.riskLevel?.level === 'Alto').length || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Dashboard</h1>
          <p className="text-subtitle-foreground mt-1">Visão geral do sistema SST em Destaque</p>
        </div>
        <Badge variant="outline" className="text-sm self-start sm:self-center">
          {new Date().toLocaleDateString('pt-BR')}
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Empresas"
          value={companies.length}
          icon={Building2}
          trend="+2 este mês"
          color="primary"
        />
        <StatCard
          title="Funcionários"
          value={employees.length}
          icon={Users}
          trend="+15 este mês"
          color="green"
        />
        <StatCard
          title="Perigos"
          value={totalRisks}
          icon={Shield}
          trend="+8 esta semana"
          color="purple"
        />
        <StatCard
          title="Perigos Críticos"
          value={criticalRisks}
          icon={AlertTriangle}
          trend="3 pendentes"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskChart />
        <RecentActivities />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PGRs por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Vigentes</span>
                <Badge variant="default">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Em Revisão</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Vencidos</span>
                <Badge variant="destructive">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setores com Mais Perigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Produção</span>
                <span className="text-sm font-bold">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Manutenção</span>
                <span className="text-sm font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-subtitle-foreground">Almoxarifado</span>
                <span className="text-sm font-bold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-title-foreground">Revisão PGR - Empresa ABC</p>
                <p className="text-subtitle-foreground">Vence em 5 dias</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-title-foreground">Treinamento de Segurança</p>
                <p className="text-subtitle-foreground">Agendado para próxima semana</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-title-foreground">Auditoria Interna</p>
                <p className="text-subtitle-foreground">Em 15 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}