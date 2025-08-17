
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EmployeeForm } from './EmployeeForm';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';

export function EmployeeList() {
  const { employees, setEmployees, companies } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const companyMap = useMemo(() => {
    return companies.reduce((map, company) => {
      map[company.id] = company.name;
      return map;
    }, {});
  }, [companies]);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cpf.includes(searchTerm) ||
    (companyMap[emp.companyId] && companyMap[emp.companyId].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = (employeeData) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? employeeData : e));
      toast({ title: "Sucesso", description: "Funcionário atualizado com sucesso!" });
    } else {
      setEmployees(prev => [...prev, employeeData]);
      toast({ title: "Sucesso", description: "Funcionário cadastrado com sucesso!" });
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (employeeId) => {
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
    toast({ title: "Sucesso", description: "Funcionário removido com sucesso!" });
  };

  if (showForm) {
    return (
      <EmployeeForm
        employee={editingEmployee}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Funcionários</h1>
          <p className="text-subtitle-foreground mt-1">Gerencie os funcionários das empresas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Novo Funcionário</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <Input 
            placeholder="Buscar por nome, CPF ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-title-foreground mb-2">Nenhum funcionário encontrado</h3>
              <p className="text-subtitle-foreground">
                {employees.length > 0 ? "Tente um termo de busca diferente." : "Cadastre o primeiro funcionário."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-lg text-title-foreground truncate">{employee.name}</CardTitle>
                            <p className="text-sm text-subtitle-foreground">{employee.cpf}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)} className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)} className="h-8 w-8 text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-grow">
                      <div className="flex items-center text-sm">
                        <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium text-title-foreground truncate">{companyMap[employee.companyId] || 'Empresa não encontrada'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-subtitle-foreground">{employee.role}</span>
                      </div>
                      {employee.sector && (
                        <div className="text-sm text-subtitle-foreground">
                          Setor: {employee.sector}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
