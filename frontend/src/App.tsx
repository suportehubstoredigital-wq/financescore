import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "@/layout/Sidebar";
import { Topbar } from "@/layout/Topbar";
import { DashboardPage } from "@/pages/Dashboard";
import { CompaniesPage } from "@/pages/Companies";
import { ScorePage } from "@/pages/Score";
import { UploadPage } from "@/pages/Upload";
import { SettingsPage } from "@/pages/Settings";

function LayoutWithSidebar() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <Topbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWithSidebar />
    </BrowserRouter>
  )
}

export default App
