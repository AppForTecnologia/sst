import React from 'react';
import { motion } from 'framer-motion';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

/**
 * Componente simplificado para selecionar medidas de proteção com status de implementação
 * Interface mais dinâmica e fácil de usar
 */
export function ProtectionMeasuresSelector({ 
  availableMeasures, 
  selectedMeasures, 
  onChange 
}) {
  
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

  return (
    <div className="space-y-3">
      <div className="text-sm text-subtitle-foreground mb-4">
        Selecione o status de implementação para cada medida de proteção:
      </div>
      
      {/* Lista de todas as medidas disponíveis */}
      <div className="space-y-3">
        {availableMeasures.map((measure) => {
          const currentStatus = getCurrentStatus(measure.id);
          
          return (
            <motion.div
              key={measure.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              {/* Nome da Medida */}
              <div className="flex items-center gap-3 flex-1">
                <Shield className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-medium text-foreground">
                  {measure.name}
                </span>
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-3">
                <Select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(measure.id, e.target.value)}
                  className="w-40"
                >
                  <option value="">Selecionar</option>
                  <option value="yes">Sim</option>
                  <option value="no">Não</option>
                  <option value="not_applicable">Não Aplicável</option>
                </Select>

                {/* Badge de Status */}
                {currentStatus && (
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(currentStatus)} shrink-0`}
                  >
                    {getStatusText(currentStatus)}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo das Seleções */}
      {selectedMeasures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-muted/30 rounded-lg border"
        >
          <h4 className="text-sm font-medium text-foreground mb-3">
            Resumo das Seleções ({selectedMeasures.length} medida{selectedMeasures.length !== 1 ? 's' : ''})
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
          className="text-center py-8 text-muted-foreground"
        >
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhuma medida selecionada</p>
          <p className="text-xs">Use os selects acima para definir o status de cada medida</p>
        </motion.div>
      )}
    </div>
  );
}
