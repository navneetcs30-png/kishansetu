/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_USERS, 
  INITIAL_VERIFICATIONS, 
  INITIAL_GUIDANCE_TOPICS, 
  INITIAL_ROLE_CONFIGS 
} from './data/mockData';
import { 
  PlatformUser, 
  VerificationApplication, 
  SubmittedDocument, 
  RoleConfig, 
  PermissionItem,
  Role,
  DashboardMetrics 
} from './types';
import { HeaderStrip } from './components/HeaderStrip';
import { MobileQuickNav } from './components/MobileQuickNav';
import { UserManagementPanel } from './components/UserManagementPanel';
import { VerificationQueuePanel } from './components/VerificationQueuePanel';
import { GuidancePanel } from './components/GuidancePanel';
import { RolesPermissionsPanel } from './components/RolesPermissionsPanel';
import { UserDetailsModal } from './components/UserDetailsModal';
import { RejectVerificationModal } from './components/RejectVerificationModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { EditRoleModal } from './components/EditRoleModal';
import { EditPermissionsModal } from './components/EditPermissionsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SuperAdminControlPanel } from './components/SuperAdminControlPanel';
import { AdminCredentialsModal } from './components/AdminCredentialsModal';
import { Zap, Users, FileCheck, ShieldAlert, BookOpen, Grid2X2 } from 'lucide-react';

export interface AdminAppProps {
  currentUser?: any;
  onSignOut?: () => void;
  onSwitchModule?: (module: string) => void;
}

