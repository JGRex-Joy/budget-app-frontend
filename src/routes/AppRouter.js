import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import TabBar from '../components/layout/TabBar/TabBar';

// Pages
import AuthPage from '../pages/Auth/AuthPage';
import HomePage from '../pages/Home/HomePage';
import HistoryPage from '../pages/History/HistoryPage';
import AccountsPage from '../pages/Accounts/AccountsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import CalculatorPage from '../pages/Calculator/CalculatorPage';
import AccountSelectorPage from '../pages/AccountSelector/AccountSelectorPage';
import AddCategoryPage from '../pages/AddCategory/AddCategoryPage';
import AddAccountPage from '../pages/AddAccount/AddAccountPage';

const MainLayout = ({ children }) => (
  <div className="main-layout">
    <div className="main-content">{children}</div>
    <TabBar />
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/accounts"
        element={
          <PrivateRoute>
            <MainLayout>
              <AccountsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/calculator"
        element={
          <PrivateRoute>
            <CalculatorPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/account-selector"
        element={
          <PrivateRoute>
            <AccountSelectorPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/add-category"
        element={
          <PrivateRoute>
            <AddCategoryPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/add-account"
        element={
          <PrivateRoute>
            <AddAccountPage />
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;