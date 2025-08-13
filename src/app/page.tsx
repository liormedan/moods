'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to dashboard
    router.push('/dashboard');
  }, [router]);

  // Show buttons while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          מעביר לדשבורד...
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/dashboard/settings')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            הגדרות
          </Button>
          
          <Button
            onClick={() => router.push('/dashboard/profile')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            פרופיל
          </Button>
        </div>
        
        <p className="text-gray-600">אנא המתן</p>
      </div>
    </div>
  );
}

