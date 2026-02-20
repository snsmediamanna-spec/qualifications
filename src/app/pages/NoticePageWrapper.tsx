import { useOutletContext } from 'react-router';
import { NoticePage } from '../components/NoticePage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { NoticePageSkeleton } from '../components/skeletons';

interface OutletContext {
  isMobile: boolean;
  isAdmin: boolean;
  allNotices: any[];
  noticesLoaded: boolean;
  onNavigate: (page: string) => void;
}

export function NoticePageWrapper() {
  const { isMobile, isAdmin, allNotices, noticesLoaded, onNavigate } = useOutletContext<OutletContext>();
  
  return (
    <PageWithSkeleton skeleton={<NoticePageSkeleton />}>
      <NoticePage 
        onNavigate={onNavigate} 
        isAdmin={isAdmin} 
        isMobile={isMobile} 
        allNotices={allNotices} 
        noticesLoaded={noticesLoaded} 
      />
    </PageWithSkeleton>
  );
}
