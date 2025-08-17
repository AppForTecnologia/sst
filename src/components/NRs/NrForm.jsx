
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export function NrForm({ nr, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    number: nr?.number || '',
    name: nr?.name || '',
    type: nr?.type || '',
    description: nr?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number || !formData.name) {
      toast({
        title: "Erro de Validação",
        description: "Os campos 'Número' e 'Nome' são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    onSave(formData);
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
            {nr ? 'Editar Norma Regulamentadora' : 'Adicionar Nova NR'}
          </CardTitle>
          <CardDescription>
            Preencha as informações abaixo para {nr ? 'atualizar a' : 'cadastrar uma nova'} NR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-subtitle-foreground mb-2">Número *</label>
                    <Input
                        value={formData.number}
                        onChange={(e) => handleChange('number', e.target.value)}
                        placeholder="Ex: 01, 35, etc."
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-subtitle-foreground mb-2">Tipo</label>
                    <Select
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="">Selecione um tipo</option>
                        <option value="Geral">Geral</option>
                        <option value="Especial">Especial</option>
                        <option value="Setorial">Setorial</option>
                        <option value="Anexo">Anexo</option>
                    </Select>
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Nome *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Disposições Gerais e Gerenciamento de Riscos Ocupacionais"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva brevemente o objetivo da norma."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">{nr ? 'Atualizar NR' : 'Salvar NR'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
