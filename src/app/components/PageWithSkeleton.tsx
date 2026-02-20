import { useState, useEffect, ReactNode } from 'react';

interface PageWithSkeletonProps {
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number; // 최소 스켈레톤 표시 시간 (ms)
}

export function PageWithSkeleton({ skeleton, children, delay = 500 }: PageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 최소 딜레이 후 로딩 완료
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}
