
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenericCrud } from './GenericCrud';
import { GenericCompanyBoundCrud } from './GenericCompanyBoundCrud';
import { SectorsManagement } from './SectorsManagement';

const settingsTabs = [
  { value: 'segments', label: 'Segmentos', component: GenericCrud, props: { title: 'Segmentos', tableName: 'segments', columns: [{ name: 'name', label: 'Nome do Segmento', required: true }] } },
  { 
    value: 'dangers', 
    label: 'Perigos', 
    component: GenericCrud, 
    props: { 
      title: 'Perigos', 
      tableName: 'dangers', 
      columns: [
        { name: 'name', label: 'Nome do Perigo', required: true },
        { name: 'group_id', label: 'Grupo', type: 'select', reference: 'danger_groups', displayField: 'name', required: true },
        { name: 'description', label: 'Descrição', type: 'textarea' }
      ]
    } 
  },
  { value: 'danger_sources', label: 'Fontes Geradoras', component: GenericCrud, props: { title: 'Fontes Geradoras', tableName: 'danger_sources', columns: [{ name: 'name', label: 'Nome da Fonte', required: true }] } },
  { value: 'protection_measures', label: 'Medidas de Proteção', component: GenericCrud, props: { title: 'Medidas de Proteção', tableName: 'protection_measures', columns: [{ name: 'name', label: 'Nome da Medida', required: true }] } },
  { value: 'injuries', label: 'Lesões', component: GenericCrud, props: { title: 'Lesões', tableName: 'injuries', columns: [{ name: 'name', label: 'Nome da Lesão', required: true }] } },
  { value: 'sectors', label: 'Setores', component: SectorsManagement, props: {} },
  { value: 'functions', label: 'Funções', component: GenericCompanyBoundCrud, props: { title: 'Funções', tableName: 'functions', columns: [{ name: 'name', label: 'Nome da Função', required: true }] } },
];

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Configurações</h1>
        <p className="text-subtitle-foreground mt-1">Gerencie os dados mestres do sistema.</p>
      </div>

      <Tabs defaultValue="segments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7">
          {settingsTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        {settingsTabs.map(tab => {
          const Component = tab.component;
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <Component {...tab.props} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
