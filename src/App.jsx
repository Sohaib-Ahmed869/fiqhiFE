// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./Auth/authLayout";
import SignUp from "./Auth/signup";
import Login from "./Auth/login";
import ForgotPassword from "./Auth/ForgotPassword"
import UserLayout from "./layouts/UserLayout";
import NewApplication from "./User/pages/NewApplication";
import FatwaQueries from "./User/pages/FatwaQueries";
import MarriageQueries from "./User/pages/Marriage/marriageQueries";
import MarriageApplicationView from "./User/pages/Marriage/queryView";
import ReconciliationQueries from "./User/pages/Reconciliation/View";
import ReconciliationView from "./User/pages/Reconciliation/Details";
import NotificationsView from "./User/notifications";
import UserSettings from "./User/settings";

import ShaykhLayout from "./Shaykh/components/header";
import ShaykhDashboard from "./Shaykh/pages/overview";
import FatwaQueriesS from "./Shaykh/pages/fatwa-queries";
import ReconciliationQueriesS from "./Shaykh/pages/Reconciliation/queries";
import ReconciliationDetails from "./Shaykh/pages/Reconciliation/details";
import MarriageQueriesS from "./Shaykh/pages/Marriage/page";
import MarriageApplicationViewS from "./Shaykh/pages/Marriage/details";
import ShaykhSchedule from "./Shaykh/pages/schedule";
import NotificationsScreen from "./Shaykh/pages/notifications";
import UserProfile from "./Shaykh/pages/profile";
import ResetPassword from "./Auth/ResetPassword"
import AdminLayout from "./Admin/Layout";
import AddShaykh from "./Admin/pages/AddShaykh";
import FatwaApplications from "./Admin/pages/Fatwa";
import ViewAllShaykhs from "./Admin/pages/ViewAllShaykhs";
import AdminMarriageApplications from "./Admin/pages/MarriageApplications";
import MarriageApplicationDetail from "./Admin/pages/MarriageApplicationDetail";
import CertificatesGenerated from "./Admin/pages/certificatesGenerated";
import AdminReconciliationList from "./Admin/pages/Recon";
import AdminReconciliationDetail from "./Admin/pages/ReconDetails";
import AdminDashboard from "./Admin/pages/Dashboard";

import { AuthProvider } from "./Contexts/AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />

          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route path="" element={<NewApplication />} />
            <Route path="new-application" element={<NewApplication />} />
            <Route path="fatwa-queries" element={<FatwaQueries />} />
            <Route path="marriage-queries" element={<MarriageQueries />} />
            <Route
              path="marriage-queries/:id"
              element={<MarriageApplicationView />}
            />
            <Route
              path="reconciliation-queries"
              element={<ReconciliationQueries />}
            />
            <Route
              path="reconciliation-queries/:id"
              element={<ReconciliationView />}
            />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="settings" element={<UserSettings />} />
            {/* Add other User routes here */}
          </Route>
          <Route path="/shaykh" element={<ShaykhLayout />}>
            <Route path="" element={<ShaykhDashboard />} />
            <Route path="overview" element={<ShaykhDashboard />} />
            <Route path="fatwa-queries" element={<FatwaQueriesS />} />
            <Route
              path="reconciliations"
              element={<ReconciliationQueriesS />}
            />
            <Route
              path="reconciliations/:id"
              element={<ReconciliationDetails />}
            />
            <Route path="marriages" element={<MarriageQueriesS />} />
            <Route
              path="marriages/:id"
              element={<MarriageApplicationViewS />}
            />
            <Route path="schedule" element={<ShaykhSchedule />} />
            <Route path="notifications" element={<NotificationsScreen />} />
            <Route path="profile" element={<UserProfile />} />
            {/* Add Shaykh routes here */}
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="" element={<AdminDashboard />} />
            <Route path="add-shaykh" element={<AddShaykh />} />
            <Route path="fatwa-applications" element={<FatwaApplications />} />
            <Route path="shaykhs" element={<ViewAllShaykhs />} />
            <Route
              path="marriage-applications"
              element={<AdminMarriageApplications />}
            />
            <Route
              path="marriage-applications/:id"
              element={<MarriageApplicationDetail />}
            />
            <Route
              path="certificates-generated"
              element={<CertificatesGenerated />}
            />
            <Route
              path="reconciliation"
              element={<AdminReconciliationList />}
            />
            <Route
              path="reconciliations/:id"
              element={<AdminReconciliationDetail />}
            />

            {/* Add other Admin routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
