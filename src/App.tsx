import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Home from '@/pages/Home';
import Configurator from '@/pages/Configurator';
import Results from '@/pages/Results';
import PlanDetail from '@/pages/PlanDetail';
import Catalog from '@/pages/Catalog';
import Packages from '@/pages/Packages';
import HowItWorks from '@/pages/HowItWorks';
import Partners from '@/pages/Partners';
import PartnerForm from '@/pages/PartnerForm';
import PartnerDirectory from '@/pages/PartnerDirectory';
import PartnerDetail from '@/pages/PartnerDetail';
import NotFound from '@/pages/NotFound';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPartnerInquiries from '@/pages/admin/AdminPartnerInquiries';
import AdminPartnerInquiryDetail from '@/pages/admin/AdminPartnerInquiryDetail';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminPartnerNew from '@/pages/admin/AdminPartnerNew';
import AdminPartnerEditor from '@/pages/admin/AdminPartnerEditor';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminBookingDetail from '@/pages/admin/AdminBookingDetail';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminOffers from '@/pages/admin/AdminOffers';
import AdminExperiences from '@/pages/admin/AdminExperiences';
import AdminPackages from '@/pages/admin/AdminPackages';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/iskustva" element={<Catalog />} />
          <Route path="/paketi" element={<Packages />} />
          <Route path="/kako-funkcionise" element={<HowItWorks />} />
          <Route path="/za-partnere" element={<Partners />} />
          <Route path="/za-partnere/prijava" element={<PartnerForm />} />
          <Route path="/partneri" element={<PartnerDirectory />} />
          <Route path="/partneri/:slug" element={<PartnerDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<Layout showStickyMobileCta={false} />}>
          <Route path="/konfigurator" element={<Configurator />} />
          <Route path="/rezultati" element={<Results />} />
          <Route path="/plan/:planId" element={<PlanDetail />} />
          <Route path="/paketi/:slug" element={<PlanDetail />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="upiti-partnera" element={<AdminPartnerInquiries />} />
          <Route path="upiti-partnera/:id" element={<AdminPartnerInquiryDetail />} />
          <Route path="partneri" element={<AdminPartners />} />
          <Route path="partneri/novi" element={<AdminPartnerNew />} />
          <Route path="partneri/:id" element={<AdminPartnerEditor />} />
          <Route path="ponude" element={<AdminOffers />} />
          <Route path="iskustva" element={<AdminExperiences />} />
          <Route path="paketi" element={<AdminPackages />} />
          <Route path="rezervacije" element={<AdminBookings />} />
          <Route path="rezervacije/:id" element={<AdminBookingDetail />} />
          <Route path="podesavanja" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}
