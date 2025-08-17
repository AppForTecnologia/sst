
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectCombobox } from '@/components/ui/MultiSelectCombobox';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function NrDetailForm({ detail, onSave, onCancel }) {
  const { dangers, injuries, protectionMeasures } = useData();
  const [formData, setFormData] = useState({
    danger_id: detail?.danger_id || '',
    injury_ids: detail?.injury_ids || [],
    protection_measure_ids: detail?.protection_measure_ids || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.danger_id) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, selecione um perigo.",
        variant: "destructive",
      });
      return;
    }
    onSave({
      danger_id: parseInt(formData.danger_id),
      injury_ids: formData.injury_ids,
      protection_measure_ids: formData.protection_measure_ids,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-title-foreground">
            {detail ? 'Editar Perigo da NR' : 'Adicionar Novo Perigo à NR'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Perigo *</label>
              <Select
                value={formData.danger_id}
                onChange={(e) => handleChange('danger_id', e.target.value)}
                required
              >
                <option value="">Selecione um perigo</option>
                {dangers.map(danger => (
                  <option key={danger.id} value={danger.id}>{danger.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Lesões Associadas</label>
              <MultiSelectCombobox
                options={injuries}
                selected={formData.injury_ids}
                onChange={(selectedIds) => handleChange('injury_ids', selectedIds)}
                placeholder="Selecione as lesões..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Medidas de Proteção Recomendadas</label>
              <MultiSelectCombobox
                options={protectionMeasures}
                selected={formData.protection_measure_ids}
                onChange={(selectedIds) => handleChange('protection_measure_ids', selectedIds)}
                placeholder="Selecione as medidas..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">{detail ? 'Atualizar Perigo' : 'Salvar Perigo'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
