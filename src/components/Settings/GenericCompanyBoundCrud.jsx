
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function GenericCompanyBoundCrud({ title, tableName, columns }) {
  const { dataMap, companies } = useData();
  const { data: items, setData: setItems } = dataMap[tableName];

  const [selectedCompany, setSelectedCompany] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const singularTitle = title.endsWith('es') ? title.slice(0, -2) : (title.endsWith('s') ? title.slice(0, -1) : title);

  const companyItems = useMemo(() => {
    if (!selectedCompany) return [];
    return items.filter(item => item.company_id === parseInt(selectedCompany));
  }, [items, selectedCompany]);

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSave = (e) => {
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
    
    const dataToSave = { ...formData, company_id: parseInt(selectedCompany) };

    if (editingItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? dataToSave : item));
    } else {
      setItems(prev => [...prev, { ...dataToSave, id: Date.now() }]);
    }

    toast({ title: "Sucesso!", description: `${singularTitle} ${editingItem ? 'atualizado' : 'adicionado'} com sucesso.` });
    handleCancel();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Sucesso!", description: `${singularTitle} removido com sucesso.` });
  };

  const handleAddNew = () => {
    setEditingItem(null);
    const initialFormData = columns.reduce((acc, col) => {
      acc[col.name] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const formFields = columns.map(column => (
    <div key={column.name}>
      <label className="block text-sm font-medium text-subtitle-foreground mb-2">
        {column.label} {column.required && '*'}
      </label>
      <Input
        name={column.name}
        value={formData[column.name] || ''}
        onChange={handleInputChange}
        placeholder={`Digite ${column.label.toLowerCase()}`}
        required={column.required}
      />
    </div>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Gerencie os {title.toLowerCase()} de cada empresa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-subtitle-foreground mb-2">
            Selecione a Empresa
          </label>
          <Select value={selectedCompany} onChange={handleCompanyChange}>
            <option value="">Selecione uma empresa</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </Select>
        </div>

        {selectedCompany && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-title-foreground">
                {title} da Empresa Selecionada
              </h3>
              {!showForm && (
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo(a) {singularTitle}
                </Button>
              )}
            </div>

            {showForm ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>{editingItem ? 'Editar' : 'Novo(a)'} {singularTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            {formFields}
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                                <Button type="submit">{editingItem ? 'Atualizar' : 'Salvar'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
              </motion.div>
            ) : companyItems.length === 0 ? (
              <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <p className="text-subtitle-foreground">Nenhum(a) {singularTitle.toLowerCase()} cadastrado(a) para esta empresa.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {companyItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <p className="font-medium text-title-foreground">{item.name}</p>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
