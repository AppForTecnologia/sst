
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select } from '../ui/select';
import { useData } from '@/contexts/DataContext';

export function GenericCrud({ title, tableName, columns }) {
  const { dataMap } = useData();
  const { data: items, setData: setItems } = dataMap[tableName];

  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectOptions, setSelectOptions] = useState({});

  const singularTitle = title.endsWith('es') ? title.slice(0, -2) : (title.endsWith('s') ? title.slice(0, -1) : title);

  // Buscar opções para campos select
  useEffect(() => {
    const options = {};
    columns.forEach(column => {
      if (column.type === 'select' && column.reference) {
        const referenceData = dataMap[column.reference]?.data || [];
        options[column.name] = referenceData.map(item => ({
          value: item.id,
          label: item[column.displayField || 'name']
        }));
      }
    });
    setSelectOptions(options);
  }, [columns, dataMap]);

  const resetForm = () => {
    let initialState = {};
    columns.forEach(c => initialState[c.name] = c.defaultValue || '');
    setFormData(initialState);
    setIsEditing(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({ title: `${singularTitle} deletado com sucesso!` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requiredColumn = columns.find(c => c.required);
    if (requiredColumn && !formData[requiredColumn.name]) {
        toast({
            title: "Campo obrigatório",
            description: `O campo "${requiredColumn.label}" não pode estar vazio.`,
            variant: "destructive"
        });
        return;
    }

    if (isEditing) {
      setItems(prev => prev.map(item => item.id === formData.id ? formData : item));
    } else {
      setItems(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    
    toast({ title: `${singularTitle} salvo com sucesso!` });
    resetForm();
  };

  const renderInput = (column) => {
    const value = formData[column.name] || '';
    
    if (column.type === 'select') {
      const options = selectOptions[column.name] || [];
      return (
        <Select
          value={value}
          onChange={(e) => setFormData({ ...formData, [column.name]: parseInt(e.target.value) || '' })}
        >
          <option value="">{column.placeholder || 'Selecione...'}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      );
    }
    
    if (column.type === 'textarea') {
      return (
        <Textarea
          placeholder={column.label}
          value={value}
          onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
          required={column.required || false}
          rows={4}
        />
      );
    }
    
    return (
      <Input
        type={column.type || 'text'}
        placeholder={column.label}
        value={value}
        onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
        required={column.required || false}
      />
    );
  };

  const getDisplayValue = (item, column) => {
    if (column.type === 'select' && column.reference) {
      const options = selectOptions[column.name] || [];
      const option = options.find(opt => opt.value === item[column.name]);
      return option ? option.label : 'N/A';
    }
    return item[column.name] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">{isEditing ? `Editar ${singularTitle}` : `Adicionar Novo(a) ${singularTitle}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map(col => (
              <div key={col.name}>
                <label className="block text-sm font-medium text-subtitle-foreground mb-1">{col.label}</label>
                {renderInput(col)}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancelar Edição
              </Button>
            )}
            <Button type="submit">{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
          </div>
        </form>

        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum item cadastrado.</p>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  {columns.map((col, index) => {
                    const value = getDisplayValue(item, col);
                    if (!value) return null;
                    return (
                      <span key={col.name} className="block text-sm">
                        <span className="font-medium text-muted-foreground">{col.label}:</span> {value}
                        {index < columns.length - 1 && <br />}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
