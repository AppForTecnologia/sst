
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

export function SectorsManagement() {
  const { sectors, setSectors, companies } = useData();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [sectorName, setSectorName] = useState('');

  const companySectors = useMemo(() => {
    if (!selectedCompany) return [];
    return sectors.filter(sector => sector.company_id === parseInt(selectedCompany));
  }, [sectors, selectedCompany]);

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setShowForm(false);
    setEditingSector(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSector(null);
    setSectorName('');
  };

  const handleAddNew = () => {
    setEditingSector(null);
    setSectorName('');
    setShowForm(true);
  };

  const handleEdit = (sector) => {
    setEditingSector(sector);
    setSectorName(sector.name);
    setShowForm(true);
  };

  const handleDelete = (sectorId) => {
    setSectors(prev => prev.filter(s => s.id !== sectorId));
    toast({ title: "Sucesso!", description: "Setor removido com sucesso." });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!sectorName.trim()) {
      toast({ title: "Campo obrigatório", description: "O nome do setor não pode estar vazio.", variant: "destructive" });
      return;
    }

    const dataToSave = { name: sectorName, company_id: parseInt(selectedCompany) };

    if (editingSector) {
      setSectors(prev => prev.map(s => s.id === editingSector.id ? { ...s, ...dataToSave } : s));
    } else {
      setSectors(prev => [...prev, { ...dataToSave, id: Date.now() }]);
    }

    toast({ title: "Sucesso!", description: `Setor ${editingSector ? 'atualizado' : 'adicionado'} com sucesso.` });
    handleCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setores</CardTitle>
        <CardDescription>Gerencie os setores de cada empresa.</CardDescription>
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
                Setores da Empresa Selecionada
              </h3>
              {!showForm && (
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Setor
                </Button>
              )}
            </div>

            {showForm ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>{editingSector ? 'Editar Setor' : 'Novo Setor'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div>
                        <label htmlFor="sectorName" className="block text-sm font-medium text-subtitle-foreground mb-2">
                          Nome do Setor *
                        </label>
                        <Input
                          id="sectorName"
                          value={sectorName}
                          onChange={(e) => setSectorName(e.target.value)}
                          placeholder="Digite o nome do setor"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                        <Button type="submit">{editingSector ? 'Atualizar' : 'Salvar'}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : companySectors.length === 0 ? (
              <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <p className="text-subtitle-foreground">Nenhum setor cadastrado para esta empresa.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {companySectors.map((sector, index) => (
                  <motion.div
                    key={sector.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <p className="font-medium text-title-foreground">{sector.name}</p>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(sector)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => handleDelete(sector.id)}>
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
