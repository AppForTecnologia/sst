
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function CompanyForm({ company, onSave, onCancel }) {
  const { segments } = useData();
  const [formData, setFormData] = useState({
    name: company?.name || '',
    cnpj: company?.cnpj || '',
    cnae: company?.cnae || '',
    risk_grade: company?.risk_grade || 1,
    segment_id: company?.segment_id || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cnpj) {
      toast({
        title: "Erro",
        description: "Nome da Empresa e CNPJ são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    onSave({
      ...formData,
      segment_id: formData.segment_id ? parseInt(formData.segment_id) : null,
      risk_grade: parseInt(formData.risk_grade),
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
            {company ? 'Editar Empresa' : 'Nova Empresa'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Nome da Empresa *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  CNPJ *
                </label>
                <Input
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  CNAE
                </label>
                <Input
                  value={formData.cnae}
                  onChange={(e) => handleChange('cnae', e.target.value)}
                  placeholder="0000-0/00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Segmento
                </label>
                <Select
                  value={formData.segment_id}
                  onChange={(e) => handleChange('segment_id', e.target.value)}
                >
                  <option value="">Selecione um segmento</option>
                  {segments.map(segment => (
                    <option key={segment.id} value={segment.id}>
                      {segment.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                  Grau de Perigo
                </label>
                <Select
                  value={formData.risk_grade}
                  onChange={(e) => handleChange('risk_grade', e.target.value)}
                >
                  <option value={1}>Grau 1 - Baixo</option>
                  <option value={2}>Grau 2 - Médio</option>
                  <option value={3}>Grau 3 - Alto</option>
                  <option value={4}>Grau 4 - Muito Alto</option>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {company ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
