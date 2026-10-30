import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Check } from 'lucide-react';
import { adminService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';
import type { InventoryRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);

  const { data: inventory, isLoading } = useQuery({
    queryKey: queryKeys.adminInventory,
    queryFn: () => adminService.listInventory(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ variantId, stock }: { variantId: string; stock: number }) =>
      adminService.updateStock(variantId, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminInventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
      setEditingVariant(null);
    },
  });

  const handleEdit = (record: InventoryRecord) => {
    setEditingVariant(record.variantId);
    setStockInput(record.stock);
  };

  const handleSave = (variantId: string) => {
    updateMutation.mutate({ variantId, stock: Math.max(0, stockInput) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <span className="label-xs text-ink-muted">Stock Discipline</span>
          <h1 className="display text-3xl">Inventory Control</h1>
        </div>
        <p className="font-mono text-xs text-ink-muted">
          {inventory ? `${inventory.length} total SKUs tracked` : '—'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-ink/15 bg-paper overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink/15 bg-bone/70 uppercase font-mono tracking-wider text-ink-muted">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Color</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">In Stock</th>
                <th className="py-3 px-4">Alert Status</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {inventory?.map((record) => {
                const isLow = record.stock <= record.lowStockThreshold;
                const isEditing = editingVariant === record.variantId;

                return (
                  <tr key={record.variantId} className="hover:bg-bone/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-ink text-sm">
                      {record.productName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-muted">
                      {record.sku}
                    </td>
                    <td className="py-3 px-4 text-ink-muted">
                      {record.color}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-ink">
                      {record.size}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={stockInput}
                          onChange={(e) => setStockInput(parseInt(e.target.value, 10) || 0)}
                          className="w-20 px-2 py-1 text-xs border border-ink/30 bg-bone font-mono"
                        />
                      ) : (
                        <span className="font-mono text-sm font-semibold">{record.stock}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-900 font-mono text-[10px] uppercase font-semibold">
                          <AlertTriangle className="size-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-700 font-mono text-[10px] uppercase">
                          <Check className="size-3" /> Sufficient
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(record.variantId)}
                            disabled={updateMutation.isPending}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVariant(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          Modify
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
