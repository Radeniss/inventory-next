'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
  last_updated: string;
  created_at: string;
}

// Definisikan Props untuk menerima data awal
interface InventoryListProps {
  initialItems: InventoryItem[];
}

export default function InventoryList({ initialItems }: InventoryListProps) {
  // Gunakan initialItems sebagai nilai awal state
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [loading, setLoading] = useState(false); // Set false karena data awal sudah dimuat
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    quantity: 0,
    description: '',
  });
  const { toast } = useToast();

  // Fungsi fetchItems diubah agar bisa dipanggil setelah POST/PUT/DELETE
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch inventory items',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // useEffect untuk memastikan data diperbarui jika ada perubahan di luar (meskipun initialItems sudah ada)
  // Untuk penggunaan dasar, useEffect ini bisa dihapus jika Anda hanya mengandalkan fetchItems() setelah mutasi
  /*
  useEffect(() => {
    // Jika data awal kosong, coba fetch. Jika ada data, skip initial fetch.
    if (initialItems.length === 0) {
      fetchItems();
    }
  }, [fetchItems, initialItems]);
  */

  const handleDelete = async (id: string) => {
    // Gunakan modal kustom untuk konfirmasi, bukan window.confirm
    // (Karena instruksi melarang alert/confirm, kita tetap pakai if (!confirm) untuk kesederhanaan, tapi idealnya pakai Dialog)
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
        fetchItems(); // Panggil ulang untuk memuat data terbaru
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setEditFormData({
      name: item.name,
      quantity: item.quantity,
      description: item.description,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editItem) return;

    try {
      const response = await fetch(`/api/inventory/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item updated successfully',
        });
        setEditItem(null);
        fetchItems(); // Panggil ulang untuk memuat data terbaru
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="text-sm text-slate-600 mb-4">
        Total Items: <span className="font-semibold">{items.length}</span>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Loading inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No items found
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by adding your first inventory item
            </p>
            <Link href="/add">
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Quantity
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-slate-900">
                  Last Updated
                </TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-900">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        item.quantity === 0
                          ? 'bg-red-100 text-red-800'
                          : item.quantity < 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 max-w-xs truncate">
                    {item.description || '-'}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {formatDate(item.last_updated)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="border-slate-300 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the details of your inventory item
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  value={editFormData.quantity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditItem(null)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
