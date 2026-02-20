import { ReviewsPage } from '../components/ReviewsPage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { ReviewsPageSkeleton } from '../components/skeletons';

export function ReviewsPageWrapper() {
  return (
    <PageWithSkeleton skeleton={<ReviewsPageSkeleton />}>
      <ReviewsPage />
    </PageWithSkeleton>
  );
}