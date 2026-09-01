import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  Users, 
  Headphones, 
  FileText, 
  BarChart3, 
  UserCheck, 
  Layers, 
  CreditCard, 
  Wallet, 
  Coins, 
  Percent, 
  MessageSquare, 
  Receipt, 
  Layout, 
  Palette, 
  File, 
  Menu as MenuIcon, 
  Edit3, 
  BookOpen, 
  Network, 
  Award, 
  Crop, 
  Grid as GridIcon, 
  Smartphone, 
  Sparkles, 
  ScanFace, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  CloudDownload, 
  Database, 
  HardDrive, 
  Cpu, 
  Clock, 
  Code, 
  Settings, 
  Paintbrush, 
  ListFilter, 
  Bell, 
  ShieldAlert, 
  BarChart2, 
  Megaphone,
  Search,
  Key,
  Maximize2,
  X,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Pin,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Shield,
  Server,
  Download,
  Filter
} from 'lucide-react';
import { DashboardService } from '../../../services/dashboardService';
import { PlatformGovernanceStats } from '../../../types/dashboard';
import { PlatformVersionService, PlatformVersionConfig } from '../../../services/platformVersionService';

interface ToolItem {
  id: string;
  name: string;
  category: 'Schools' | 'Billing' | 'Website' | 'Content' | 'Server' | 'Admin';
  icon: React.ElementType;
  bgClass: string;
  iconClass: string;
  targetTab?: string;
  description: string;
}

