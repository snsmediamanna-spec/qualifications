import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { PrivacyPolicySkeleton } from '../components/skeletons';

export function PrivacyPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<PrivacyPolicySkeleton />}>
      <PrivacyPolicy />
    </PageWithSkeleton>
  );
}
