import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Componente para selecionar medidas de proteção com status de implementação
 * Interface compacta com dropdown e seleção direta
 */
export function ProtectionMeasuresSelector({ 
  availableMeasures, 
  selectedMeasures, 
  onChange 
}) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Atualiza o status de implementação de uma medida
   * @param {number} measureId - ID da medida
   * @param {string} status - Novo status
   */
  const handleStatusChange = (measureId, status) => {
    if (status === '') {
      // Remove a medida se o status for vazio
      onChange(selectedMeasures.filter(m => m.measureId !== measureId));
      return;
    }

    const existingMeasure = selectedMeasures.find(m => m.measureId === measureId);
    
    if (existingMeasure) {
      // Atualiza medida existente
      onChange(selectedMeasures.map(m => 
        m.measureId === measureId 
          ? { ...m, implementationStatus: status }
          : m
      ));
    } else {
      // Adiciona nova medida
      const measure = availableMeasures.find(m => m.id === measureId);
      if (measure) {
        onChange([...selectedMeasures, {
          measureId: measureId,
          measureName: measure.name,
          implementationStatus: status
        }]);
      }
    }
  };

  /**
   * Obtém o texto do status de implementação
   * @param {string} status - Status da implementação
   * @returns {string} - Texto descritivo do status
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'yes': return 'Sim';
      case 'no': return 'Não';
      case 'not_applicable': return 'N/A';
      default: return 'Selecionar';
    }
  };

  /**
   * Obtém a cor do badge baseada no status
   * @param {string} status - Status da implementação
   * @returns {string} - Classe CSS da cor
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'yes': return 'bg-green-100 text-green-800 border-green-200';
      case 'no': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_applicable': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  /**
   * Obtém o status atual de uma medida
   * @param {number} measureId - ID da medida
   * @returns {string} - Status atual ou string vazia
   */
  const getCurrentStatus = (measureId) => {
    const measure = selectedMeasures.find(m => m.measureId === measureId);
    return measure ? measure.implementationStatus : '';
  };

  /**
   * Verifica se uma medida está selecionada
   * @param {number} measureId - ID da medida
   * @returns {boolean} - true se selecionada
   */
  const isMeasureSelected = (measureId) => {
    return selectedMeasures.some(m => m.measureId === measureId);
  };

  /**
   * Remove uma medida selecionada
   * @param {number} measureId - ID da medida
   */
  const removeMeasure = (measureId) => {
    onChange(selectedMeasures.filter(m => m.measureId !== measureId));
  };

  return (
    <div className="space-y-4">
      {/* Botão de Seleção */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            <Shield className="h-4 w-4 mr-2" />
            {selectedMeasures.length === 0 
              ? "Selecionar medidas de proteção..." 
              : `${selectedMeasures.length} medida${selectedMeasures.length !== 1 ? 's' : ''} selecionada${selectedMeasures.length !== 1 ? 's' : ''}`
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-3 border-b">
            <h4 className="font-medium text-sm">Medidas de Proteção</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Selecione o status para cada medida
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {availableMeasures.map((measure) => {
              const currentStatus = getCurrentStatus(measure.id);
              const isSelected = isMeasureSelected(measure.id);
              
              return (
                <div
                  key={measure.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                >
                  {/* Checkbox e Nome */}
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Adiciona com status padrão 'pending'
                          onChange([...selectedMeasures, {
                            measureId: measure.id,
                            measureName: measure.name,
                            implementationStatus: 'pending'
                          }]);
                        } else {
                          // Remove
                          removeMeasure(measure.id);
                        }
                      }}
                    />
                    <Shield className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-medium">
                      {measure.name}
                    </span>
                  </div>

                  {/* Status Select */}
                  {isSelected && (
                    <Select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(measure.id, e.target.value)}
                      className="w-32"
                    >
                      <option value="pending">Pendente</option>
                      <option value="yes">Sim</option>
                      <option value="no">Não</option>
                      <option value="not_applicable">N/A</option>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Lista de Medidas Selecionadas */}
      {selectedMeasures.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Medidas Selecionadas ({selectedMeasures.length})
          </h4>
          
          {selectedMeasures.map((selectedMeasure) => {
            const measure = availableMeasures.find(m => m.id === selectedMeasure.measureId);
            if (!measure) return null;

            return (
              <motion.div
                key={selectedMeasure.measureId}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-foreground">
                    {measure.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Select */}
                  <Select
                    value={selectedMeasure.implementationStatus}
                    onChange={(e) => handleStatusChange(selectedMeasure.measureId, e.target.value)}
                    className="w-32"
                  >
                    <option value="pending">Pendente</option>
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                    <option value="not_applicable">N/A</option>
                  </Select>

                  {/* Badge de Status */}
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(selectedMeasure.implementationStatus)} shrink-0`}
                  >
                    {getStatusText(selectedMeasure.implementationStatus)}
                  </Badge>

                  {/* Botão Remover */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMeasure(selectedMeasure.measureId)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    title="Remover medida"
                  >
                    ×
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Resumo das Seleções */}
      {selectedMeasures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-muted/30 rounded-lg border"
        >
          <h4 className="text-sm font-medium text-foreground mb-3">
            Resumo das Seleções
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedMeasures.filter(m => m.implementationStatus === 'yes').length}
              </div>
              <div className="text-xs text-muted-foreground">Serão implementadas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {selectedMeasures.filter(m => m.implementationStatus === 'no').length}
              </div>
              <div className="text-xs text-muted-foreground">Não implementadas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {selectedMeasures.filter(m => m.implementationStatus === 'not_applicable').length}
              </div>
              <div className="text-xs text-muted-foreground">Não aplicáveis</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mensagem quando não há seleções */}
      {selectedMeasures.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 text-muted-foreground"
        >
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma medida selecionada</p>
          <p className="text-xs">Clique no botão acima para selecionar medidas</p>
        </motion.div>
      )}
    </div>
  );
}
