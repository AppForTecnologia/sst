/**
 * Formulário para cadastro e edição de Grupos de Perigos
 * Permite criar e editar grupos que categorizam os diferentes tipos de perigos
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * Cores predefinidas para os grupos de perigos
 */
const PREDEFINED_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarelo', value: '#F59E0B' },
  { name: 'Roxo', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Laranja', value: '#F97316' },
];

/**
 * Componente DangerGroupForm
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.group - Grupo sendo editado (null para novo grupo)
 * @param {Function} props.onSave - Callback executado ao salvar
 * @param {Function} props.onCancel - Callback executado ao cancelar
 */
export function DangerGroupForm({ group, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    color: group?.color || PREDEFINED_COLORS[0].value,
  });

  const [errors, setErrors] = useState({});

  /**
   * Valida os dados do formulário
   * @returns {boolean} - true se válido, false caso contrário
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manipula mudanças nos campos do formulário
   * @param {string} field - Campo sendo alterado
   * @param {string} value - Novo valor
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Submete o formulário
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    const groupData = {
      ...formData,
      id: group?.id || Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      createdAt: group?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(groupData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-title-foreground">
              {group ? 'Editar Grupo de Perigos' : 'Novo Grupo de Perigos'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Grupo */}
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                Nome do Grupo *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Riscos Físicos"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                Descrição *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva as características deste grupo de perigos..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Cor do Grupo */}
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-3">
                Cor de Identificação
              </label>
              <div className="grid grid-cols-4 gap-3">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${formData.color === color.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">
                Pré-visualização
              </label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <Badge
                    style={{ 
                      backgroundColor: formData.color,
                      color: 'white'
                    }}
                    className="text-white"
                  >
                    {formData.name || 'Nome do Grupo'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {formData.description || 'Descrição do grupo...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {group ? 'Atualizar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