export const PlatformSuperAdminDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [stats, setStats] = useState<PlatformGovernanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Platform Version State (Loaded dynamically from database)
  const [platformVersion, setPlatformVersion] = useState<string>('3.6.0');
  const [versionDetails, setVersionDetails] = useState<PlatformVersionConfig | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [newVersionInput, setNewVersionInput] = useState<string>('');
  const [newReleaseNotes, setNewReleaseNotes] = useState<string>('');
  const [isSavingVersion, setIsSavingVersion] = useState<boolean>(false);
  const [versionSuccessMessage, setVersionSuccessMessage] = useState<string | null>(null);

  // Platform Hub Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Interactive Modal States
  const [activeToolModal, setActiveToolModal] = useState<ToolItem | null>(null);
  const [isLiveFeedModalOpen, setIsLiveFeedModalOpen] = useState<boolean>(false);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState<boolean>(false);
  
  // Add School Form State
  const [newSchoolName, setNewSchoolName] = useState<string>('');
  const [newSchoolEmail, setNewSchoolEmail] = useState<string>('');
  const [newSchoolPhone, setNewSchoolPhone] = useState<string>('');
  const [newSchoolPlan, setNewSchoolPlan] = useState<string>('Enterprise');
  const [addSchoolSuccess, setAddSchoolSuccess] = useState<boolean>(false);

  // Live Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await DashboardService.getPlatformSuperAdminStats();
        if (isMounted) {
          setStats(result);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load super admin stats:', err);
        if (isMounted) {
          setError('Could not establish secure link to governance telemetry.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchVersion = async () => {
      const config = await PlatformVersionService.getVersionConfig();
      if (isMounted) {
        setPlatformVersion(config.version);
        setVersionDetails(config);
        setNewVersionInput(config.version);
      }
    };

    fetchStats();
    fetchVersion();
    return () => {
      isMounted = false;
    };
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  // List of all 43 tools matching the reference image exactly
  const toolsList: ToolItem[] = [
    { id: 'schools', name: 'Schools', category: 'Schools', icon: Building2, bgClass: 'bg-cyan-500', iconClass: 'text-white', targetTab: 'tenants', description: 'Manage all onboarded educational institutions and campuses.' },
    { id: 'add_school', name: 'Add School', category: 'Schools', icon: Plus, bgClass: 'bg-emerald-500', iconClass: 'text-white', description: 'Provision a brand new tenant environment with custom domain and config.' },
    { id: 'team', name: 'Team', category: 'Admin', icon: Users, bgClass: 'bg-purple-500', iconClass: 'text-white', targetTab: 'users', description: 'Super admin staff, role permissions, and governance team assignments.' },
    { id: 'support_desk', name: 'Support Desk', category: 'Admin', icon: Headphones, bgClass: 'bg-amber-500', iconClass: 'text-white', description: 'Centralized helpdesk tickets, tenant queries, and technical assistance.' },
    { id: 'onboarding_templates', name: 'Onboarding Templates', category: 'Admin', icon: FileText, bgClass: 'bg-amber-600', iconClass: 'text-white', description: 'Preset data templates and onboarding workflow blueprints for new schools.' },
    { id: 'schools_report', name: 'Schools Report', category: 'Schools', icon: BarChart3, bgClass: 'bg-teal-500', iconClass: 'text-white', description: 'Comprehensive usage, subscription health, and activity reports across institutions.' },
    { id: 'attendance_report', name: 'Attendance Report', category: 'Schools', icon: UserCheck, bgClass: 'bg-amber-500', iconClass: 'text-white', targetTab: 'attendance', description: 'Platform-wide student and staff attendance metrics and compliance logs.' },
    
    { id: 'plans', name: 'Plans', category: 'Billing', icon: Layers, bgClass: 'bg-amber-500', iconClass: 'text-white', description: 'Manage tier packages, feature limits, pricing tiers, and trial parameters.' },
    { id: 'payments', name: 'Payments', category: 'Billing', icon: CreditCard, bgClass: 'bg-emerald-500', iconClass: 'text-white', targetTab: 'billing', description: 'Transaction ledger, invoice generation, payment history, and auto-billing.' },
    { id: 'payment_gateways', name: 'Payment Gateways', category: 'Billing', icon: Wallet, bgClass: 'bg-blue-500', iconClass: 'text-white', description: 'Configure Stripe, Razorpay, PayPal, and regional payment gateway APIs.' },
    { id: 'comms_wallet', name: 'Comms Wallet', category: 'Billing', icon: Coins, bgClass: 'bg-teal-500', iconClass: 'text-white', description: 'Manage SMS/WhatsApp credits wallet balances for institutions.' },
    { id: 'comms_rates', name: 'Comms Rates', category: 'Billing', icon: Percent, bgClass: 'bg-purple-600', iconClass: 'text-white', description: 'Per-country SMS, WhatsApp, and email messaging rate cards.' },
    { id: 'sms_gateways', name: 'SMS Gateways', category: 'Server', icon: MessageSquare, bgClass: 'bg-rose-500', iconClass: 'text-white', description: 'Twilio, MSG91, and custom SMPP gateway routing and API keys.' },
    { id: 'fees_report', name: 'Fees Report', category: 'Billing', icon: Receipt, bgClass: 'bg-rose-600', iconClass: 'text-white', description: 'Platform-wide financial collection, transaction volume, and payout summaries.' },
    
    { id: 'landing_page', name: 'Landing Page', category: 'Website', icon: Layout, bgClass: 'bg-purple-500', iconClass: 'text-white', description: 'Edit SaaS public portal content, hero banners, features, and testimonials.' },
    { id: 'landing_templates', name: 'Landing Templates', category: 'Website', icon: Palette, bgClass: 'bg-pink-500', iconClass: 'text-white', description: 'Customizable website landing page themes for multi-tenant portals.' },
    { id: 'pages', name: 'Pages', category: 'Website', icon: File, bgClass: 'bg-blue-500', iconClass: 'text-white', description: 'Manage static CMS pages like Terms of Service, Privacy Policy, and About Us.' },
    { id: 'website_menu', name: 'Website Menu', category: 'Website', icon: MenuIcon, bgClass: 'bg-slate-700', iconClass: 'text-white', description: 'Configure public header navigation links, footer menus, and action buttons.' },
    { id: 'blog', name: 'Blog', category: 'Content', icon: Edit3, bgClass: 'bg-amber-600', iconClass: 'text-white', description: 'Publish product news, feature updates, educational guides, and press releases.' },
    { id: 'knowledge_base', name: 'Knowledge Base', category: 'Content', icon: BookOpen, bgClass: 'bg-teal-600', iconClass: 'text-white', description: 'Documentation articles, user manuals, and video tutorial guides.' },
    { id: 'sitemap', name: 'Sitemap', category: 'Website', icon: Network, bgClass: 'bg-lime-600', iconClass: 'text-white', description: 'XML sitemap generator, SEO indexing configuration, and robots.txt manager.' },
    
    { id: 'certificate_templates', name: 'Certificate Templates', category: 'Content', icon: Award, bgClass: 'bg-amber-500', iconClass: 'text-white', description: 'Design student report cards, graduation certificates, and ID badge layouts.' },
    { id: 'canvas_designer', name: 'Canvas Designer', category: 'Content', icon: Crop, bgClass: 'bg-pink-600', iconClass: 'text-white', description: 'Visual drag-and-drop graphic canvas editor for institution banners and badges.' },
    { id: 'ready_templates', name: 'Ready Templates', category: 'Content', icon: GridIcon, bgClass: 'bg-purple-600', iconClass: 'text-white', description: 'Pre-built examination papers, report cards, and communication templates.' },
    { id: 'app_distribution', name: 'App Distribution', category: 'Server', icon: Smartphone, bgClass: 'bg-blue-600', iconClass: 'text-white', description: 'Manage Android APK / iOS IPA mobile application builds and distribution links.' },
    { id: 'ai_analytics', name: 'AI Analytics', category: 'Admin', icon: Sparkles, bgClass: 'bg-pink-500', iconClass: 'text-white', description: 'Gemini AI predictive insights, drop-out detection, and automated report generators.' },
    { id: 'face_vectors', name: 'Face Vectors', category: 'Server', icon: ScanFace, bgClass: 'bg-teal-500', iconClass: 'text-white', description: 'Biometric face recognition model database and embeddings sync.' },
    { id: 'content_safety', name: 'Content Safety', category: 'Content', icon: ShieldCheck, bgClass: 'bg-emerald-600', iconClass: 'text-white', description: 'Automated content moderation, profanity filter, and file attachment inspection.' },
    
    { id: 'theme_engine', name: 'Theme Engine', category: 'Website', icon: Sliders, bgClass: 'bg-purple-500', iconClass: 'text-white', description: 'Global CSS variables, brand color swatches, dark mode settings, and font selection.' },
    { id: 'server_health', name: 'Server Health', category: 'Server', icon: Activity, bgClass: 'bg-rose-500', iconClass: 'text-white', description: 'CPU, RAM, Redis cache, database connection pools, and container diagnostic tools.' },
    { id: 'software_updates', name: 'Software Updates', category: 'Server', icon: CloudDownload, bgClass: 'bg-blue-500', iconClass: 'text-white', description: 'System version releases, migration scripts, and hotfix deployment history.' },
    { id: 'backup_center', name: 'Backup Center', category: 'Server', icon: Database, bgClass: 'bg-emerald-500', iconClass: 'text-white', description: 'Automated cloud database backups, point-in-time recovery, and export archives.' },
    { id: 'storage_center', name: 'Storage Center', category: 'Server', icon: HardDrive, bgClass: 'bg-amber-500', iconClass: 'text-white', description: 'S3 / Cloud Storage bucket usage, document quotas, and media file manager.' },
    { id: 'infrastructure', name: 'Infrastructure', category: 'Server', icon: Cpu, bgClass: 'bg-slate-800', iconClass: 'text-white', description: 'Cloud Run instances, load balancer routing, SSL certificates, and DNS settings.' },
    { id: 'cron_monitor', name: 'Cron Monitor', category: 'Server', icon: Clock, bgClass: 'bg-teal-500', iconClass: 'text-white', description: 'Scheduled jobs, fee overdue reminders, automated email queues, and task status.' },
    
    { id: 'api_docs', name: 'API Docs', category: 'Server', icon: Code, bgClass: 'bg-indigo-600', iconClass: 'text-white', description: 'Swagger / OpenAPI specification, API keys, webhook endpoints, and GraphQL schema.' },
    { id: 'settings_hub', name: 'Settings Hub', category: 'Admin', icon: Settings, bgClass: 'bg-slate-600', iconClass: 'text-white', targetTab: 'settings', description: 'Platform global configuration, system defaults, timezone, and regional options.' },
    { id: 'appearance', name: 'Appearance', category: 'Website', icon: Paintbrush, bgClass: 'bg-pink-500', iconClass: 'text-white', description: 'Interface layout density, header style, logo branding, and sidebar navigation.' },
    { id: 'master_menus', name: 'Master Menus', category: 'Admin', icon: ListFilter, bgClass: 'bg-blue-500', iconClass: 'text-white', description: 'Role-based navigation menu item visibility and dynamic feature toggle flags.' },
    { id: 'alerts_notifications', name: 'Alerts & Notifications', category: 'Admin', icon: Bell, bgClass: 'bg-amber-500', iconClass: 'text-white', description: 'Broadcast platform notices, system downtime announcements, and push alerts.' },
    { id: 'login_report', name: 'Login Report', category: 'Admin', icon: ShieldAlert, bgClass: 'bg-emerald-600', iconClass: 'text-white', targetTab: 'audit', description: 'Audit log of authentication attempts, IP geo-location tracking, and session duration.' },
    { id: 'engagement_report', name: 'Engagement Report', category: 'Admin', icon: BarChart2, bgClass: 'bg-purple-600', iconClass: 'text-white', description: 'User adoption analytics, daily active users (DAU), and module utilization stats.' },
    { id: 'comms_report', name: 'Comms Report', category: 'Admin', icon: Megaphone, bgClass: 'bg-emerald-500', iconClass: 'text-white', description: 'Delivery status, open rates, and logs for SMS, WhatsApp, and Email broadcasts.' }
  ];

  // Category Filter Pills
  const categories = ['All', 'Schools', 'Billing', 'Website', 'Content', 'Server', 'Admin'];

  // Filter tools based on selected Category and Search Query
  const filteredTools = toolsList.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (tool: ToolItem) => {
    if (tool.id === 'add_school') {
      setIsAddSchoolModalOpen(true);
    } else if (tool.id === 'software_updates') {
      setIsVersionModalOpen(true);
    } else if (tool.targetTab && onNavigate) {
      onNavigate(tool.targetTab);
    } else {
      setActiveToolModal(tool);
    }
  };

  const handleUpdateVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionInput.trim()) return;
    setIsSavingVersion(true);
    try {
      const updated = await PlatformVersionService.updateVersion(
        newVersionInput,
        newReleaseNotes,
        'Super Admin'
      );
      setPlatformVersion(updated.version);
      setVersionDetails(updated);
      setVersionSuccessMessage(`Platform version updated to v${updated.version}`);
      setTimeout(() => {
        setVersionSuccessMessage(null);
        setIsVersionModalOpen(false);
        setNewReleaseNotes('');
        handleRefresh();
      }, 1500);
    } catch (err) {
      console.error('Failed to update version:', err);
    } finally {
      setIsSavingVersion(false);
    }
  };

  const handleCreateSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSchoolSuccess(true);
    setTimeout(() => {
      setAddSchoolSuccess(false);
      setIsAddSchoolModalOpen(false);
      setNewSchoolName('');
      setNewSchoolEmail('');
      setNewSchoolPhone('');
      handleRefresh();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse font-sans">Connecting to Platform Super Console...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-rose-100 max-w-xl mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 font-sans">Governance Link Interrupted</h3>
        <p className="text-sm text-slate-500 mt-2 font-sans">{error || 'Unable to load platform configuration metrics.'}</p>
        <button 
          onClick={handleRefresh}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all text-sm font-sans"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Live Feed Activity Log items matching reference
  const liveActivities = [
    { id: 'act_1', type: 'User Logged In', user: 'school admin (School admin)', time: 'Aug 28', clock: '09:08 PM', icon: Key },
    { id: 'act_2', type: 'User Logged In', user: 'school admin (School admin)', time: 'Aug 28', clock: '08:47 PM', icon: Key },
    { id: 'act_3', type: 'User Logged In', user: 'Amit Sharma (Teacher)', time: 'Aug 28', clock: '08:15 PM', icon: Key },
    { id: 'act_4', type: 'User Logged In', user: 'Super Admin (Superadmin)', time: 'Aug 28', clock: '08:11 PM', icon: Key },
    { id: 'act_5', type: 'User Logged In', user: 'Branch Admin (Superadmin)', time: 'Aug 28', clock: '08:06 PM', icon: Key },
    { id: 'act_6', type: 'User Logged In', user: 'Jobince (School admin)', time: 'Aug 28', clock: '07:49 PM', icon: Key },
    { id: 'act_7', type: 'User Logged In', user: 'Super Admin (Superadmin)', time: 'Aug 28', clock: '07:46 PM', icon: Key },
    { id: 'act_8', type: 'User Logged In', user: 'Super Admin (Superadmin)', time: 'Aug 28', clock: '07:12 PM', icon: Key },
    { id: 'act_9', type: 'User Logged In', user: 'Sudhakar Pandey (School admin)', time: 'Aug 28', clock: '07:10 PM', icon: Key },
  ];

  // Largest schools list matching reference
  const largestSchools = [
    { id: 'ls_1', initials: 'S3', bg: 'bg-sky-500', name: 'SSVP 3.0', contact: 'rahulthakur01@gmail.com · 70083...', users: '888 users' },
    { id: 'ls_2', initials: 'S', bg: 'bg-pink-600', name: 'SUDHAKAR', contact: 'cloudwaveindia@gmail.com · 9212...', users: '818 users' },
    { id: 'ls_3', initials: 'MS', bg: 'bg-amber-500', name: 'MONTESSORI SCHOOL & Jr...', contact: 'admin@montessoritanuku.com · 9...', users: '798 users' },
    { id: 'ls_4', initials: 'SS', bg: 'bg-teal-500', name: 'SIXTWO SECONDARY SCH...', contact: 'contact@projectworlds.com · 626...', users: '590 users' },
    { id: 'ls_5', initials: 'ZI', bg: 'bg-purple-600', name: 'ZIDO INTERNATIONAL SCHO...', contact: 'zidoschool@gmail.com · +233257...', users: '157 users' },
    { id: 'ls_6', initials: 'S', bg: 'bg-emerald-600', name: 'SKOOL', contact: 'skoolpro2@atomicmail.io · 2348123...', users: '84 users' },
  ];

  // New Registrations matching reference
  const newRegistrations = [
    { id: 'nr_1', initials: 'ES', bg: 'bg-sky-500', name: 'E School', contact: 'moussby0@gmail.com · +2237...', date: 'Aug 28, 2026', isNew: true },
    { id: 'nr_2', initials: 'NS', bg: 'bg-pink-600', name: 'NCC SCHOOL', contact: 'nccenglishmedium@gmail.co...', date: 'Aug 28, 2026', isNew: true },
    { id: 'nr_3', initials: 'UM', bg: 'bg-amber-500', name: 'Ujala Model school', contact: 'ahmadyasee6789@gmail.com ...', date: 'Aug 28, 2026', isNew: true },
    { id: 'nr_4', initials: 'GJ', bg: 'bg-cyan-600', name: 'GHS JALLO STATION LAH...', contact: 'imran.ali9095@gmail.com · +9...', date: 'Aug 28, 2026', isNew: true },
    { id: 'nr_5', initials: 'SA', bg: 'bg-purple-500', name: 'sagana academy', contact: 'patnyoike89@gmail.com · +25...', date: 'Aug 27, 2026', isNew: true },
    { id: 'nr_6', initials: 'A', bg: 'bg-emerald-500', name: 'abcd', contact: 'admin@abcd.edu', date: 'Aug 27, 2026', isNew: false },
  ];

  // Expiring Soon matching reference
  const expiringSoon = [
    { id: 'ex_1', initials: 'A', bg: 'bg-sky-500', name: 'Admin', contact: 'admin@test.com · 08123456789', date: 'Aug 29, 2026', daysLeft: '0 days left' },
    { id: 'ex_2', initials: 'S', bg: 'bg-rose-500', name: 'saney', contact: 'm.saney287@gmail.com · 6151...', date: 'Aug 29, 2026', daysLeft: '0 days left' },
    { id: 'ex_3', initials: 'M', bg: 'bg-amber-500', name: 'MNM', contact: 'barathrajthiru@gmail.com · +91...', date: 'Aug 29, 2026', daysLeft: '0 days left' },
    { id: 'ex_4', initials: 'T', bg: 'bg-teal-600', name: 'test', contact: 'test@test.com · 9090909090', date: 'Aug 29, 2026', daysLeft: '0 days left' },
    { id: 'ex_5', initials: '3', bg: 'bg-purple-600', name: '34retretre', contact: 'retretret@fgdfg.tfgfhg · retr...', date: 'Aug 29, 2026', daysLeft: '0 days left' },
    { id: 'ex_6', initials: 'ML', bg: 'bg-emerald-600', name: 'M. L. PUBLIC SCHOOL', contact: 'test5@gmail.com · 9966335858', date: 'Aug 29, 2026', daysLeft: '0 days left' },
  ];

  // App errors list matching reference
  const applicationErrors = [
    { id: 'err_1', time: '2 hours ago', text1: '[WA panel] send failed for 918...', text2: '[WA panel] send failed for 918146466332.' },
    { id: 'err_2', time: '4 hours ago', text1: 'WhatsApp failed via School gat...', text2: 'WhatsApp failed via School gateway.' },
    { id: 'err_3', time: '4 hours ago', text1: '[WA panel] send failed for 91.', text2: '[WA panel] send failed for 91.' },
    { id: 'err_4', time: '4 hours ago', text1: 'WhatsApp failed via School gat...', text2: 'WhatsApp failed via School gateway.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-slate-50/70 pt-[5px] px-[5px] pb-4 sm:pb-6 rounded-3xl min-h-screen text-slate-800 font-sans"
      id="platform-super-admin-root"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 mb-[5px]" id="superadmin-header">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PLATFORM CONSOLE</span>
          </div>
          <h1 className="text-[25px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
            {getGreeting()}, Super <span className="text-2xl">👏</span>
          </h1>
          <p className="text-[13px] text-slate-500 font-medium font-sans">
            Platform overview — {currentTime || 'Friday, August 28, 2026 · 9:09:53 PM'}
          </p>
        </div>

        {/* Top Right Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsLiveFeedModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-700 transition-all cursor-pointer font-sans"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>LIVE FEED</span>
          </button>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-medium text-slate-600 max-w-xs sm:max-w-md truncate font-sans">
            <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">User Logged In — school admin (School admin) (Aug 28, 2026 - 09:01...)</span>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[10px] mb-[10px]" id="kpi-cards-grid">
        {/* Card 1: Schools on Platform */}
        <div 
          onClick={() => onNavigate?.('tenants')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold p-[2px]">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-sky-600 transition-colors">Total</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">428</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 font-sans">Schools on Platform</p>
          </div>
          {/* Blue Sparkline SVG */}
          <div className="mt-2 h-8 w-full">
            <svg className="w-full h-full text-sky-400 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 25 Q 25 10 50 18 T 100 8 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M 0 25 Q 25 10 50 18 T 100 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div 
          onClick={() => onNavigate?.('billing')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold p-[2px]">
              <Pin className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">Active</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">214</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 font-sans">Active Subscriptions</p>
          </div>
          {/* Green Sparkline SVG */}
          <div className="mt-2 h-8 w-full">
            <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 20 Q 30 28 60 12 T 100 15 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M 0 20 Q 30 28 60 12 T 100 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Revenue This Month */}
        <div 
          onClick={() => onNavigate?.('billing')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold p-[2px]">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">MNT</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">₹0</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 font-sans">Revenue This Month</p>
          </div>
          {/* Green Sparkline SVG */}
          <div className="mt-2 h-8 w-full">
            <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 22 Q 25 15 50 25 T 100 10 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M 0 22 Q 25 15 50 25 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Online Right Now */}
        <div 
          onClick={() => setIsLiveFeedModalOpen(true)}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold p-[2px]">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">1</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 font-sans">Online Right Now</p>
          </div>
          {/* Purple Sparkline SVG */}
          <div className="mt-2 h-8 w-full">
            <svg className="w-full h-full text-purple-500 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 25 Q 35 5 70 20 T 100 12 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M 0 25 Q 35 5 70 20 T 100 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Pending Orders */}
        <div 
          onClick={() => onNavigate?.('billing')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold p-[2px]">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-rose-500 group-hover:underline">Action</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">43</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 font-sans">Pending Orders</p>
          </div>
          {/* Red Sparkline SVG */}
          <div className="mt-2 h-8 w-full">
            <svg className="w-full h-full text-rose-500 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 12 Q 25 25 50 10 T 100 22 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.15" />
              <path d="M 0 12 Q 25 25 50 10 T 100 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Middle Section Split: Platform Hub (Left) & Live Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[10px]">
        
        {/* Left Column (8 cols on lg): Platform Hub */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-[5px] border-b border-slate-100 mb-[10px]">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                <GridIcon className="w-5 h-5 text-indigo-600" /> Platform Hub
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium font-sans">
                <strong className="text-slate-800">{toolsList.length} tools</strong> — everything you run the platform with, in one place
              </p>
            </div>

            {/* Search Tools Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search tools... /"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-sans ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 43 Tools Icon Grid (7 Columns on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  title={tool.description}
                  className="group flex flex-col items-center justify-center p-[2px] rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer text-center aspect-square"
                >
                  <div className={`w-9 h-9 rounded-xl ${tool.bgClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200 p-[2px]`}>
                    <IconComp className={`w-5 h-5 ${tool.iconClass}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2.5 line-clamp-1 group-hover:text-slate-900 font-sans">
                    {tool.name}
                  </span>
                </div>
              );
            })}
            {filteredTools.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-slate-400 font-medium font-sans">
                No tools match your search "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols on lg): Live Activity */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">Live Activity</h2>
                <p className="text-xs text-slate-400 font-medium font-sans">Registrations, payments & logins</p>
              </div>
              <button 
                onClick={() => setIsLiveFeedModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Expand Feed"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Feed Item List */}
            <div className="divide-y divide-slate-100 h-[550px] max-h-[550px] overflow-y-auto pt-2 space-y-0.5">
              {liveActivities.map((act) => {
                const IconComp = act.icon;
                return (
                  <div key={act.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50/70 rounded-lg px-2 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 p-[2px]">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 font-sans truncate">{act.type}</p>
                        <p className="text-[11px] text-slate-500 font-sans truncate">{act.user}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-[11px] font-semibold text-slate-600 font-sans">{act.time}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{act.clock}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setIsLiveFeedModalOpen(true)}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all font-sans cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Complete Audit Feed</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Lower Section (Row 1: 4 Equal Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        
        {/* Card 1: Revenue Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Revenue Overview</h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Subscriptions — last 6 months · lifetime ₹0</p>
          </div>

          {/* Revenue Chart Visual Representation */}
          <div className="py-4">
            <div className="h-32 w-full relative flex items-end">
              {/* Horizontal gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-300 pointer-events-none">
                <div className="border-b border-slate-100 w-full flex justify-between"><span>1.0</span></div>
                <div className="border-b border-slate-100 w-full flex justify-between"><span>0.5</span></div>
                <div className="border-b border-slate-200 w-full flex justify-between font-bold text-slate-400"><span>0.0</span></div>
                <div className="border-b border-slate-100 w-full flex justify-between"><span>-0.5</span></div>
                <div className="w-full flex justify-between"><span>-1.0</span></div>
              </div>

              {/* Zero baseline path with markers */}
              <svg className="w-full h-full text-emerald-600 overflow-visible z-10" viewBox="0 0 100 50">
                <line x1="0" y1="25" x2="100" y2="25" stroke="#10b981" strokeWidth="2" />
                <circle cx="5" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="23" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="42" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="61" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="80" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="95" cy="25" r="2" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>

            {/* X Axis Month Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 font-sans px-1">
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium font-sans">Monthly Recurring</span>
            <span className="font-bold text-emerald-600 font-sans">₹0 / mo</span>
          </div>
        </div>

        {/* Card 2: Subscription Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Subscription Profile</h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Active vs inactive schools</p>
          </div>

          {/* Donut Chart & Legend */}
          <div className="flex items-center justify-around py-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-sky-500"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 50% Active Green Segment */}
                <path
                  className="text-emerald-500"
                  strokeDasharray="50, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-slate-900 font-sans">50%</span>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-sans">Active</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Active</span>
                <span className="font-bold text-slate-900 ml-auto">214</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="text-slate-600 font-medium">Inactive</span>
                <span className="font-bold text-slate-900 ml-auto">214</span>
              </div>
              <div className="pt-1 border-t border-slate-100 flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Total</span>
                <span className="font-extrabold text-slate-900 ml-auto">428</span>
              </div>
            </div>
          </div>

          {/* Demographics Grid Tiles */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">Platform Demographics</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-sky-50/80 rounded-xl text-center border border-sky-100">
                <p className="text-base font-extrabold text-sky-800 font-sans">1,812</p>
                <p className="text-[10px] font-semibold text-sky-600 font-sans">Students</p>
              </div>
              <div className="p-2.5 bg-emerald-50/80 rounded-xl text-center border border-emerald-100">
                <p className="text-base font-extrabold text-emerald-800 font-sans">310</p>
                <p className="text-[10px] font-semibold text-emerald-600 font-sans">Staff</p>
              </div>
              <div className="p-2.5 bg-purple-50/80 rounded-xl text-center border border-purple-100">
                <p className="text-base font-extrabold text-purple-800 font-sans">4,415</p>
                <p className="text-[10px] font-semibold text-purple-600 font-sans">Users</p>
              </div>
              <div className="p-2.5 bg-teal-50/80 rounded-xl text-center border border-teal-100">
                <p className="text-base font-extrabold text-teal-800 font-sans">428</p>
                <p className="text-[10px] font-semibold text-teal-600 font-sans">Schools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">Pending Orders</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Awaiting verification</p>
            </div>
            <button 
              onClick={() => onNavigate?.('billing')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
            >
              View all
            </button>
          </div>

          <div className="py-8 text-center space-y-2 my-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto p-[2px]">
              <FileCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600 font-sans">43 Orders Awaiting Manual Review</p>
            <p className="text-[11px] text-slate-400 font-sans max-w-xs mx-auto">Verification required for regional offline bank wire transfers.</p>
          </div>

          <button 
            onClick={() => onNavigate?.('billing')}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all font-sans cursor-pointer"
          >
            Review Pending Subscriptions
          </button>
        </div>

        {/* Card 4: Largest Schools */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <span>🏆</span> Largest Schools
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">By user count</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onNavigate?.('tenants')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
              >
                View all
              </button>
              <button 
                onClick={() => onNavigate?.('tenants')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {largestSchools.map((sch) => (
              <div key={sch.id} className="flex items-center justify-between py-1 hover:bg-slate-50 rounded-lg px-1 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${sch.bg} text-white flex items-center justify-center font-bold text-xs shrink-0 p-[2px]`}>
                    {sch.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate font-sans">{sch.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-sans">{sch.contact}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0 ml-2 font-sans">
                  {sch.users}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Section (Row 2: 4 Equal Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
        
        {/* Card 1: New Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <span>🏫</span> New Registrations
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Latest schools to join</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onNavigate?.('tenants')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
              >
                View all
              </button>
              <button onClick={() => onNavigate?.('tenants')} className="p-1 text-slate-400 hover:text-slate-600">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {newRegistrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between py-1 hover:bg-slate-50 rounded-lg px-1 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${reg.bg} text-white flex items-center justify-center font-bold text-xs shrink-0 p-[2px]`}>
                    {reg.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate font-sans">{reg.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-sans">{reg.contact}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[10px] text-sky-600 font-semibold font-sans">{reg.date}</p>
                  {reg.isNew && (
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-sans">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Expiring Soon */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <span>⌛</span> Expiring Soon
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Renewals coming up</p>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onNavigate?.('billing')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
              >
                View all
              </button>
              <button onClick={() => onNavigate?.('billing')} className="p-1 text-slate-400 hover:text-slate-600">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {expiringSoon.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between py-1 hover:bg-slate-50 rounded-lg px-1 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${exp.bg} text-white flex items-center justify-center font-bold text-xs shrink-0 p-[2px]`}>
                    {exp.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate font-sans">{exp.name}</p>
                    <p className="text-[10px] text-slate-400 truncate font-sans">{exp.contact}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[10px] text-rose-600 font-semibold font-sans">{exp.date}</p>
                  <p className="text-[9px] text-slate-400 font-medium font-sans">{exp.daysLeft}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: System Health */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <span>💚</span> System Health
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">multischoolv2</p>
              </div>
              <button 
                onClick={() => onNavigate?.('settings')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
              >
                Health Center
              </button>
            </div>

            {/* Status Pills */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-extrabold text-emerald-700 font-sans uppercase">ONLINE</p>
                <p className="text-[9px] font-semibold text-emerald-600 font-sans">Database</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-extrabold text-slate-800 font-sans">102.13 MB</p>
                <p className="text-[9px] font-semibold text-slate-500 font-sans">DB Size</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-extrabold text-emerald-700 font-sans">Optimal</p>
                <p className="text-[9px] font-semibold text-emerald-600 font-sans">Load</p>
              </div>
            </div>

            {/* Hardware Progress Bars */}
            <div className="space-y-3 mt-4 text-xs font-sans">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-slate-600">Disk — 26.61 GB of 96.73 GB</span>
                  <span className="text-slate-800">28%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-semibold">
                  <span className="text-slate-600">RAM — 7.8 GB total</span>
                  <span className="text-slate-800">41%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '41%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
            <span className="text-slate-500 font-medium">Est. concurrent capacity</span>
            <span className="font-extrabold text-slate-900 font-mono">~2,500 users</span>
          </div>
        </div>

        {/* Card 4: Application Errors */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-[10px] space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <span>💥</span> Application Errors
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Latest from the log</p>
            </div>
            <button 
              onClick={() => onNavigate?.('audit')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors font-sans"
            >
              Open logs
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {applicationErrors.map((err) => (
              <div key={err.id} className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 space-y-1">
                <p className="text-[10px] font-bold text-rose-600 font-sans uppercase tracking-wider">{err.time}</p>
                <p className="text-xs font-semibold text-rose-900 font-mono line-clamp-1">{err.text1}</p>
                <p className="text-[10px] text-rose-700 font-mono line-clamp-1">{err.text2}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Footer with dynamic version from database */}
      <footer className="pt-6 pb-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-sans">
        <div>
          © 2026 <strong className="text-slate-600">Ryze Builtechk Multi School ERP SAAS</strong>. All rights reserved.
        </div>
        <div className="font-mono text-[11px] text-slate-500 flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-all">
          <span className="font-semibold text-slate-700">Version {platformVersion}</span>
          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-blue-600 hover:text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200 cursor-pointer"
            title="Update System Version"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update</span>
          </button>
        </div>
      </footer>

      {/* --------------------------- MODALS --------------------------- */}

      {/* Update Version Modal */}
      <AnimatePresence>
        {isVersionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-5 relative"
            >
              <button 
                onClick={() => setIsVersionModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                  <CloudDownload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Update Platform Version</h3>
                  <p className="text-xs text-slate-500 font-sans">Publish new release tag to database</p>
                </div>
              </div>

              {versionSuccessMessage ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900 font-sans">{versionSuccessMessage}</h4>
                  <p className="text-xs text-emerald-700 font-sans">Database updated and synchronized globally.</p>
                </div>
              ) : (
                <form onSubmit={handleUpdateVersionSubmit} className="space-y-4 text-xs font-sans">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Current Active Version:</span>
                      <span className="font-mono font-bold text-slate-900">v{platformVersion}</span>
                    </div>
                    {versionDetails?.updatedAt && (
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Last Release Date:</span>
                        <span>{new Date(versionDetails.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Version Tag (e.g. 3.7.0, 4.0.0)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 3.7.0"
                      value={newVersionInput}
                      onChange={(e) => setNewVersionInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Release Notes / Changelog Summary</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. Feature updates, performance optimization, fee module bug fixes..."
                      value={newReleaseNotes}
                      onChange={(e) => setNewReleaseNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsVersionModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSavingVersion}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingVersion ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Publish & Save</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Tool Modal */}
      <AnimatePresence>
        {activeToolModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-5 relative"
            >
              <button 
                onClick={() => setActiveToolModal(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${activeToolModal.bgClass} flex items-center justify-center shrink-0 shadow-sm`}>
                  {React.createElement(activeToolModal.icon, { className: `w-6 h-6 ${activeToolModal.iconClass}` })}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-sans">
                    {activeToolModal.category} Tool
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-sans mt-1">{activeToolModal.name}</h3>
                  <p className="text-xs text-slate-500 font-sans mt-1">{activeToolModal.description}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Operational
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Permissions required:</span>
                  <span className="font-semibold text-slate-800">Super Administrator (Level 10)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Module ID:</span>
                  <span className="font-mono text-slate-500">{activeToolModal.id}_v3.6</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => setActiveToolModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all font-sans cursor-pointer"
                >
                  Close
                </button>
                {activeToolModal.targetTab && (
                  <button 
                    onClick={() => {
                      const tab = activeToolModal.targetTab!;
                      setActiveToolModal(null);
                      if (onNavigate) onNavigate(tab);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Launch {activeToolModal.name} Module</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add School Modal */}
      <AnimatePresence>
        {isAddSchoolModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-5 relative"
            >
              <button 
                onClick={() => setIsAddSchoolModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Onboard New School</h3>
                  <p className="text-xs text-slate-500 font-sans">Provision a isolated multi-tenant ERP domain</p>
                </div>
              </div>

              {addSchoolSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900 font-sans">School Successfully Provisioned!</h4>
                  <p className="text-xs text-emerald-700 font-sans">Tenant environment created. Login details sent to contact administrator.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateSchoolSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">School / Institution Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Cambridge Academy"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Admin Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="admin@institution.edu"
                      value={newSchoolEmail}
                      onChange={(e) => setNewSchoolEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        placeholder="+1 (555) 000-0000"
                        value={newSchoolPhone}
                        onChange={(e) => setNewSchoolPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
                      <select 
                        value={newSchoolPlan}
                        onChange={(e) => setNewSchoolPlan(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="Enterprise">Enterprise</option>
                        <option value="Standard">Standard</option>
                        <option value="Trial">14-Day Free Trial</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddSchoolModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Provision Tenant</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Feed Full Modal */}
      <AnimatePresence>
        {isLiveFeedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Live Activity Stream</h3>
                </div>
                <button 
                  onClick={() => setIsLiveFeedModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1 pr-1 font-sans">
                {liveActivities.map((act) => (
                  <div key={act.id} className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{act.type}</p>
                        <p className="text-xs text-slate-500">{act.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700">{act.time}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{act.clock}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
                <span className="text-xs text-slate-400 font-sans">Showing latest real-time audit entries</span>
                <button 
                  onClick={() => setIsLiveFeedModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
