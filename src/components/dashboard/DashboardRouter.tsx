import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlatformSuperAdminDashboard } from './roles/PlatformSuperAdminDashboard';
import { AdminDashboard } from './roles/AdminDashboard';
import { TeacherDashboard } from './roles/TeacherDashboard';
import { StudentDashboard } from './roles/StudentDashboard';
import { ParentDashboard } from './roles/ParentDashboard';
import { GovernmentDashboard } from './roles/GovernmentDashboard';

// Mock components for other roles
const GenericDashboard = ({ title }: { title: string }) => (
  <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800">{title} Dashboard</h2>
    <p className="text-slate-500 mt-2">Welcome to your specialized workspace.</p>
  </div>
);

export const DashboardRouter: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { activeRoleAssignment, effectiveRoleAssignments } = useAuth();
  
  // Resolve the role from active assignment, or fallback to the first effective role, default to student
  const roleCode = activeRoleAssignment?.roleCode 
    || (effectiveRoleAssignments || [])[0]?.roleCode 
    || 'student';
    
  const roleName = activeRoleAssignment?.roleName 
    || (effectiveRoleAssignments || [])[0]?.roleName 
    || roleCode?.replace(/_/g, ' ')
    || 'Student';

  const renderDashboard = () => {
    switch (roleCode) {
      case 'super_admin':
        return <PlatformSuperAdminDashboard onNavigate={onNavigate} />;
      case 'platform_admin':
      case 'institution_manager':
      case 'school_owner':
      case 'tenant_admin':
      case 'principal':
      case 'director':
      case 'vice_principal':
        return <AdminDashboard onNavigate={onNavigate} />;
      case 'academic_coordinator':
      case 'class_coordinator':
      case 'examination_coordinator':
      case 'teacher':
        return <TeacherDashboard onNavigate={onNavigate} />;
      case 'student':
        return <StudentDashboard onNavigate={onNavigate} />;
      case 'parent':
        return <ParentDashboard onNavigate={onNavigate} />;
      case 'accountant':
      case 'finance':
        return <GenericDashboard title="Finance & Accounting" />;
      case 'hr_manager':
      case 'hr':
        return <GenericDashboard title="Human Resources" />;
      case 'librarian':
        return <GenericDashboard title="Library Management" />;
      case 'transport_manager':
        return <GenericDashboard title="Transport Management" />;
      case 'it_manager':
        return <GenericDashboard title="IT & Device Management" />;
      case 'govt_admin':
      case 'district_admin':
      case 'government':
      case 'national':
      case 'district':
        return <GovernmentDashboard onNavigate={onNavigate} title="Government & District Oversight" />;
      default:
        return <GenericDashboard title="Overview" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Title Bar - Removed per user request */}
      
      {renderDashboard()}
    </div>
  );
};
