
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function EmployeeForm({ employee, onSave, onCancel }) {
  const { companies } = useData();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    cpf: employee?.cpf || '',
    companyId: employee?.companyId || '',
    sector: employee?.sector || '',
    role: employee?.role || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf || !formData.companyId || !formData.role) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...formData,
      id: employee?.id || Date.now(),
      companyId: parseInt(formData.companyId),
      createdAt: employee?.createdAt || new Date().toISOString()
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-title-foreground">
            {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Nome do Funcionário *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  CPF *
                </label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Empresa *
                </label>
                <Select
                  value={formData.companyId}
                  onChange={(e) => handleChange('companyId', e.target.value)}
                  required
                >
                  <option value="">Selecione uma empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Setor
                </label>
                <Input
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  placeholder="Setor de atuação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Função *
                </label>
                <Input
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="Função ou cargo"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {employee ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
