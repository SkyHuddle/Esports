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
const MajorRunApp = lazy(() =>
  import('./major-run/MajorRunApp').then((m) => ({ default: m.MajorRunApp }))
);
const ChampionsRunApp = lazy(() =>
  import('./champions-run/ChampionsRunApp').then((m) => ({ default: m.ChampionsRunApp }))
);

function RouteLoader() {
  return (
    <div className="kb-root min-h-[100dvh] flex flex-col items-center justify-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full kb-live-dot" style={{ background: 'var(--kb-gold)' }} />
      <p className="kb-label text-kb-faint">Loading</p>
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
          <Route path="/major-run" element={<MajorRunApp />} />
          <Route path="/major-run/*" element={<MajorRunApp />} />
          <Route path="/champions-run" element={<ChampionsRunApp />} />
          <Route path="/champions-run/*" element={<ChampionsRunApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
