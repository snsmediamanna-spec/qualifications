import { useOutletContext, useNavigate } from 'react-router';
import { PaymentPage } from '../components/PaymentPage';
import { PageWithSkeleton } from '../components/PageWithSkeleton';
import { PaymentPageSkeleton } from '../components/skeletons';

interface OutletContext {
  isMobile: boolean;
  selectedCourseId?: number;
}

export function PaymentPageWrapper() {
  const { isMobile, selectedCourseId } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  return (
    <PageWithSkeleton skeleton={<PaymentPageSkeleton />}>
      <PaymentPage 
        courseId={selectedCourseId} 
        onBack={() => navigate('/')} 
        isMobile={isMobile} 
      />
    </PageWithSkeleton>
  );
}