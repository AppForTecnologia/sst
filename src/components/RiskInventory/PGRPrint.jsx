
import React, { forwardRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer, HeartPulse } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const PrintFooter = ({ pageNumber, totalPages }) => (
  <div className="text-center text-xs mt-4 text-black print-footer">
    <p>SST em Destaque - Página {pageNumber} de {totalPages}</p>
  </div>
);

const SectionTitle = ({ number, title }) => (
    <h3 className="font-bold text-lg mb-3 mt-6 text-black">{number}. {title}</h3>
);

const SubSectionTitle = ({ number, title }) => (
    <h4 className="font-semibold text-base mb-2 mt-4 text-black">{number} {title}</h4>
);


export const PGRPrint = forwardRef(({ inventory, company, onClose, onPrint }, ref) => {
  const { protectionMeasures, injuries, employees } = useData();

  useEffect(() => {
    onPrint();
  }, [onPrint]);

  const getInjuryNames = (ids) => {
    if (!ids || ids.length === 0) return 'N/A';
    return ids.map(id => {
      const injury = injuries.find(i => i.id === id);
      return injury ? injury.name : '';
    }).filter(Boolean).join('; ');
  };
  
  const companyEmployees = employees.filter(emp => emp.companyId === company.id);
  const employeeRoster = companyEmployees.reduce((acc, emp) => {
      const sector = emp.sector || 'Sem Setor';
      if (!acc[sector]) {
          acc[sector] = 0;
      }
      acc[sector]++;
      return acc;
  }, {});

  const totalPages = 8;

  return (
    <div className="bg-gray-100 min-h-screen p-4 print:bg-white print:p-0">
      <div className="fixed top-4 right-4 flex space-x-2 print:hidden z-50">
        <Button onClick={onPrint}><Printer className="mr-2 h-4 w-4" /> Imprimir</Button>
        <Button variant="outline" onClick={onClose}><X className="mr-2 h-4 w-4" /> Fechar</Button>
      </div>
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto shadow-lg print:shadow-none print:max-w-full print:p-12 print:text-black">
        <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color: black !important;
            }
            .print-footer {
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              color: black !important;
              font-size: 10px;
            }
            .page-break {
              page-break-before: always;
            }
            .page {
              padding-bottom: 50px; /* Space for footer */
            }
            * {
              color: black !important;
              background-color: transparent !important;
            }
          }
          .pgr-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
            margin-top: 1rem;
          }
          .pgr-table th, .pgr-table td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            vertical-align: top;
          }
          .pgr-table th {
            background-color: #E5E7EB !important;
            font-weight: bold;
          }
          .text-content p, .text-content li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
            text-align: justify;
          }
        `}</style>

        {/* Page 1: Cover */}
        <div className="page h-[26cm] flex flex-col justify-center items-center text-center">
            <HeartPulse className="h-24 w-24 text-primary" style={{color: 'hsl(var(--primary)) !important'}}/>
            <h1 className="text-4xl font-bold mt-4 text-primary" style={{color: 'hsl(var(--primary)) !important'}}>SST em Destaque</h1>
            <p className="text-lg mt-2 text-black">Segurança e Medicina do Trabalho</p>
            
            <div className="mt-24 w-full">
                <h2 className="text-3xl font-bold text-black">PROGRAMA DE GERENCIAMENTO DE RISCOS</h2>
                <h3 className="text-2xl font-semibold mt-2 text-black">PGR - NR 01</h3>
            </div>

            <div className="mt-auto w-full border-t pt-4">
                <p className="text-xl font-semibold text-black">{company.name}</p>
                <p className="text-md text-black">CNPJ: {company.cnpj}</p>
                <p className="text-md font-bold text-black mt-4">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                <p className="text-md text-black">Validade: 2 anos</p>
            </div>
          <PrintFooter pageNumber={1} totalPages={totalPages} />
        </div>

        {/* Page 2: Introduction */}
        <div className="page-break page text-content">
          <SectionTitle number="1" title="INTRODUÇÃO E OBJETIVOS" />
          <p>Este documento constitui o Programa de Gerenciamento de Riscos (PGR) da empresa <strong>{company.name}</strong>, elaborado em conformidade com a Norma Regulamentadora nº 01 (NR-01) do Ministério do Trabalho e Previdência. Seu objetivo é estabelecer as diretrizes e os requisitos para o gerenciamento de riscos ocupacionais e as medidas de prevenção em Segurança e Saúde no Trabalho (SST).</p>
          <p>O PGR é um processo contínuo que visa à melhoria da segurança, por meio das seguintes etapas: identificação de perigos, avaliação dos riscos ocupacionais e implementação de medidas de controle.</p>
          
          <SectionTitle number="2" title="RESPONSABILIDADES DA ORGANIZAÇÃO" />
          <p>Conforme item 1.4.1 da NR-01, cabe à organização:</p>
            <ol className="list-decimal list-inside pl-4 space-y-2">
              <li>Cumprir e fazer cumprir as disposições legais e regulamentares sobre segurança e saúde no trabalho.</li>
              <li>Informar aos trabalhadores sobre os perigos e as medidas de prevenção.</li>
              <li>Elaborar ordens de serviço sobre SST.</li>
              <li>Permitir o acompanhamento da fiscalização pelos representantes dos trabalhadores.</li>
              <li>Implementar procedimentos em caso de acidente ou doença do trabalho.</li>
              <li>Disponibilizar à Inspeção do Trabalho todas as informações relativas à SST.</li>
              <li>Implementar medidas de prevenção, ouvidos os trabalhadores, com a seguinte ordem de prioridade:
                  <ul className="list-disc list-inside pl-6 mt-2">
                      <li>Eliminação dos fatores de perigo;</li>
                      <li>Minimização e controle com a adoção de medidas de proteção coletiva;</li>
                      <li>Minimização e controle com a adoção de medidas administrativas ou de organização do trabalho;</li>
                      <li>Adoção de medidas de proteção individual.</li>
                  </ul>
              </li>
            </ol>
          <PrintFooter pageNumber={2} totalPages={totalPages} />
        </div>
        
        {/* Page 3: Methodology */}
        <div className="page-break page text-content">
          <SectionTitle number="3" title="METODOLOGIA E ETAPAS DO TRABALHO" />
            <SubSectionTitle number="3.1" title="Levantamento Preliminar de Perigos" />
            <p>A primeira etapa consiste na identificação dos perigos presentes nos ambientes de trabalho, considerando as fontes geradoras, os processos, as atividades e os ambientes. Esta fase inclui a análise de documentos, entrevistas com os trabalhadores e inspeções nos locais de trabalho, conforme item 1.5.3.3 da NR-01.</p>

            <SubSectionTitle number="3.2" title="Avaliação de Perigos" />
            <p>Após a identificação dos perigos, os perigos são avaliados por meio da combinação da <strong>severidade</strong> das possíveis lesões ou agravos à saúde com a <strong>probabilidade</strong> de sua ocorrência. As ferramentas e técnicas utilizadas são baseadas nas diretrizes da NR-01 e em publicações técnicas reconhecidas.</p>
          <PrintFooter pageNumber={3} totalPages={totalPages} />
        </div>

        {/* Page 4: Probability and Severity Scales */}
        <div className="page-break page">
            <SubSectionTitle number="3.2.1" title="Escala de Probabilidade" />
            <table className="pgr-table">
                <thead><tr><th>Grau</th><th>Probabilidade</th><th>Critérios (Baseado na NR-01)</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>Altamente Improvável</td><td>As medidas de controle existentes são adequadas e representam a melhor tecnologia ou prática de controle. Não há garantias de que sejam mantidas em longo prazo.</td></tr>
                    <tr><td>2</td><td>Improvável</td><td>As medidas de controle são adequadas, mas apresentam pequenos desvios. Não há garantias de que sejam mantidas em longo prazo.</td></tr>
                    <tr><td>3</td><td>Pouco Provável</td><td>As medidas de controle são adequadas, mas não há garantias de que sejam mantidas em longo prazo.</td></tr>
                    <tr><td>4</td><td>Provável</td><td>As medidas de controle apresentam desvios ou problemas significativos. A ocorrência é provável.</td></tr>
                    <tr><td>5</td><td>Altamente Provável</td><td>As medidas de controle são inexistentes ou as existentes são reconhecidamente inadequadas.</td></tr>
                </tbody>
            </table>

            <SubSectionTitle number="3.2.2" title="Escala de Severidade" />
            <table className="pgr-table">
                <thead><tr><th>Grau</th><th>Característica da Lesão</th><th>Afastamento</th><th>Exemplos de Danos</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>Lesão Reversível (sem afastamento)</td><td>Não limita a capacidade funcional.</td><td>Ferimentos superficiais, irritação, desconforto temporário.</td></tr>
                    <tr><td>2</td><td>Lesão Reversível (com afastamento)</td><td>Pode limitar a capacidade funcional. Afastamento até 15 dias.</td><td>Lacerações, queimaduras leves, entorses, fraturas de bom prognóstico.</td></tr>
                    <tr><td>3</td><td>Lesão Reversível</td><td>Limita a capacidade funcional. Afastamento superior a 15 dias.</td><td>Dermatites, asma, distúrbios osteomusculares em fase aguda.</td></tr>
                    <tr><td>4</td><td>Lesão ou Agravo Grave e Irreversível</td><td>Limita a capacidade funcional, mas não totalmente.</td><td>Amputações, perda auditiva, distúrbios crônicos.</td></tr>
                    <tr><td>5</td><td>Óbito ou Incapacidade Total</td><td>Limita totalmente a capacidade funcional ou pode causar morte.</td><td>Câncer ocupacional, doenças graves que podem ser fatais, ferimentos múltiplos.</td></tr>
                </tbody>
            </table>
            <p className="text-xs mt-2">*Tabelas adaptadas da Revista Enit - Ano 6-2022.</p>
          <PrintFooter pageNumber={4} totalPages={totalPages} />
        </div>
        
        {/* Page 5: Risk Matrix and Action Criteria */}
        <div className="page-break page">
            <SubSectionTitle number="3.2.3" title="Matriz de Risco (5x5)" />
            <table className="pgr-table text-center">
                <thead>
                    <tr><th rowSpan="2" className="align-middle">Probabilidade</th><th colSpan="5">Severidade</th></tr>
                    <tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
                </thead>
                <tbody>
                    <tr><td>5</td><td>Moderado</td><td>Alto</td><td>Alto</td><td>Crítico</td><td>Crítico</td></tr>
                    <tr><td>4</td><td>Baixo</td><td>Moderado</td><td>Alto</td><td>Alto</td><td>Crítico</td></tr>
                    <tr><td>3</td><td>Baixo</td><td>Baixo</td><td>Moderado</td><td>Moderado</td><td>Alto</td></tr>
                    <tr><td>2</td><td>Irrelevante</td><td>Baixo</td><td>Baixo</td><td>Moderado</td><td>Moderado</td></tr>
                    <tr><td>1</td><td>Irrelevante</td><td>Irrelevante</td><td>Baixo</td><td>Baixo</td><td>Moderado</td></tr>
                </tbody>
            </table>

            <SubSectionTitle number="3.3" title="Critérios para Tomada de Decisão e Ação" />
            <table className="pgr-table">
                <thead><tr><th>Nível de Risco</th><th>Ação</th></tr></thead>
                <tbody>
                    <tr><td>Irrelevante</td><td>Nenhum controle adicional é necessário.</td></tr>
                    <tr><td>Baixo</td><td>Pode-se considerar outra solução de controle. Inspeção das medidas de prevenção existentes é necessária.</td></tr>
                    <tr><td>Moderado</td><td>Devem ser desenvolvidos estudos para a redução do nível de perigo. Inspeções das medidas existentes são necessárias.</td></tr>
                    <tr><td>Alto</td><td>Devem ser desenvolvidos estudos para a redução do nível de perigo, com reavaliação. Iniciar execução ou implantação das ações propostas.</td></tr>
                    <tr><td>Crítico</td><td>O trabalho não deve ser iniciado ou continuado até que o perigo tenha sido reduzido. Se não for possível reduzir o perigo, o trabalho deve permanecer proibido.</td></tr>
                </tbody>
            </table>
          <PrintFooter pageNumber={5} totalPages={totalPages} />
        </div>

        {/* Page 6: Employee Roster */}
        <div className="page-break page">
          <SectionTitle number="4" title="CARACTERIZAÇÃO DA EMPRESA" />
          <SubSectionTitle number="4.1" title="Dados da Empresa" />
          <p><strong>Razão Social:</strong> {company.name}</p>
          <p><strong>CNPJ:</strong> {company.cnpj}</p>
          <p><strong>Endereço:</strong> {company.address || 'Não informado'}</p>
          <p><strong>CNAE:</strong> {company.cnae || 'Não informado'}</p>
          <p><strong>Grau de Perigo:</strong> {company.risk_grade}</p>
          
          <SubSectionTitle number="4.2" title="Quadro de Funcionários" />
          <table className="pgr-table">
              <thead><tr><th>Setor</th><th>Quantidade de Funcionários</th></tr></thead>
              <tbody>
                {Object.keys(employeeRoster).length > 0 ? (
                    Object.entries(employeeRoster).map(([sector, count]) => (
                        <tr key={sector}>
                            <td>{sector}</td>
                            <td>{count}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="2" className="text-center">Nenhum funcionário cadastrado para esta empresa.</td></tr>
                )}
              </tbody>
          </table>
          <PrintFooter pageNumber={6} totalPages={totalPages} />
        </div>

        {/* Page 7: Risk Inventory Table */}
        <div className="page-break page">
          <SectionTitle number="5" title="INVENTÁRIO DE PERIGOS" />
          <table className="pgr-table">
            <thead>
              <tr>
                <th>Setor</th>
                <th>Função</th>
                <th>Fonte/Perigo</th>
                <th>Descrição</th>
                <th>Medidas de Controle</th>
                <th>Lesões/Agravos</th>
                <th>P</th>
                <th>S</th>
                <th>Nível</th>
              </tr>
            </thead>
            <tbody>
              {inventory.risks.length > 0 ? (
                inventory.risks.map(risk => (
                  <tr key={risk.id}>
                    <td>{risk.sectorName}</td>
                    <td>{risk.functionNames?.join(', ') || 'N/A'}</td>
                    <td><strong>{risk.sourceName}:</strong> {risk.dangerName}</td>
                    <td>{risk.description || '-'}</td>
                    <td>
                      {risk.protectionMeasures && risk.protectionMeasures.length > 0 ? (
                        <div className="space-y-1">
                          {risk.protectionMeasures.map((measure, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium">{measure.measureName}</span>
                              <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                                measure.implementationStatus === 'yes' ? 'bg-green-100 text-green-800' :
                                measure.implementationStatus === 'no' ? 'bg-red-100 text-red-800' :
                                measure.implementationStatus === 'not_applicable' ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {measure.implementationStatus === 'yes' ? 'Sim' : 
                                 measure.implementationStatus === 'no' ? 'Não' : 
                                 measure.implementationStatus === 'not_applicable' ? 'N/A' : 'Selecionar'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        'Nenhuma medida definida'
                      )}
                    </td>
                    <td>{getInjuryNames(risk.injuryIds)}</td>
                    <td>{risk.probability}</td>
                    <td>{risk.severity}</td>
                    <td>{risk.riskLevel.level}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9" className="text-center">Nenhum perigo identificado.</td></tr>
              )}
            </tbody>
          </table>
          <PrintFooter pageNumber={7} totalPages={totalPages} />
        </div>

        {/* Page 8: Action Plan Table & Signatures */}
        <div className="page-break page">
          <SectionTitle number="6" title="PLANO DE AÇÃO" />
          <table className="pgr-table">
            <thead>
              <tr>
                <th>Nível de Risco</th>
                <th>Perigo</th>
                <th>Medidas a Implementar</th>
                <th>Cronograma</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {inventory.risks.filter(r => r.riskLevel.value > 1).sort((a,b) => b.riskLevel.value - a.riskLevel.value).length > 0 ? (
                inventory.risks.filter(r => r.riskLevel.value > 1).sort((a,b) => b.riskLevel.value - a.riskLevel.value).map(risk => (
                  <tr key={risk.id}>
                    <td>{risk.riskLevel.level}</td>
                    <td>{risk.dangerName}</td>
                    <td>
                      {risk.protectionMeasures && risk.protectionMeasures.length > 0 ? (
                        <div className="space-y-1">
                          {risk.protectionMeasures
                            .filter(measure => measure.implementationStatus === 'yes')
                            .map((measure, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">{measure.measureName}</span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        'Nenhuma medida a implementar'
                      )}
                    </td>
                    <td>Imediato/Contínuo</td>
                    <td>Empresa</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center">Nenhuma ação prioritária necessária. Manter controles existentes.</td></tr>
              )}
            </tbody>
          </table>
          
          <SectionTitle number="7" title="ASSINATURAS" />
          <div className="flex justify-around mt-24">
              <div className="text-center">
                  <p className="border-t border-black px-12 pt-2">_______________________________________</p>
                  <p className="font-semibold">{company.name}</p>
                  <p>Representante Legal</p>
              </div>
              <div className="text-center">
                  <p className="border-t border-black px-12 pt-2">_______________________________________</p>
                  <p className="font-semibold">Nome do Responsável Técnico</p>
                  <p>Registro Profissional</p>
              </div>
          </div>
          <PrintFooter pageNumber={8} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
});
