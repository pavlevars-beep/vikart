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
import NotFound from '@/pages/NotFound';

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
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<Layout showStickyMobileCta={false} />}>
          <Route path="/konfigurator" element={<Configurator />} />
          <Route path="/rezultati" element={<Results />} />
          <Route path="/plan/:planId" element={<PlanDetail />} />
          <Route path="/paketi/:slug" element={<PlanDetail />} />
        </Route>
      </Routes>
    </>
  );
}
