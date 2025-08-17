/**
 * Lista de Grupos de Perigos
 * Exibe todos os grupos cadastrados com funcionalidades de CRUD
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { DangerGroupForm } from './DangerGroupForm';
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

/**
 * Componente principal para gerenciamento de grupos de perigos
 */
export function DangerGroupList() {
  const { dangerGroups, setDangerGroups, dangers } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  /**
   * Salva um grupo (novo ou editado)
   * @param {Object} groupData - Dados do grupo
   */
  const handleSaveGroup = (groupData) => {
    if (editingGroup) {
      // Editando grupo existente
      setDangerGroups(prev => 
        prev.map(group => 
          group.id === editingGroup.id ? groupData : group
        )
      );
      toast({
        title: "Sucesso",
        description: "Grupo de perigos atualizado com sucesso!",
      });
    } else {
      // Criando novo grupo
      setDangerGroups(prev => [...prev, groupData]);
      toast({
        title: "Sucesso",
        description: "Grupo de perigos criado com sucesso!",
      });
    }
    
    setShowForm(false);
    setEditingGroup(null);
  };

  /**
   * Inicia a edição de um grupo
   * @param {Object} group - Grupo a ser editado
   */
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  /**
   * Remove um grupo de perigos
   * @param {number} groupId - ID do grupo a ser removido
   */
  const handleDeleteGroup = (groupId) => {
    // Verifica se existem perigos vinculados a este grupo
    const dangersInGroup = dangers.filter(danger => danger.group_id === groupId);
    
    if (dangersInGroup.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Este grupo possui ${dangersInGroup.length} perigo(s) vinculado(s). Remova os perigos primeiro.`,
        variant: "destructive",
      });
      return;
    }

    setDangerGroups(prev => prev.filter(group => group.id !== groupId));
    toast({
      title: "Sucesso",
      description: "Grupo de perigos removido com sucesso!",
    });
  };

  /**
   * Cancela a operação de edição/criação
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  /**
   * Conta quantos perigos estão vinculados a um grupo
   * @param {number} groupId - ID do grupo
   * @returns {number} - Quantidade de perigos
   */
  const countDangersInGroup = (groupId) => {
    return dangers.filter(danger => danger.group_id === groupId).length;
  };

  // Se estiver mostrando o formulário, renderiza apenas ele
  if (showForm) {
    return (
      <DangerGroupForm
        group={editingGroup}
        onSave={handleSaveGroup}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">
            Grupos de Perigos
          </h1>
          <p className="text-subtitle-foreground mt-1">
            Organize e categorize os diferentes tipos de perigos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      {/* Lista de Grupos */}
      {dangerGroups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-title-foreground mb-2">
            Nenhum grupo cadastrado
          </h3>
          <p className="text-subtitle-foreground mb-6">
            Comece criando o primeiro grupo de perigos para organizar sua classificação.
          </p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Primeiro Grupo
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {dangerGroups.map((group, index) => {
              const dangerCount = countDangersInGroup(group.id);
              
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{ backgroundColor: group.color }}
                          />
                          <CardTitle className="text-title-foreground text-lg">
                            {group.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditGroup(group)}
                            className="h-8 w-8"
                            title="Editar grupo"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive/80"
                                title="Excluir grupo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o grupo "{group.name}"?
                                  {dangerCount > 0 && (
                                    <span className="block mt-2 text-red-600 font-medium">
                                      Atenção: Este grupo possui {dangerCount} perigo(s) vinculado(s).
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteGroup(group.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-subtitle-foreground text-sm mb-4">
                        {group.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {dangerCount} perigo{dangerCount !== 1 ? 's' : ''}
                        </Badge>
                        
                        <span className="text-xs text-muted-foreground">
                          {new Date(group.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
