import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { TenantService } from '../../services/tenantService';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Tenant, Campus, InstitutionType } from '../../types';
import { Building2, Plus, MapPin, Globe, Mail, Phone, Layers, CheckCircle } from 'lucide-react';

export const TenantManagement: React.FC = () => {
  const { tenants, currentTenant, switchTenant, refreshTenants, campuses } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);

  // New Tenant Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<InstitutionType>('k12_school');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [primaryColor, setPrimaryColor] = useState('#0c4a6e');

  // New Campus Form State
  const [campusName, setCampusName] = useState('');
  const [campusCode, setCampusCode] = useState('');
  const [campusAddress, setCampusAddress] = useState('');
  const [campusEmail, setCampusEmail] = useState('');
  const [campusPhone, setCampusPhone] = useState('');

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      notify('error', 'Validation Error', 'Name and Code are required.');
      return;
    }

    try {
      await TenantService.createTenant(
        {
          name,
          code: code.toUpperCase(),
          type,
          registrationNumber: registrationNumber || `CBSE-REG-${Date.now().toString().slice(-4)}`,
          email: email || 'admin@' + code.toLowerCase() + '.edu.in',
          phone: phone || '+91 11 0000 0000',
          address: {
            street: 'Institutional Area, Sector 4',
            city: city || 'New Delhi',
            state: state || 'Delhi',
            country: country || 'India',
            postalCode: '110001'
          },
          branding: {
            primaryColor,
            accentColor: '#0284c7',
            portalTitle: `${name} Portal`,
            themeMode: 'light'
          },
          academicConfig: {
            academicYearStartMonth: 4,
            gradingSystem: 'percentage',
            attendanceType: 'daily_once',
            termsPerYear: 2
          },
          status: 'active',
          enabledModules: ['core', 'student', 'academic', 'attendance'],
          totalStudents: 0,
          totalStaff: 1
        },
        {
          userId: currentUser?.id || 'usr_admin',
          email: currentUser?.email || 'admin@edutech.edu',
          name: currentUser?.displayName || 'Admin'
        }
      );

      notify('success', 'Institution Created', `Tenant "${name}" provisioned with isolated database scope.`);
      setIsCreateModalOpen(false);
      await refreshTenants();
      // Reset form
      setName('');
      setCode('');
    } catch (err: any) {
      notify('error', 'Creation Failed', err.message);
    }
  };

  const handleCreateCampus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !campusName || !campusCode) return;

    try {
      await TenantService.createCampus({
        tenantId: currentTenant.id,
        name: campusName,
        code: campusCode.toUpperCase(),
        address: campusAddress || currentTenant.address?.city || 'Main',
        isMainCampus: false,
        contactEmail: campusEmail || currentTenant.email,
        contactPhone: campusPhone || currentTenant.phone
      });

      notify('success', 'Campus Added', `Campus "${campusName}" attached to ${currentTenant.name}.`);
      setIsCampusModalOpen(false);
      await refreshTenants();
      setCampusName('');
      setCampusCode('');
    } catch (err: any) {
      notify('error', 'Campus Creation Failed', err.message);
    }
  };

  const columns: Column<Tenant>[] = [
    {
      header: 'Institution',
      accessor: (t) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-white text-xs shrink-0"
            style={{ backgroundColor: t.branding?.primaryColor || '#0f3a63' }}
          >
            {t.code ? t.code.substring(0, 3) : 'EDU'}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
            <p className="text-2xs text-slate-500 font-mono">{t.code} • Reg: {t.registrationNumber || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: (t) => (
        <Badge variant="primary">
          {t.type?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
        </Badge>
      )
    },
    {
      header: 'Location',
      accessor: (t) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {t.address?.city || 'City'}, {t.address?.state || t.address?.country || 'Region'}
        </span>
      )
    },
    {
      header: 'Active Modules',
      accessor: (t) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {t.enabledModules?.length || 0} Modules
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (t) => (
        <Badge variant={t.status === 'active' ? 'success' : 'warning'}>
          {t.status ? t.status.toUpperCase() : 'ACTIVE'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (t) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchTenant(t.id)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              currentTenant?.id === t.id
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200'
            }`}
          >
            {currentTenant?.id === t.id ? 'Active Scope' : 'Switch To'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Multi-Tenant Educational Institutions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized platform registry for schools, colleges, vocational centers, and education groups.
          </p>
        </div>

        {hasPermission('tenant.manage') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCampusModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              + Add Campus
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Register New Institution
            </button>
          </div>
        )}
      </div>

      {/* Institutions Table */}
      <DataTable
        data={tenants}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchPlaceholder="Search institutions by name, code, or city..."
        searchFilter={(t, q) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          (t.address?.city?.toLowerCase() || '').includes(q)
        }
      />

      {/* Campus Hierarchy Overview for Active Tenant */}
      {currentTenant && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Physical Campus Hierarchy: {currentTenant.name}
              </h2>
              <p className="text-xs text-slate-500">
                Structure: Platform → Tenant ({currentTenant.code}) → Campus → Building → Classroom
              </p>
            </div>
            <button
              onClick={() => setIsCampusModalOpen(true)}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              + New Branch Campus
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {campuses.map((cmp) => (
              <div
                key={cmp.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{cmp.name}</h3>
                    {cmp.isMainCampus ? (
                      <Badge variant="success" size="sm">Main Campus</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Branch</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {cmp.address}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-2xs text-slate-500">
                  <span>Code: {cmp.code}</span>
                  <span>Contact: {cmp.contactEmail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Tenant */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Educational Institution"
        subtitle="Creates a new multi-tenant database boundary with isolated permissions."
      >
        <form onSubmit={handleCreateTenant} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cambridge International School"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institution Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CIS-01"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institution Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstitutionType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="k12_school">K-12 School</option>
                <option value="higher_education">College / Higher Education</option>
                <option value="coaching_institute">Coaching / Test Prep</option>
                <option value="vocational">Vocational / Skill College</option>
                <option value="multi_campus_group">Multi-Campus Education Group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Registration / Accreditation Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. EDU-ACC-2026-99"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Boston, MA"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-700 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Provision Institution
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Campus */}
      <Modal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
        title={`Add Campus to ${currentTenant?.name}`}
        subtitle="Register an additional campus or physical branch under this institution."
      >
        <form onSubmit={handleCreateCampus} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Campus Name *
            </label>
            <input
              type="text"
              required
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              placeholder="e.g. East Valley Campus"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Campus Code *
            </label>
            <input
              type="text"
              required
              value={campusCode}
              onChange={(e) => setCampusCode(e.target.value.toUpperCase())}
              placeholder="e.g. OAK-EV"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Address & Location
            </label>
            <input
              type="text"
              value={campusAddress}
              onChange={(e) => setCampusAddress(e.target.value)}
              placeholder="e.g. 500 Sunrise Boulevard, Boston, MA"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCampusModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Save Campus
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
