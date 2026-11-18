import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AlternativasPage } from './pages/AlternativasPage';
import { HistorialPage } from './pages/HistorialPage';
import { HomePage } from './pages/HomePage';
import { RecetasPage } from './pages/RecetasPage';

export function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alternativas" element={<AlternativasPage />} />
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="/recetas" element={<RecetasPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
