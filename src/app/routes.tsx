import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { PageSkeleton } from "./components/skeletons/PageSkeleton";

// ✅ 코드 스플리팅: 모든 페이지를 lazy load
const CoursesPageWrapper = lazy(() => import("./pages/CoursesPageWrapper").then(m => ({ default: m.CoursesPageWrapper })));
const CurriculumPageWrapper = lazy(() => import("./pages/CurriculumPageWrapper").then(m => ({ default: m.CurriculumPageWrapper })));
const CertificatePageWrapper = lazy(() => import("./pages/CertificatePageWrapper").then(m => ({ default: m.CertificatePageWrapper })));
const ReviewsPageWrapper = lazy(() => import("./pages/ReviewsPageWrapper").then(m => ({ default: m.ReviewsPageWrapper })));
const MyClassroomWrapper = lazy(() => import("./pages/MyClassroomWrapper").then(m => ({ default: m.MyClassroomWrapper })));
const NoticePageWrapper = lazy(() => import("./pages/NoticePageWrapper").then(m => ({ default: m.NoticePageWrapper })));
const SupportPageWrapper = lazy(() => import("./pages/SupportPageWrapper").then(m => ({ default: m.SupportPageWrapper })));
const AboutPageWrapper = lazy(() => import("./pages/AboutPageWrapper").then(m => ({ default: m.AboutPageWrapper })));
const AboutCompanyWrapper = lazy(() => import("./pages/AboutCompanyWrapper").then(m => ({ default: m.AboutCompanyWrapper })));
const PaymentPageWrapper = lazy(() => import("./pages/PaymentPageWrapper").then(m => ({ default: m.PaymentPageWrapper })));
const ProfilePageWrapper = lazy(() => import("./pages/ProfilePageWrapper").then(m => ({ default: m.ProfilePageWrapper })));
const AdminPageWrapper = lazy(() => import("./pages/AdminPageWrapper").then(m => ({ default: m.AdminPageWrapper })));
const TermsPageWrapper = lazy(() => import("./pages/TermsPageWrapper").then(m => ({ default: m.TermsPageWrapper })));
const PrivacyPageWrapper = lazy(() => import("./pages/PrivacyPageWrapper").then(m => ({ default: m.PrivacyPageWrapper })));
const ExamPageWrapper = lazy(() => import("./pages/ExamPageWrapper").then(m => ({ default: m.ExamPageWrapper })));
const ExamResultsPageWrapper = lazy(() => import("./pages/ExamResultsPageWrapper").then(m => ({ default: m.ExamResultsPageWrapper })));
const BlockedPage = lazy(() => import("./pages/BlockedPage").then(m => ({ default: m.BlockedPage })));
const LoginPageWrapper = lazy(() => import("./pages/LoginPageWrapper").then(m => ({ default: m.LoginPageWrapper })));
const SignupPageWrapper = lazy(() => import("./pages/SignupPageWrapper").then(m => ({ default: m.SignupPageWrapper })));

// ✅ Suspense wrapper 컴포넌트
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/blocked",
    element: <SuspenseWrapper><BlockedPage /></SuspenseWrapper>
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "login",
        element: <SuspenseWrapper><LoginPageWrapper /></SuspenseWrapper>
      },
      {
        path: "signup",
        element: <SuspenseWrapper><SignupPageWrapper /></SuspenseWrapper>
      },
      {
        index: true,
        Component: HomePage // 홈페이지는 즉시 로드
      },
      {
        path: "about",
        element: <SuspenseWrapper><AboutPageWrapper /></SuspenseWrapper>
      },
      {
        path: "about-company",
        element: <SuspenseWrapper><AboutCompanyWrapper /></SuspenseWrapper>
      },
      {
        path: "curriculum",
        element: <SuspenseWrapper><CurriculumPageWrapper /></SuspenseWrapper>
      },
      {
        path: "courses",
        element: <SuspenseWrapper><CoursesPageWrapper /></SuspenseWrapper>
      },
      {
        path: "certificate",
        element: <SuspenseWrapper><CertificatePageWrapper /></SuspenseWrapper>
      },
      {
        path: "reviews",
        element: <SuspenseWrapper><ReviewsPageWrapper /></SuspenseWrapper>
      },
      {
        path: "notice",
        element: <SuspenseWrapper><NoticePageWrapper /></SuspenseWrapper>
      },
      {
        path: "support",
        element: <SuspenseWrapper><SupportPageWrapper /></SuspenseWrapper>
      },
      {
        path: "payment",
        element: <SuspenseWrapper><PaymentPageWrapper /></SuspenseWrapper>
      },
      {
        path: "terms",
        element: <SuspenseWrapper><TermsPageWrapper /></SuspenseWrapper>
      },
      {
        path: "privacy",
        element: <SuspenseWrapper><PrivacyPageWrapper /></SuspenseWrapper>
      },
      {
        path: "admin",
        element: <SuspenseWrapper><AdminPageWrapper /></SuspenseWrapper>
      },
      {
        path: "my-classroom",
        element: <SuspenseWrapper><MyClassroomWrapper /></SuspenseWrapper>
      },
      {
        path: "profile",
        element: <SuspenseWrapper><ProfilePageWrapper /></SuspenseWrapper>
      },
      {
        path: "exam",
        element: <SuspenseWrapper><ExamPageWrapper /></SuspenseWrapper>
      },
      {
        path: "exam-results",
        element: <SuspenseWrapper><ExamResultsPageWrapper /></SuspenseWrapper>
      },
      {
        path: "*",
        Component: HomePage
      }
    ]
  }
]);