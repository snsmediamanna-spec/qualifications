import { SupportPage } from '../components/SupportPage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { SupportPageSkeleton } from '../components/skeletons';

export function SupportPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<SupportPageSkeleton />}>
      <SupportPage />
    </PageWithSkeleton>
  );
}