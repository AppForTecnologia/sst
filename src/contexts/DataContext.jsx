
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialData } from '@/data/initialData';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [companies, setCompanies] = useLocalStorage('pgr_companies', initialData.companies);
  const [employees, setEmployees] = useLocalStorage('pgr_employees', initialData.employees);
  const [segments, setSegments] = useLocalStorage('pgr_segments', initialData.segments);
  const [dangerGroups, setDangerGroups] = useLocalStorage('pgr_danger_groups', initialData.dangerGroups);
  const [dangers, setDangers] = useLocalStorage('pgr_dangers', initialData.dangers);
  const [dangerSources, setDangerSources] = useLocalStorage('pgr_danger_sources', initialData.dangerSources);
  const [protectionMeasures, setProtectionMeasures] = useLocalStorage('pgr_protection_measures', initialData.protectionMeasures);
  const [injuries, setInjuries] = useLocalStorage('pgr_injuries', initialData.injuries);
  const [sectors, setSectors] = useLocalStorage('pgr_sectors', initialData.sectors);
  const [functions, setFunctions] = useLocalStorage('pgr_functions', initialData.functions);
  const [nrs, setNrs] = useLocalStorage('pgr_nrs', initialData.nrs);
  const [nrDetails, setNrDetails] = useLocalStorage('pgr_nr_details', initialData.nrDetails);
  const [segmentNrAssociations, setSegmentNrAssociations] = useLocalStorage('pgr_segment_nr_associations', initialData.segmentNrAssociations);
  const [inventories, setInventories] = useLocalStorage('pgr_inventories', initialData.inventories);

  const dataMap = {
    companies: { data: companies, setData: setCompanies },
    employees: { data: employees, setData: setEmployees },
    segments: { data: segments, setData: setSegments },
    danger_groups: { data: dangerGroups, setData: setDangerGroups },
    dangers: { data: dangers, setData: setDangers },
    danger_sources: { data: dangerSources, setData: setDangerSources },
    protection_measures: { data: protectionMeasures, setData: setProtectionMeasures },
    injuries: { data: injuries, setData: setInjuries },
    sectors: { data: sectors, setData: setSectors },
    functions: { data: functions, setData: setFunctions },
    nrs: { data: nrs, setData: setNrs },
    nr_details: { data: nrDetails, setData: setNrDetails },
    segment_nr_associations: { data: segmentNrAssociations, setData: setSegmentNrAssociations },
    inventories: { data: inventories, setData: setInventories },
  };

  const value = {
    companies, setCompanies,
    employees, setEmployees,
    segments, setSegments,
    dangerGroups, setDangerGroups,
    dangers, setDangers,
    dangerSources, setDangerSources,
    protectionMeasures, setProtectionMeasures,
    injuries, setInjuries,
    sectors, setSectors,
    functions, setFunctions,
    nrs, setNrs,
    nrDetails, setNrDetails,
    segmentNrAssociations, setSegmentNrAssociations,
    inventories, setInventories,
    dataMap,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
