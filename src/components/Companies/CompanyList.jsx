
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyForm } from './CompanyForm';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function CompanyList() {
  const { companies, setCompanies, employees, segments } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [companies]);

  const handleSave = (companyData) => {
    if (editingCompany) {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...editingCompany, ...companyData } : c));
      toast({ title: "Sucesso!", description: "Empresa atualizada com sucesso." });
    } else {
      const newCompany = {
        ...companyData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setCompanies(prev => [...prev, newCompany]);
      toast({ title: "Sucesso!", description: "Empresa cadastrada com sucesso." });
    }
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = (companyId) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({ title: "Sucesso", description: "Empresa removida com sucesso!" });
  };

  const getEmployeeCount = (companyId) => {
    return employees.filter(emp => emp.companyId === companyId).length;
  };

  const getSegmentName = (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    return segment?.name || 'Não especificado';
  };

  const getRiskLevelBadge = (level) => {
    const colors = {
      1: 'bg-green-200/20 text-green-400 border-green-400/50',
      2: 'bg-yellow-200/20 text-yellow-400 border-yellow-400/50',
      3: 'bg-orange-200/20 text-orange-400 border-orange-400/50',
      4: 'bg-red-200/20 text-red-400 border-red-400/50'
    };
    const labels = { 1: 'Baixo', 2: 'Médio', 3: 'Alto', 4: 'Muito Alto' };
    return (
      <Badge variant="outline" className={colors[level]}>
        Grau {level} - {labels[level]}
      </Badge>
    );
  };

  if (showForm) {
    return (
      <CompanyForm
        company={editingCompany}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingCompany(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Empresas</h1>
          <p className="text-subtitle-foreground mt-1">Gerencie as empresas cadastradas no sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Nova Empresa</span>
        </Button>
      </div>

      {sortedCompanies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-title-foreground mb-2">Nenhuma empresa cadastrada</h3>
          <p className="text-subtitle-foreground mb-6">Comece cadastrando sua primeira empresa no sistema.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Primeira Empresa
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg text-title-foreground truncate">{company.name}</CardTitle>
                        <p className="text-sm text-subtitle-foreground">{company.cnpj}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(company)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(company.id)} className="h-8 w-8 text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <p className="text-sm text-subtitle-foreground mb-1">Segmento</p>
                    <p className="font-medium text-title-foreground">{getSegmentName(company.segment_id)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-subtitle-foreground">
                        {getEmployeeCount(company.id)} funcionários
                      </span>
                    </div>
                    {getRiskLevelBadge(company.risk_grade)}
                  </div>

                  {company.cnae && (
                    <div>
                      <p className="text-sm text-subtitle-foreground">CNAE: {company.cnae}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/50 mt-auto">
                    <p className="text-xs text-muted-foreground">
                      Cadastrado em {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
