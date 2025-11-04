// Halaman ini bersifat Server Component secara default.
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import InventoryList from './InventoryList';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
  last_updated: string;
  created_at: string;
}

// Fungsi Fetching Data dari API Route
const getInitialItems = async (): Promise<InventoryItem[]> => {
  // Panggil API Route internal kita untuk mengambil data inventori
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/inventory`, {
      // Menggunakan 'force-cache' atau 'no-store' tergantung kebutuhan.
      // 'no-store' memastikan data selalu baru.
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error('Failed to fetch inventory data on server:', response.statusText);
      // Jika gagal, kembalikan array kosong agar aplikasi tidak crash
      return []; 
    }
    
    return response.json();
  } catch (error) {
    console.error('Network or parsing error during server fetch:', error);
    return [];
  }
};


export default async function Home() {
  // Ambil data awal saat server me-render halaman
  const initialItems = await getInitialItems();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-slate-900 rounded-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Inventory Management
            </h1>
          </div>
          <p className="text-slate-600 text-lg mt-2">
            Manage your inventory items efficiently
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          {/* Total Items akan ditampilkan di dalam InventoryList */}
          <div className="text-sm text-slate-600">
            {/* Placeholder for total items */}
          </div>
          <Link href="/add">
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>
        
        {/* Render komponen client yang menangani interaksi */}
        <InventoryList initialItems={initialItems} /> 

      </div>
      <Toaster />
    </main>
  );
}
