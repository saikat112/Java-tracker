'use client';
import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Users, ChevronRight } from 'lucide-react';
import CreateGroupModal from '@/components/groups/CreateGroupModal';

export default function GroupsPage() {
  const { groups, fetchGroups, isLoading } = useGroupStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-400 text-sm">{groups.length} group{groups.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm font-bold px-4 py-2.5 rounded-2xl hover:bg-violet-700 transition active:scale-95 shadow-md shadow-violet-200">
          <Plus size={16} /> New Group
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mb-4">
            <Users size={36} className="text-violet-300" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">No groups yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">Create a group to split expenses with friends</p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-violet-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-violet-700 transition active:scale-95">
            <Plus size={18} /> Create First Group
          </button>
        </div>
      )}

      {/* Groups list */}
      {!isLoading && groups.length > 0 && (
        <div className="space-y-3">
          {groups.map(group => (
            <Link key={group.id} href={`/groups/${group.id}`}
              className="block bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:border-violet-200 hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-xl font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{group.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">
                      {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                    </span>
                    {group.description && (
                      <>
                        <span className="text-gray-200">•</span>
                        <span className="text-xs text-gray-400 truncate">{group.description}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Total & Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(group.totalExpenses)}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">total</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>

              {/* Member avatars */}
              {group.members && group.members.length > 0 && (
                <div className="flex items-center gap-1 mt-3 pl-0.5">
                  {group.members.slice(0, 5).map((m, i) => (
                    <div key={m.userId}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center border-2 border-white"
                      style={{ marginLeft: i > 0 ? '-6px' : '0' }}>
                      <span className="text-white text-[9px] font-bold">
                        {m.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"
                      style={{ marginLeft: '-6px' }}>
                      <span className="text-gray-500 text-[9px] font-bold">+{group.members.length - 5}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400 ml-2">
                    {group.members.map(m => m.name.split(' ')[0]).slice(0, 3).join(', ')}
                    {group.members.length > 3 ? ` +${group.members.length - 3}` : ''}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
