
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { NrDetailForm } from '@/components/NRs/NrDetailForm';
import { NrForm } from '@/components/NRs/NrForm';

export function NRScreen() {
    const { nrs, setNrs, nrDetails, setNrDetails, dangers, injuries, protectionMeasures } = useData();
    
    const [selectedNr, setSelectedNr] = useState('');
    const [showDetailForm, setShowDetailForm] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [showNrForm, setShowNrForm] = useState(false);
    const [editingNr, setEditingNr] = useState(null);

    const sortedNrs = useMemo(() => {
        return [...nrs].sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
    }, [nrs]);

    const currentNrDetails = useMemo(() => {
        if (!selectedNr) return [];
        return nrDetails.filter(detail => detail.nr_id === parseInt(selectedNr));
    }, [nrDetails, selectedNr]);

    const handleSaveDetail = (detailData) => {
        if (editingDetail) {
            setNrDetails(prev => prev.map(d => d.id === editingDetail.id ? { ...editingDetail, ...detailData } : d));
        } else {
            const newDetail = { ...detailData, id: Date.now(), nr_id: parseInt(selectedNr) };
            setNrDetails(prev => [...prev, newDetail]);
        }
        
        setShowDetailForm(false);
        setEditingDetail(null);
        toast({ title: "Sucesso!", description: "Detalhe da NR salvo." });
    };
    
    const handleDeleteDetail = (detailId) => {
        setNrDetails(prev => prev.filter(d => d.id !== detailId));
        toast({ title: "Sucesso!", description: "Detalhe da NR excluído." });
    };

    const handleEditDetail = (detail) => {
        setEditingDetail(detail);
        setShowDetailForm(true);
    };

    const handleSaveNr = (nrData) => {
        let savedNr;
        if (editingNr) {
            savedNr = { ...editingNr, ...nrData };
            setNrs(prev => prev.map(nr => nr.id === editingNr.id ? savedNr : nr));
        } else {
            savedNr = { ...nrData, id: Date.now() };
            setNrs(prev => [...prev, savedNr]);
        }

        setShowNrForm(false);
        setEditingNr(null);
        setSelectedNr(savedNr.id.toString());
        toast({ title: "Sucesso!", description: "NR salva com sucesso." });
    };

    const handleDeleteNr = (nrId) => {
        setNrDetails(prev => prev.filter(d => d.nr_id !== nrId));
        setNrs(prev => prev.filter(nr => nr.id !== nrId));
        setSelectedNr('');
        toast({ title: "Sucesso!", description: "NR excluída com sucesso." });
    };

    const getRelationName = (id, list) => list.find(item => item.id === id)?.name || 'Desconhecido';

    const currentNr = nrs.find(nr => nr.id === parseInt(selectedNr));

    if (showNrForm) {
        return (
            <NrForm
                nr={editingNr}
                onSave={handleSaveNr}
                onCancel={() => { setShowNrForm(false); setEditingNr(null); }}
            />
        );
    }

    if (showDetailForm) {
        return (
            <NrDetailForm
                detail={editingDetail}
                onSave={handleSaveDetail}
                onCancel={() => { setShowDetailForm(false); setEditingDetail(null); }}
            />
        );
    }
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Normas Regulamentadoras (NRs)</h1>
          <p className="text-subtitle-foreground mt-1">Gerencie a conformidade e os perigos associados a cada NR.</p>
        </div>
        <Button onClick={() => { setEditingNr(null); setShowNrForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar NR
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-title-foreground">Selecionar Norma Regulamentadora</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-grow w-full">
                <label className="block text-sm font-medium text-subtitle-foreground mb-2">Norma ou Anexo</label>
                <Select value={selectedNr} onChange={(e) => setSelectedNr(e.target.value)}>
                  <option value="">Selecione uma NR</option>
                  {sortedNrs.map(nr => (
                    <option key={nr.id} value={nr.id}>
                      {nr.number} - {nr.name} {nr.type ? `(${nr.type})` : ''}
                    </option>
                  ))}
                </Select>
              </div>
              {currentNr && (
                <div className="flex space-x-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => { setEditingNr(currentNr); setShowNrForm(true); }} className="w-full">
                        <Edit className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a NR e todos os seus perigos associados.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNr(currentNr.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              )}
            </div>
        </CardContent>
      </Card>

      {selectedNr && currentNr && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-title-foreground">Perigos da {currentNr.number}</CardTitle>
                <p className="text-sm text-subtitle-foreground mt-1">{currentNr.name}</p>
              </div>
              <Button onClick={() => { setEditingDetail(null); setShowDetailForm(true); }} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Perigo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentNrDetails.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-title-foreground mb-2">Nenhum perigo registrado para esta NR</h3>
                <p className="text-subtitle-foreground mb-6">Comece adicionando os perigos, lesões e medidas de proteção.</p>
                <Button onClick={() => setShowDetailForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Perigo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentNrDetails.map((detail, index) => (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary/50"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-6 w-6 text-accent flex-shrink-0" />
                          <h3 className="text-lg font-semibold text-title-foreground">{getRelationName(detail.danger_id, dangers)}</h3>
                        </div>
                        
                        {detail.injury_ids?.length > 0 && (
                          <div>
                            <p className="font-medium text-subtitle-foreground text-sm mb-1">Lesões Possíveis:</p>
                            <div className="flex flex-wrap gap-2">
                               {detail.injury_ids.map(id => <Badge key={id} variant="secondary">{getRelationName(id, injuries)}</Badge>)}
                            </div>
                          </div>
                        )}

                        {detail.protection_measure_ids?.length > 0 && (
                          <div>
                            <p className="font-medium text-subtitle-foreground text-sm mb-1">Medidas de Proteção:</p>
                            <div className="flex flex-wrap gap-2">
                               {detail.protection_measure_ids.map(id => <Badge key={id}>{getRelationName(id, protectionMeasures)}</Badge>)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-auto mt-3 sm:mt-0 sm:ml-4">
                        <Button variant="ghost" size="icon" onClick={() => handleEditDetail(detail)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
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
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente este registro de perigo da NR.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDetail(detail.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedNr && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="lg font-medium text-title-foreground mb-2">Selecione uma Norma Regulamentadora</h3>
          <p className="text-subtitle-foreground">Escolha uma NR para visualizar ou gerenciar seus perigos associados.</p>
        </motion.div>
      )}
    </div>
  );
}
