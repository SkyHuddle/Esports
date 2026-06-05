import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import EsportsHub from './EsportsHub.tsx';

const RingChaseApp = lazy(() =>
  import('./ring-chase/RingChaseApp').then((m) => ({ default: m.RingChaseApp }))
);
const GoldenRoadApp = lazy(() =>
  import('./golden-road/GoldenRoadApp').then((m) => ({ default: m.GoldenRoadApp }))
);

function RouteLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#060608]">
      <p className="text-white/40 text-sm uppercase tracking-widest animate-pulse">Loading…</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<EsportsHub />} />
          <Route path="/ring-chase" element={<RingChaseApp />} />
          <Route path="/ring-chase/*" element={<RingChaseApp />} />
          <Route path="/golden-road" element={<GoldenRoadApp />} />
          <Route path="/golden-road/*" element={<GoldenRoadApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
