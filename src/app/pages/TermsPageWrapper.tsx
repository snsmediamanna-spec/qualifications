import { TermsOfService } from '../components/TermsOfService';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { TermsOfServiceSkeleton } from '../components/skeletons';

export function TermsPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<TermsOfServiceSkeleton />}>
      <TermsOfService />
    </PageWithSkeleton>
  );
}
