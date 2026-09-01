import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  StaffProfile,
  StaffDepartment,
  StaffDesignation,
  StaffLeaveType,
  StaffLeaveRequest,
  StaffPerformanceCycle,
  StaffComplianceRecord,
  StaffAnalyticsSummary,
  User,
  Campus
} from '../../types';
import { StaffService } from '../../services/staffService';
import { TenantService } from '../../services/tenantService';
import { useNotification } from '../../context/NotificationContext';

export interface StaffContextType {
  tenantId: string;
  currentUser: User;
  campuses: Campus[];
  selectedCampusId: string;
  setSelectedCampusId: (campusId: string) => void;
  staffList: StaffProfile[];
  selectedStaff: StaffProfile | null;
  setSelectedStaff: (staff: StaffProfile | null) => void;
  departments: StaffDepartment[];
  designations: StaffDesignation[];
  leaveTypes: StaffLeaveType[];
  performanceCycles: StaffPerformanceCycle[];
  analytics: StaffAnalyticsSummary | null;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshAll: () => Promise<void>;
  seedDemoData: () => Promise<void>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{
  tenantId: string;
  currentUser: User;
  children: React.ReactNode;
}> = ({ tenantId, currentUser, children }) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('');
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [departments, setDepartments] = useState<StaffDepartment[]>([]);
  const [designations, setDesignations] = useState<StaffDesignation[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<StaffLeaveType[]>([]);
  const [performanceCycles, setPerformanceCycles] = useState<StaffPerformanceCycle[]>([]);
  const [analytics, setAnalytics] = useState<StaffAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const { notify } = useNotification();

  const loadData = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      // 1. Fetch campuses
      const campusList = await TenantService.getCampuses(tenantId);
      setCampuses(campusList);
      const effectiveCampusId = selectedCampusId || (campusList.length > 0 ? campusList[0].id : '');
      if (!selectedCampusId && effectiveCampusId) {
        setSelectedCampusId(effectiveCampusId);
      }

      // 2. Fetch staff & masters
      const [
        staffData,
        deptData,
        desigData,
        lTypeData,
        cycleData,
        analyticsData
      ] = await Promise.all([
        StaffService.getStaffList(tenantId, effectiveCampusId ? { campusId: effectiveCampusId } : undefined),
        StaffService.getDepartments(tenantId),
        StaffService.getDesignations(tenantId),
        StaffService.getLeaveTypes(tenantId),
        StaffService.getPerformanceCycles(tenantId),
        StaffService.getAnalyticsSummary(tenantId, effectiveCampusId || undefined)
      ]);

      setStaffList(staffData);
      setDepartments(deptData);
      setDesignations(desigData);
      setLeaveTypes(lTypeData);
      setPerformanceCycles(cycleData);
      setAnalytics(analyticsData);

      // Keep selectedStaff sync if available
      if (selectedStaff) {
        const found = staffData.find((s) => s.id === selectedStaff.id);
        if (found) setSelectedStaff(found);
      }
    } catch (err: any) {
      console.error('[StaffProvider] Error loading workforce data:', err);
      notify('error', 'Error Loading Staff Data', err.message || 'Failed to retrieve staff records.');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, selectedCampusId, notify, selectedStaff]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const seedDemoData = async () => {
    setIsLoading(true);
    try {
      const targetCampus = selectedCampusId || (campuses.length > 0 ? campuses[0].id : 'main_campus');
      await StaffService.seedInitialStaffData(tenantId, targetCampus, currentUser);
      notify('success', 'Workforce Initialized', 'Default faculty profiles, departments, and leave allocations generated successfully.');
      await loadData();
    } catch (err: any) {
      notify('error', 'Initialization Failed', err.message || 'Could not seed workforce demo records.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      tenantId,
      currentUser,
      campuses,
      selectedCampusId,
      setSelectedCampusId,
      staffList,
      selectedStaff,
      setSelectedStaff,
      departments,
      designations,
      leaveTypes,
      performanceCycles,
      analytics,
      isLoading,
      activeTab,
      setActiveTab,
      refreshAll: loadData,
      seedDemoData
    }),
    [
      tenantId,
      currentUser,
      campuses,
      selectedCampusId,
      staffList,
      selectedStaff,
      departments,
      designations,
      leaveTypes,
      performanceCycles,
      analytics,
      isLoading,
      activeTab,
      loadData
    ]
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};

export const useStaffContext = () => {
  const ctx = useContext(StaffContext);
  if (!ctx) {
    throw new Error('useStaffContext must be used within a StaffProvider');
  }
  return ctx;
};
