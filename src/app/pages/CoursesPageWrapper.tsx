import { useOutletContext } from 'react-router';
import { FestivalCoursePage } from '../components/FestivalCoursePage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { CoursesPageSkeleton } from '../components/skeletons';

interface OutletContext {
  isMobile: boolean;
  onEnroll: () => void;
}

export function CoursesPageWrapper() {
  const { isMobile, onEnroll } = useOutletContext<OutletContext>();
  
  return (
    <PageWithSkeleton skeleton={<CoursesPageSkeleton />}>
      <FestivalCoursePage onEnroll={onEnroll} isMobile={isMobile} />
    </PageWithSkeleton>
  );
}
