'use client';

import { SettlementSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useGroupStore } from '@/store/groupStore';
import { ArrowRight } from 'lucide-react';

interface Props {
  summary: SettlementSummary;
  groupId: string;
  currentUserId: string;
}

export default function SettlementView({ summary, groupId, currentUserId }: Props) {
  const { recordSettlement } = useGroupStore();

  const handleSettle = async (receiverId: string, amount: number) => {
    if (!confirm(`Confirm payment of ${formatCurrency(amount)}?`)) return;
    await recordSettlement(groupId, receiverId, amount);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Balances</h3>
        <div className="space-y-2">
          {summary.balances.map((b) => (
            <div key={b.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800 text-sm">{b.name}</p>
                <p className="text-xs text-gray-400">Paid: {formatCurrency(b.totalPaid)}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${b.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {b.balance >= 0 ? '+' : ''}{formatCurrency(b.balance)}
                </p>
                <p className="text-xs text-gray-400">{b.balance >= 0 ? 'receives' : 'owes'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {summary.suggestedSettlements.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Suggested Settlements</h3>
          <div className="space-y-2">
            {summary.suggestedSettlements.map((t, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-800">{t.payerName}</span>
                    <ArrowRight size={14} className="text-orange-500" />
                    <span className="font-medium text-gray-800">{t.receiverName}</span>
                  </div>
                  <p className="text-orange-600 font-bold text-sm mt-0.5">{formatCurrency(t.amount)}</p>
                </div>
                {t.payerId === currentUserId && (
                  <button onClick={() => handleSettle(t.receiverId, t.amount)}
                    className="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-orange-600 transition">
                    Pay
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
