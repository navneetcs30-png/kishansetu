import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  MoreHorizontal, 
  Eye, 
  UserCheck, 
  UserX, 
  Edit3, 
  RotateCcw,
  ArrowUpDown,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { PlatformUser, Role, AccountStatus } from '../types';

interface UserManagementPanelProps {
  users: PlatformUser[];
  onViewDetails: (user: PlatformUser) => void;
  onToggleSuspend: (userId: string) => void;
  onEditRole: (user: PlatformUser) => void;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users,
  onViewDetails,
  onToggleSuspend,
  onEditRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'name' | 'registrationDate' | 'role' | 'status'>('registrationDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || user.accountStatus === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return 0;
      });
  }, [users, searchTerm, roleFilter, statusFilter, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'registrationDate' | 'role' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'Farmer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono">
            Farmer
          </span>
        );
      case 'Bulk Buyer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/80 text-blue-300 border border-blue-800/80 font-mono">
            Bulk Buyer
          </span>
        );
      case 'Consumer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/80 font-mono">
            Consumer
          </span>
        );
      case 'Admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-950/80 text-purple-300 border border-purple-800/80 font-mono">
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/80 text-rose-400 border border-rose-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Suspended
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-400 border border-amber-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
    }
  };

  return (
    <section 
      id="panel-users" 
      className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
      aria-labelledby="user-mgmt-heading"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="user-mgmt-heading" className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                User Management
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredUsers.length} of {users.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Directory of platform participants across Farmer, Consumer, and Bulk Buyer roles.
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="user-mgmt-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, ID, or city..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              aria-label="Search users by name, email, or ID"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="user-mgmt-role-filter" className="sr-only">Filter by Role</label>
            <select
              id="user-mgmt-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Roles</option>
              <option value="Farmer">Farmers</option>
              <option value="Bulk Buyer">Bulk Buyers</option>
              <option value="Consumer">Consumers</option>
              <option value="Admin">Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="user-mgmt-status-filter" className="sr-only">Filter by Status</label>
            <select
              id="user-mgmt-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              id="user-mgmt-reset-filters-btn"
              onClick={resetFilters}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Dense Table View */}
      <div className="flex-1 overflow-x-auto min-h-[320px] max-h-[440px]">
        <table className="w-full text-left text-xs border-collapse" aria-label="Platform Users Table">
          <thead className="bg-slate-950/70 border-b border-slate-800 sticky top-0 z-10 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="py-2.5 px-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-200 focus:outline-none"
                >
                  <span>User & Contact</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-1 hover:text-slate-200 focus:outline-none"
                >
                  <span>Role</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort('registrationDate')}
                  className="flex items-center gap-1 hover:text-slate-200 focus:outline-none"
                >
                  <span>Registered</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-slate-200 focus:outline-none"
                >
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium">No platform users match your filters.</p>
                  <p className="text-xs text-slate-500 mt-1">Try clearing search terms or resetting role filters.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Search
                  </button>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name & Contact */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-[11px] text-slate-300 shrink-0">
                        {user.avatarSeed}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                          <span>{user.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {user.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>

                  {/* Registered */}
                  <td className="py-2.5 px-3 whitespace-nowrap hidden sm:table-cell text-slate-400 font-mono text-[11px]">
                    {user.registrationDate}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getStatusBadge(user.accountStatus)}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 justify-end">
                      {/* View Details */}
                      <button
                        id={`action-view-${user.id}`}
                        onClick={() => onViewDetails(user)}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        title="View user details & activity"
                        aria-label={`View details for ${user.name}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Role */}
                      <button
                        id={`action-edit-role-${user.id}`}
                        onClick={() => onEditRole(user)}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Edit user role"
                        aria-label={`Edit role for ${user.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Suspend / Reactivate */}
                      <button
                        id={`action-toggle-suspend-${user.id}`}
                        onClick={() => onToggleSuspend(user.id)}
                        className={`p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 ${
                          user.accountStatus === 'Suspended'
                            ? 'hover:bg-emerald-950/60 text-emerald-400 hover:text-emerald-300 focus:ring-emerald-500'
                            : 'hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 focus:ring-rose-500'
                        }`}
                        title={user.accountStatus === 'Suspended' ? 'Reactivate user account' : 'Suspend user account'}
                        aria-label={user.accountStatus === 'Suspended' ? `Reactivate ${user.name}` : `Suspend ${user.name}`}
                      >
                        {user.accountStatus === 'Suspended' ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Strip */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Click on any user row or action to inspect KYC data and security state.</span>
        <span className="font-mono text-slate-500 hidden sm:inline">Active session ID: ADM-9428</span>
      </div>
    </section>
  );
};
