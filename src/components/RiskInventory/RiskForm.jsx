
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultiSelectCombobox } from '@/components/ui/MultiSelectCombobox';
import { ProtectionMeasuresSelector } from './ProtectionMeasuresSelector';
import { useData } from '@/contexts/DataContext';
import { PROBABILITY_LEVELS, SEVERITY_LEVELS } from '@/data/mockData';
import { calculateRiskLevel } from '@/utils/riskCalculations';
import { toast } from '@/components/ui/use-toast';

export function RiskForm({ risk, sectors, functions, onSave, onCancel }) {
  const { dangerSources, dangers, protectionMeasures, injuries } = useData();

  const [formData, setFormData] = useState({
    sectorId: risk?.sectorId || '',
    functionIds: risk?.functionIds || [],
    sourceId: risk?.sourceId || '',
    dangerId: risk?.dangerId || '',
    description: risk?.description || '',
    probability: risk?.probability || 1,
    severity: risk?.severity || 1,
    technicalResponsible: risk?.technicalResponsible || '',
    protectionMeasures: risk?.protectionMeasures || [], // Nova estrutura
    injuryIds: risk?.injuryIds || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.sectorId || !formData.sourceId || !formData.dangerId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos de Setor, Fonte Geradora e Perigo.",
        variant: "destructive"
      });
      return;
    }

    const riskLevel = calculateRiskLevel(formData.probability, formData.severity);
    const sector = sectors.find(s => s.id === parseInt(formData.sectorId));
    const selectedFunctions = functions.filter(f => formData.functionIds.includes(f.id));
    const source = dangerSources.find(s => s.id === parseInt(formData.sourceId));
    const danger = dangers.find(d => d.id === parseInt(formData.dangerId));

    onSave({
      ...formData,
      id: risk?.id || Date.now(),
      sectorId: parseInt(formData.sectorId),
      functionIds: formData.functionIds,
      sourceId: parseInt(formData.sourceId),
      dangerId: parseInt(formData.dangerId),
      sectorName: sector?.name,
      functionNames: selectedFunctions.map(f => f.name),
      sourceName: source?.name,
      dangerName: danger?.name,
      riskLevel,
      createdAt: risk?.createdAt || new Date().toISOString()
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentRiskLevel = calculateRiskLevel(formData.probability, formData.severity);
  const availableDangers = dangers;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-title-foreground">{risk ? 'Editar Perigo' : 'Novo Perigo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Setor *</label>
                <Select value={formData.sectorId} onChange={(e) => handleChange('sectorId', e.target.value)} required>
                  <option value="">Selecione um setor</option>
                  {sectors.map(sector => (<option key={sector.id} value={sector.id}>{sector.name}</option>))}
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Funções</label>
                <MultiSelectCombobox
                  options={functions}
                  selected={formData.functionIds}
                  onChange={(selectedIds) => handleChange('functionIds', selectedIds)}
                  placeholder="Selecione as funções (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Fonte Geradora *</label>
                <Select value={formData.sourceId} onChange={(e) => handleChange('sourceId', e.target.value)} required>
                  <option value="">Selecione uma fonte</option>
                  {dangerSources.map(source => (<option key={source.id} value={source.id}>{source.name}</option>))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Perigo *</label>
                <Select value={formData.dangerId} onChange={(e) => handleChange('dangerId', e.target.value)} required>
                  <option value="">Selecione um perigo</option>
                  {availableDangers.map(danger => (<option key={danger.id} value={danger.id}>{danger.name}</option>))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Avaliação Descritiva</label>
              <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descreva o perigo..." rows={4}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Probabilidade</label>
                <Select value={formData.probability} onChange={(e) => handleChange('probability', parseInt(e.target.value))}>
                  {PROBABILITY_LEVELS.map(level => (<option key={level.id} value={level.value}>{level.name} ({level.value})</option>))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Severidade</label>
                <Select value={formData.severity} onChange={(e) => handleChange('severity', parseInt(e.target.value))}>
                  {SEVERITY_LEVELS.map(level => (<option key={level.id} value={level.value}>{level.name} ({level.value})</option>))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Nível de Risco</label>
                <div className="flex items-center space-x-2 h-10">
                   <Badge style={{ backgroundColor: currentRiskLevel.color.replace('bg-', 'var(--color-') }} className="text-white">
                      {currentRiskLevel.level} ({currentRiskLevel.value})
                   </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                Medidas de Proteção com Status de Implementação
              </label>
              <ProtectionMeasuresSelector
                availableMeasures={protectionMeasures}
                selectedMeasures={formData.protectionMeasures}
                onChange={(measures) => handleChange('protectionMeasures', measures)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Lesões Associadas</label>
              <MultiSelectCombobox
                options={injuries}
                selected={formData.injuryIds}
                onChange={(selectedIds) => handleChange('injuryIds', selectedIds)}
                placeholder="Selecione as lesões..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">{risk ? 'Atualizar' : 'Salvar'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
