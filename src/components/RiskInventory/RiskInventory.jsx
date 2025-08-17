import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, AlertTriangle, FileText, Download, Wand2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { RiskForm } from './RiskForm';
import { useData } from '@/contexts/DataContext';
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
import { useReactToPrint } from 'react-to-print';
import { PGRPrint } from './PGRPrint';
import { calculateRiskLevel } from '@/utils/riskCalculations';

export function RiskInventory() {
  const { 
    companies, inventories, setInventories, sectors, functions, 
    segmentNrAssociations, nrDetails, dangerSources, dangers 
  } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedInventory, setSelectedInventory] = useState('');
  const [showPrintView, setShowPrintView] = useState(false);

  const printComponentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    onAfterPrint: () => setShowPrintView(false),
  });

  const companySectors = useMemo(() => {
    if (!selectedCompany) return [];
    return sectors.filter(s => s.company_id === parseInt(selectedCompany));
  }, [sectors, selectedCompany]);

  const companyFunctions = useMemo(() => {
    if (!selectedCompany) return [];
    return functions.filter(f => f.company_id === parseInt(selectedCompany));
  }, [functions, selectedCompany]);

  const handleCreateInventory = () => {
    if (!selectedCompany) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa primeiro.",
        variant: "destructive"
      });
      return;
    }

    const company = companies.find(c => c.id === parseInt(selectedCompany));
    const newInventory = {
      id: Date.now(),
      companyId: parseInt(selectedCompany),
      companyName: company.name,
      version: (inventories.filter(inv => inv.companyId === parseInt(selectedCompany)).length || 0) + 1,
      status: 'draft',
      risks: [],
      createdAt: new Date().toISOString()
    };

    setInventories(prev => [...prev, newInventory]);
    setSelectedInventory(newInventory.id.toString());
    
    toast({
      title: "Sucesso",
      description: "Novo inventário criado com sucesso!"
    });
  };

  const handleDeleteInventory = () => {
    if (!selectedInventory) return;
    setInventories(prev => prev.filter(inv => inv.id !== parseInt(selectedInventory)));
    setSelectedInventory('');
    toast({
      title: "Sucesso",
      description: "Inventário removido com sucesso!"
    });
  };

  const handleCloneInventory = () => {
    if (!currentInventory) return;

    const clonedInventory = {
      ...currentInventory,
      id: Date.now(),
      version: (inventories.filter(inv => inv.companyId === currentInventory.companyId).length || 0) + 1,
      status: 'draft',
      risks: currentInventory.risks.map(risk => ({
        ...risk,
        id: Date.now() + Math.random() * 1000,
        createdAt: new Date().toISOString()
      })),
      createdAt: new Date().toISOString()
    };

    setInventories(prev => [...prev, clonedInventory]);
    setSelectedInventory(clonedInventory.id.toString());
    
    toast({
      title: "Sucesso",
      description: `Inventário clonado com sucesso! Nova versão ${clonedInventory.version} criada.`
    });
  };

  const handleSaveRisk = (riskData) => {
    if (!selectedInventory) return;

    setInventories(prev => prev.map(inv => {
      if (inv.id === parseInt(selectedInventory)) {
        const updatedRisks = editingRisk
          ? inv.risks.map(r => r.id === editingRisk.id ? riskData : r)
          : [...inv.risks, { ...riskData, id: Date.now() }];
        
        return { ...inv, risks: updatedRisks };
      }
      return inv;
    }));

    setShowForm(false);
    setEditingRisk(null);
    
    toast({
      title: "Sucesso",
      description: editingRisk ? "Perigo atualizado com sucesso!" : "Perigo adicionado com sucesso!"
    });
  };

  const handleEditRisk = (risk) => {
    setEditingRisk(risk);
    setShowForm(true);
  };

  const handleDeleteRisk = (riskId) => {
    if (!selectedInventory) return;

    setInventories(prev => prev.map(inv => {
      if (inv.id === parseInt(selectedInventory)) {
        return { ...inv, risks: inv.risks.filter(r => r.id !== riskId) };
      }
      return inv;
    }));

    toast({
      title: "Sucesso",
      description: "Perigo removido com sucesso!"
    });
  };

  const handleCloneRisk = (risk) => {
    if (!selectedInventory) return;

    const clonedRisk = {
      ...risk,
      id: Date.now() + Math.random() * 1000,
      description: `${risk.description} (Cópia)`,
      createdAt: new Date().toISOString()
    };

    setInventories(prev => prev.map(inv => {
      if (inv.id === parseInt(selectedInventory)) {
        return { ...inv, risks: [...inv.risks, clonedRisk] };
      }
      return inv;
    }));

    toast({
      title: "Sucesso",
      description: "Perigo clonado com sucesso!"
    });
  };

  const handleGeneratePGR = () => {
    if (!currentInventory) {
      toast({
        title: "Erro",
        description: "Nenhum inventário selecionado para gerar o PGR.",
        variant: "destructive"
      });
      return;
    }
    setShowPrintView(true);
  };

  const handleSuggestRisks = () => {
    const company = companies.find(c => c.id === parseInt(selectedCompany));
    if (!company || !company.segment_id) {
      toast({ title: "Ação necessária", description: "A empresa selecionada não possui um segmento definido.", variant: "destructive" });
      return;
    }

    const associations = segmentNrAssociations.filter(assoc => assoc.segment_id === company.segment_id);
    if (associations.length === 0) {
      toast({ title: "Nenhuma sugestão", description: "Não há perigos pré-configurados para o segmento desta empresa." });
      return;
    }

    const suggestedRisks = associations.map((assoc, index) => {
      const details = nrDetails.find(d => d.nr_id === assoc.nr_id && d.danger_id === assoc.danger_id);
      const source = dangerSources.find(s => s.id === assoc.danger_source_id);
      const danger = dangers.find(d => d.id === assoc.danger_id);
      const probability = 3; // Default probability
      const severity = 3; // Default severity
      const riskLevel = calculateRiskLevel(probability, severity);

      return {
        id: Date.now() + index,
        sectorId: '',
        functionIds: [],
        sourceId: assoc.danger_source_id,
        dangerId: assoc.danger_id,
        description: `Perigo sugerido baseado na NR e segmento.`,
        probability,
        severity,
        technicalResponsible: '',
        protectionMeasures: [], // Initialize protectionMeasures
        injuryIds: details?.injury_ids || [],
        sectorName: 'A definir',
        functionNames: [],
        sourceName: source?.name || 'Desconhecido',
        dangerName: danger?.name || 'Desconhecido',
        riskLevel,
        createdAt: new Date().toISOString()
      };
    });

    setInventories(prev => prev.map(inv => {
      if (inv.id === parseInt(selectedInventory)) {
        const existingRiskIds = new Set(inv.risks.map(r => `${r.sourceId}-${r.dangerId}`));
        const newRisks = suggestedRisks.filter(sr => !existingRiskIds.has(`${sr.sourceId}-${sr.dangerId}`));
        
        if (newRisks.length === 0) {
          toast({ title: "Perigos já existem", description: "Todos os perigos sugeridos já estão no inventário." });
          return inv;
        }

        toast({ title: "Sucesso!", description: `${newRisks.length} perigo(s) sugerido(s) foram adicionados. Por favor, revise e complemente.` });
        return { ...inv, risks: [...inv.risks, ...newRisks] };
      }
      return inv;
    }));
  };

  const currentInventory = inventories.find(inv => inv.id === parseInt(selectedInventory));
  const companyInventories = inventories.filter(inv => inv.companyId === parseInt(selectedCompany));

  if (showPrintView) {
    return (
      <PGRPrint
        ref={printComponentRef}
        inventory={currentInventory}
        company={companies.find(c => c.id === currentInventory.companyId)}
        onClose={() => setShowPrintView(false)}
        onPrint={handlePrint}
      />
    );
  }

  if (showForm) {
    return (
      <RiskForm
        risk={editingRisk}
        sectors={companySectors}
        functions={companyFunctions}
        onSave={handleSaveRisk}
        onCancel={() => {
          setShowForm(false);
          setEditingRisk(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Inventário de Perigos</h1>
          <p className="text-subtitle-foreground mt-1">Gerencie os perigos identificados nas empresas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-title-foreground">Selecionar Empresa e Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Empresa</label>
              <Select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSelectedInventory('');
                }}
              >
                <option value="">Selecione uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-subtitle-foreground mb-2">Inventário</label>
              <Select
                value={selectedInventory}
                onChange={(e) => setSelectedInventory(e.target.value)}
                disabled={!selectedCompany}
              >
                <option value="">Selecione um inventário</option>
                {companyInventories.map(inventory => (
                  <option key={inventory.id} value={inventory.id}>
                    Versão {inventory.version} - {new Date(inventory.createdAt).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleCreateInventory} disabled={!selectedCompany} className="flex-grow sm:flex-grow-0">
                <Plus className="h-4 w-4 mr-2" />
                Novo Inventário
              </Button>
              {selectedInventory && (
                <>
                  <Button variant="outline" onClick={handleSuggestRisks} className="flex-grow sm:flex-grow-0">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Sugerir Perigos
                  </Button>
                  <Button variant="outline" onClick={handleGeneratePGR} className="flex-grow sm:flex-grow-0">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar PGR
                  </Button>
                  <Button variant="outline" onClick={handleCloneInventory} className="flex-grow sm:flex-grow-0">
                    <Copy className="h-4 w-4 mr-2" />
                    Clonar Inventário
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-grow sm:flex-grow-0">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o inventário e todos os seus perigos associados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteInventory}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
        </CardContent>
      </Card>

      {selectedInventory && currentInventory && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-title-foreground">Perigos Identificados</CardTitle>
                <p className="text-sm text-subtitle-foreground mt-1">
                  {currentInventory.companyName} - Versão {currentInventory.version}
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Perigo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentInventory.risks.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-title-foreground mb-2">Nenhum perigo identificado</h3>
                <p className="text-subtitle-foreground mb-6">Comece adicionando o primeiro perigo ao inventário.</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Perigo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentInventory.risks.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary/50"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-orange-400" />
                          <h3 className="font-semibold text-title-foreground text-lg">{risk.sourceName}</h3>
                          <Badge style={{ backgroundColor: risk.riskLevel.color.replace('bg-', 'var(--color-') }}>
                            {risk.riskLevel.level}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-medium text-foreground mb-2">Perigo: {risk.dangerName}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-subtitle-foreground mb-3">
                          <div><span className="font-medium text-foreground">Setor:</span> {risk.sectorName}</div>
                          <div><span className="font-medium text-foreground">Funções:</span> {risk.functionNames?.length > 0 ? risk.functionNames.join(', ') : 'N/A'}</div>
                        </div>

                        {risk.description && (
                          <p className="text-sm text-foreground/90 mb-3">{risk.description}</p>
                        )}

                        {/* Medidas de Proteção com Status */}
                        {risk.protectionMeasures && risk.protectionMeasures.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-foreground mb-2">Medidas de Proteção:</h5>
                            <div className="space-y-2">
                              {risk.protectionMeasures.map((measure, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <Shield className="h-3 w-3 text-blue-500" />
                                  <span className="text-foreground">{measure.measureName}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      ${measure.implementationStatus === 'yes' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                      ${measure.implementationStatus === 'no' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                                      ${measure.implementationStatus === 'not_applicable' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                                    `}
                                  >
                                    {measure.implementationStatus === 'yes' ? 'Sim' : 
                                     measure.implementationStatus === 'no' ? 'Não' : 
                                     measure.implementationStatus === 'not_applicable' ? 'N/A' : 'Pendente'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>Prob: {risk.probability}</span>
                          <span>Sev: {risk.severity}</span>
                          <span>Nível: {risk.riskLevel.value}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-auto mt-3 sm:mt-0 sm:ml-4">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRisk(risk)} className="h-8 w-8" title="Editar perigo">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleCloneRisk(risk)} className="h-8 w-8 text-blue-600 hover:text-blue-700" title="Clonar perigo">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRisk(risk.id)} className="h-8 w-8 text-destructive hover:text-destructive/80" title="Excluir perigo">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedCompany && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-title-foreground mb-2">Selecione uma empresa</h3>
          <p className="text-subtitle-foreground">Escolha uma empresa para visualizar ou criar inventários de perigo.</p>
        </motion.div>
      )}
    </div>
  );
}