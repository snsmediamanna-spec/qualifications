import { AboutPage } from '../components/AboutPage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { AboutPageSkeleton } from '../components/skeletons';

export function AboutPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<AboutPageSkeleton />}>
      <AboutPage />
    </PageWithSkeleton>
  );
}