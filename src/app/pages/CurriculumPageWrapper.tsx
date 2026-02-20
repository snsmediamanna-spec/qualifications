import { CurriculumPage } from '../components/CurriculumPage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { CurriculumPageSkeleton } from '../components/skeletons';

export function CurriculumPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<CurriculumPageSkeleton />}>
      <CurriculumPage />
    </PageWithSkeleton>
  );
}