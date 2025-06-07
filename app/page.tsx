'use client';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const MealPlanner = dynamic(() => import('@/components/MealPlanner'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
});

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <MealPlanner />
      </div>
    </ErrorBoundary>
  );
}