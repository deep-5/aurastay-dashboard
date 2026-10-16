import React from 'react';
import { useHotel } from './context/HotelContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardHome } from './views/DashboardHome';
import { InboxView } from './views/InboxView';
import { CalendarView } from './views/CalendarView';
import { CampaignsView } from './views/CampaignsView';
import { ReservationsView } from './views/ReservationsView';
import { RoomsView } from './views/RoomsView';
import { HousekeepingView } from './views/HousekeepingView';
import { InventoryView } from './views/InventoryView';
import { FinanceView } from './views/FinanceView';
import { InvoicesView } from './views/InvoicesView';
import { ReviewsView } from './views/ReviewsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { AccessRestrictedView } from './views/AccessRestrictedView';
import { isTabAllowedForRole } from './utils/rbac';

export const App: React.FC = () => {
  const { activeTab, sidebarCollapsed, currentUser } = useHotel();

  const renderActiveView = () => {
    // RBAC Security Check: If current user role doesn't have access to this tab
    if (!isTabAllowedForRole(currentUser.role, activeTab)) {
      return <AccessRestrictedView tabId={activeTab} role={currentUser.role} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'inbox':
        return <InboxView />;
      case 'calendar':
        return <CalendarView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'reservations':
        return <ReservationsView />;
      case 'rooms':
        return <RoomsView />;
      case 'housekeeping':
        return <HousekeepingView />;
      case 'inventory':
        return <InventoryView />;
      case 'finance':
        return <FinanceView />;
      case 'invoices':
        return <InvoicesView />;
      case 'reviews':
        return <ReviewsView />;
      case 'reports':
        return <ReportsView />;
      case 'auth':
        return <AuthView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#202938] flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
