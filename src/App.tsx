import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { CalendarPage } from './pages/CalendarPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { AssistantPage } from './pages/AssistantPage';
import { FundingInsightsPage } from './pages/FundingInsightsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="documents" element={<DocumentVaultPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="insights" element={<FundingInsightsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
