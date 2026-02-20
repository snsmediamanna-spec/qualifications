import { AboutCompany } from '../components/AboutCompany';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { AboutCompanySkeleton } from '../components/skeletons';

export function AboutCompanyWrapper() {
  return (
    <PageWithSkeleton skeleton={<AboutCompanySkeleton />}>
      <AboutCompany />
    </PageWithSkeleton>
  );
}
