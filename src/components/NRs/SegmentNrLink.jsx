
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Link2, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
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
import { useData } from '@/contexts/DataContext';

export function SegmentNrLink() {
    const { segments, dangerSources, nrs, dangers, segmentNrAssociations, setSegmentNrAssociations } = useData();
    
    const [selectedSegment, setSelectedSegment] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        danger_source_id: '',
        nr_id: '',
        danger_id: ''
    });

    const currentAssociations = useMemo(() => {
        if (!selectedSegment) return [];
        return segmentNrAssociations.filter(assoc => assoc.segment_id === parseInt(selectedSegment));
    }, [selectedSegment, segmentNrAssociations]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const { danger_source_id, nr_id, danger_id } = formData;
        if (!danger_source_id || !nr_id || !danger_id) {
            toast({ title: "Campos obrigatórios", description: "Todos os campos devem ser preenchidos.", variant: "destructive" });
            return;
        }

        const newAssociation = {
            id: Date.now(),
            segment_id: parseInt(selectedSegment),
            danger_source_id: parseInt(danger_source_id),
            nr_id: parseInt(nr_id),
            danger_id: parseInt(danger_id)
        };

        setSegmentNrAssociations(prev => [...prev, newAssociation]);
        toast({ title: "Sucesso!", description: "Associação criada com sucesso." });
        setShowForm(false);
        setFormData({ danger_source_id: '', nr_id: '', danger_id: '' });
    };
    
    const handleDelete = (associationId) => {
        setSegmentNrAssociations(prev => prev.filter(assoc => assoc.id !== associationId));
        toast({ title: "Sucesso!", description: "Associação removida." });
    };

    const getRelationName = (id, list, key = 'name') => list.find(item => item.id === id)?.[key] || 'Desconhecido';
    
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Vincular NRs aos Segmentos</h1>
        <p className="text-subtitle-foreground mt-1">Associe perigos e fontes geradoras a NRs para cada segmento de empresa.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione um Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSegment} onChange={(e) => setSelectedSegment(e.target.value)}>
            <option value="">Selecione um segmento...</option>
            {segments.map(segment => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
          </Select>
        </CardContent>
      </Card>
      
      {selectedSegment && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Associações para: {getRelationName(parseInt(selectedSegment), segments)}</CardTitle>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Associação
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 border rounded-lg bg-muted/30">
                <form onSubmit={handleSave} className="space-y-4">
                  <h3 className="text-lg font-semibold">Nova Associação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-subtitle-foreground mb-2">Fonte Geradora*</label>
                      <Select name="danger_source_id" value={formData.danger_source_id} onChange={handleFormChange}>
                        <option value="">Selecione...</option>
                        {dangerSources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-subtitle-foreground mb-2">NR*</label>
                      <Select name="nr_id" value={formData.nr_id} onChange={handleFormChange}>
                        <option value="">Selecione...</option>
                        {nrs.map(nr => <option key={nr.id} value={nr.id}>{nr.number} - {nr.name}</option>)}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-subtitle-foreground mb-2">Perigo*</label>
                      <Select name="danger_id" value={formData.danger_id} onChange={handleFormChange}>
                        <option value="">Selecione...</option>
                        {dangers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentAssociations.length > 0 ? (
              <div className="space-y-3">
                {currentAssociations.map((assoc, index) => (
                    <motion.div 
                        key={assoc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-2">
                                <p><span className="font-semibold text-subtitle-foreground">Fonte:</span> {getRelationName(assoc.danger_source_id, dangerSources)}</p>
                                <p><span className="font-semibold text-subtitle-foreground">NR:</span> {getRelationName(assoc.nr_id, nrs, 'number')} - {getRelationName(assoc.nr_id, nrs)}</p>
                                <p><span className="font-semibold text-subtitle-foreground">Perigo:</span> {getRelationName(assoc.danger_id, dangers)}</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação removerá permanentemente a associação.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(assoc.id)}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                      </Card>
                    </motion.div>
                ))}
              </div>
            ) : (
                <div className="text-center py-10 border-dashed border-2 rounded-lg">
                    <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-title-foreground">Nenhuma associação encontrada</h3>
                    <p className="text-subtitle-foreground">Crie a primeira associação para este segmento.</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
