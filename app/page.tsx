'use client';
import dynamic from 'next/dynamic';

const MealPlanner = dynamic(() => import('@/components/MealPlanner'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <MealPlanner />
    </div>
  );
}