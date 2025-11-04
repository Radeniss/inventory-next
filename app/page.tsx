'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import InventoryList from './InventoryList';
import { useSession } from '@/hooks/use-session';
import { supabase } from '@/lib/supabase';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
  last_updated: string;
  created_at: string;
}

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [session, loading, router]);

  useEffect(() => {
    const getItems = async () => {
      if (session) {
        try {
          const response = await fetch('/api/inventory');
          if (response.ok) {
            const data = await response.json();
            setItems(data);
          } else {
            console.error('Failed to fetch inventory data on client:', response.statusText);
          }
        } catch (error) {
          console.error('Network or parsing error during client fetch:', error);
        }
      }
    };

    getItems();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading || !session) {
    return <p>Loading...</p>; // Or a proper loading spinner
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Inventory Management
              </h1>
              <p className="text-slate-600 text-lg mt-2">
                Manage your inventory items efficiently
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-slate-600">
          </div>
          <Link href="/add">
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>
        
        <InventoryList initialItems={items} /> 

      </div>
      <Toaster />
    </main>
  );
}