export default function App({ currentUser, onSignOut, onSwitchModule }: AdminAppProps = {}) {
  // Core Operational States
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [verifications, setVerifications] = useState<VerificationApplication[]>(INITIAL_VERIFICATIONS);
  const [roleConfigs, setRoleConfigs] = useState<RoleConfig[]>(INITIAL_ROLE_CONFIGS);
  const [activeMobileSection, setActiveMobileSection] = useState<string>('panel-users');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [adminSection, setAdminSection] = useState<'control-tower' | 'grid' | 'users' | 'verifications' | 'roles' | 'guidance'>('control-tower');
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);

  // Modal States
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<PlatformUser | null>(null);
  const [selectedUserForRoleEdit, setSelectedUserForRoleEdit] = useState<PlatformUser | null>(null);
  const [selectedAppForReject, setSelectedAppForReject] = useState<VerificationApplication | null>(null);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<RoleConfig | null>(null);
  const [previewDocState, setPreviewDocState] = useState<{
    doc: SubmittedDocument | null;
    applicantName: string;
    isOpen: boolean;
  }>({
    doc: null,
    applicantName: '',
    isOpen: false,
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize Mobile Active Section on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const panels = ['panel-users', 'panel-verifications', 'panel-guidance', 'panel-roles'];
      const scrollPosition = window.scrollY + 160;

      for (const id of panels) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveMobileSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute Live Metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const pendingVerifsCount = verifications.filter((v) => v.status === 'Pending').length;
    const totalListings = users.reduce((acc, u) => acc + (u.activeListingsCount || 0), 0) + 3380;
    const suspended = users.filter((u) => u.accountStatus === 'Suspended').length;

    const farmers = users.filter((u) => u.role === 'Farmer' && u.accountStatus === 'Active').length + 1415;
    const bulkBuyers = users.filter((u) => u.role === 'Bulk Buyer' && u.accountStatus === 'Active').length + 384;
    const consumers = users.filter((u) => u.role === 'Consumer' && u.accountStatus === 'Active').length + 8936;
    const totalPlatform = farmers + bulkBuyers + consumers + users.length;

    return {
      totalUsers: totalPlatform,
      pendingVerifications: pendingVerifsCount,
      activeListings: totalListings,
      suspendedAccounts: suspended,
      activeFarmers: farmers,
      activeBulkBuyers: bulkBuyers,
      activeConsumers: consumers,
    };
  }, [users, verifications]);

  // Actions for User Management
  const handleToggleSuspendUser = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newStatus = user.accountStatus === 'Suspended' ? 'Active' : 'Suspended';
          addToast(
            newStatus === 'Suspended' ? 'warning' : 'success',
            `User ${newStatus === 'Suspended' ? 'Suspended' : 'Reactivated'}`,
            `${user.name} (${user.id}) account status set to ${newStatus}.`
          );
          return { ...user, accountStatus: newStatus };
        }
        return user;
      })
    );

    // Update open modal if inspecting same user
    if (selectedUserForDetails && selectedUserForDetails.id === userId) {
      setSelectedUserForDetails((prev) =>
        prev ? { ...prev, accountStatus: prev.accountStatus === 'Suspended' ? 'Active' : 'Suspended' } : null
      );
    }
  };

  const handleSaveUserRole = (userId: string, newRole: Role) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          addToast(
            'success',
            'Role Updated Successfully',
            `${user.name} assigned new role: ${newRole}.`
          );
          return { ...user, role: newRole };
        }
        return user;
      })
    );
  };

  // Actions for Verification Queue
  const handleApproveVerification = (applicationId: string) => {
    const app = verifications.find((v) => v.id === applicationId);
    if (!app) return;

    // Mark application approved
    setVerifications((prev) =>
      prev.map((v) => (v.id === applicationId ? { ...v, status: 'Approved' } : v))
    );

    // Update user in users list to Active & Verified
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === app.userId || u.name === app.applicantName) {
          return {
            ...u,
            accountStatus: 'Active',
            documentStatus: 'Verified',
            verifiedDate: '2026-09-14',
          };
        }
        return u;
      })
    );

    addToast(
      'success',
      'Verification Approved',
      `Application for ${app.applicantName} (${app.role}) approved and account activated.`
    );
  };

  const handleConfirmRejectVerification = (applicationId: string, reason: string) => {
    const app = verifications.find((v) => v.id === applicationId);
    if (!app) return;

    // Mark application rejected with reason
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === applicationId
          ? { ...v, status: 'Rejected', rejectionReason: reason }
          : v
      )
    );

    // Update user record note
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === app.userId || u.name === app.applicantName) {
          return {
            ...u,
            documentStatus: 'Rejected',
            notes: `Verification rejected on 2026-09-14: ${reason}`,
          };
        }
        return u;
      })
    );

    addToast(
      'warning',
      'Verification Rejected',
      `Application for ${app.applicantName} rejected. Reason logged: ${reason}`
    );
  };

  // Actions for Roles & Permissions
  const handleSaveRolePermissions = (roleName: string, updatedPermissions: PermissionItem[]) => {
    setRoleConfigs((prev) =>
      prev.map((r) => (r.role === roleName ? { ...r, permissions: updatedPermissions } : r))
    );
    addToast(
      'success',
      'Permissions Matrix Updated',
      `Permissions for ${roleName} role successfully reconfigured and saved.`
    );
  };

  // Refresh queue simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('info', 'Queue Synchronized', 'All verification feeds and user states are up to date.');
    }, 700);
  };

  // Export audit log simulation
  const handleExportAudit = () => {
    const auditData = {
      timestamp: new Date().toISOString(),
      adminId: 'ADM-9428',
      summary: {
        totalUsers: metrics.totalUsers,
        pendingVerifications: metrics.pendingVerifications,
        activeListings: metrics.activeListings,
        activeFarmers: metrics.activeFarmers,
        activeBulkBuyers: metrics.activeBulkBuyers,
        activeConsumers: metrics.activeConsumers,
      },
      verificationQueue: verifications.map((v) => ({
        id: v.id,
        applicant: v.applicantName,
        role: v.role,
        status: v.status,
        waitingHours: v.waitingHours,
      })),
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisandirect-admin-audit-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('success', 'Audit Export Ready', 'Sanitized operations audit report downloaded.');
  };

  return (
    <div className="min-h-screen admin-dashboard-root bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header & Running Metric Summary Strip */}
      <HeaderStrip
        metrics={metrics}
        onRefresh={handleRefresh}
        onExportAudit={handleExportAudit}
        onOpenCredentialsModal={() => setIsCredentialsModalOpen(true)}
        isRefreshing={isRefreshing}
        sampleDataCount={users.length}
      />

      {/* Sticky Quick-Navigation Bar on Mobile */}
      <MobileQuickNav
        activeSection={activeMobileSection}
        onSelectSection={setActiveMobileSection}
        pendingVerificationsCount={metrics.pendingVerifications}
        totalUsersCount={users.length}
      />

      {/* Main Operations Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Descriptive Section Heading & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <span>Platform Operations & Super Admin Control Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supervise multi-role participants, review legal credentials, enforce SLA standards, and manage system access privileges.
            </p>
          </div>

          {/* Admin Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAdminSection('control-tower')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'control-tower'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-300" />
              <span>⚡ Super Admin Control Tower</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('users')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'users'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>👥 Users ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('verifications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'verifications'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>📋 Verification Queue ({metrics.pendingVerifications})</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('roles')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'roles'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
              <span>🛡️ RBAC Permissions</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('guidance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'guidance'
                  ? 'bg-teal-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-300" />
              <span>📖 SOPs</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                adminSection === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="2x2 Multi-Panel Grid View"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>2×2 Grid</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Super Admin Master Parameter Control Tower */}
        {adminSection === 'control-tower' && (
          <SuperAdminControlPanel onNotifyToast={addToast} />
        )}

        {/* View Mode 2: Full User Directory */}
        {adminSection === 'users' && (
          <UserManagementPanel
            users={users}
            onViewDetails={setSelectedUserForDetails}
            onToggleSuspend={handleToggleSuspendUser}
            onEditRole={setSelectedUserForRoleEdit}
          />
        )}

        {/* View Mode 3: Full Verification Queue */}
        {adminSection === 'verifications' && (
          <VerificationQueuePanel
            applications={verifications}
            onApprove={handleApproveVerification}
            onOpenRejectModal={setSelectedAppForReject}
            onPreviewDocument={(doc, applicantName) =>
              setPreviewDocState({ doc, applicantName, isOpen: true })
            }
          />
        )}

        {/* View Mode 4: Full Roles & Permissions */}
        {adminSection === 'roles' && (
          <RolesPermissionsPanel
            roles={roleConfigs}
            onEditPermissions={setSelectedRoleForPermissions}
          />
        )}

        {/* View Mode 5: Full Guidance SOPs */}
        {adminSection === 'guidance' && (
          <GuidancePanel topics={INITIAL_GUIDANCE_TOPICS} />
        )}

        {/* View Mode 6: 2x2 Desktop Grid Layout */}
        {adminSection === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="h-full">
              <UserManagementPanel
                users={users}
                onViewDetails={setSelectedUserForDetails}
                onToggleSuspend={handleToggleSuspendUser}
                onEditRole={setSelectedUserForRoleEdit}
              />
            </div>
            <div className="h-full">
              <VerificationQueuePanel
                applications={verifications}
                onApprove={handleApproveVerification}
                onOpenRejectModal={setSelectedAppForReject}
                onPreviewDocument={(doc, applicantName) =>
                  setPreviewDocState({ doc, applicantName, isOpen: true })
                }
              />
            </div>
            <div className="h-full">
              <GuidancePanel topics={INITIAL_GUIDANCE_TOPICS} />
            </div>
            <div className="h-full">
              <RolesPermissionsPanel
                roles={roleConfigs}
                onEditPermissions={setSelectedRoleForPermissions}
              />
            </div>
          </div>
        )}
      </main>

      {/* Operations Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            KisanDirect Agriculture Network • Internal Operations Administration Portal
          </span>
          <span className="font-mono text-[11px] text-slate-600">
            Encrypted Session: TLS 1.3 • Role: Platform Super Admin
          </span>
        </div>
      </footer>

      {/* Interactive Modals */}
      <UserDetailsModal
        user={selectedUserForDetails}
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onToggleSuspend={handleToggleSuspendUser}
        onEditRole={(user) => {
          setSelectedUserForRoleEdit(user);
        }}
      />

      <RejectVerificationModal
        application={selectedAppForReject}
        isOpen={!!selectedAppForReject}
        onClose={() => setSelectedAppForReject(null)}
        onConfirmReject={handleConfirmRejectVerification}
      />

      <DocumentPreviewModal
        document={previewDocState.doc}
        applicantName={previewDocState.applicantName}
        isOpen={previewDocState.isOpen}
        onClose={() => setPreviewDocState({ doc: null, applicantName: '', isOpen: false })}
      />

      <EditRoleModal
        user={selectedUserForRoleEdit}
        isOpen={!!selectedUserForRoleEdit}
        onClose={() => setSelectedUserForRoleEdit(null)}
        onSaveRole={handleSaveUserRole}
      />

      <EditPermissionsModal
        roleConfig={selectedRoleForPermissions}
        isOpen={!!selectedRoleForPermissions}
        onClose={() => setSelectedRoleForPermissions(null)}
        onSavePermissions={handleSaveRolePermissions}
      />

      <AdminCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSuccessToast={addToast}
      />

      {/* Floating Action Feedback Toasts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
