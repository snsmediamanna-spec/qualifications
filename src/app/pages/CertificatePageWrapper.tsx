import { CertificatePage } from '../components/CertificatePage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { CertificatePageSkeleton } from '../components/skeletons';

export function CertificatePageWrapper() {
  return (
    <PageWithSkeleton skeleton={<CertificatePageSkeleton />}>
      <CertificatePage />
    </PageWithSkeleton>
  );
}