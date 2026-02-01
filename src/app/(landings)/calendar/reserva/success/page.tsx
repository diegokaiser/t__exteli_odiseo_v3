import { LoadingScreen } from '@/components/atoms';
import { Suspense } from 'react';
import SuccessPage from './SuccessClient';

export const dynamic = 'force-dynamic';

export default function Success() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SuccessPage />
    </Suspense>
  );
}
