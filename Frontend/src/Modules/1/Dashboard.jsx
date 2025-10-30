import React, { useState } from "react";
import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Search,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
} from "lucide-react";
import DashboardContent from "./Content/DashboardContent";
import SettingsContent from "./Content/SettingsContent";
import NotificationsContent from "./Content/NotificationsContent";
import DocumentsContent from "./Content/DocumentsContent";
import UsersContent from "./Content/UsersContent";
import AnalyticsContent from "./Content/AnalyticsContent";
import SignIn from "../Auth/SignIn";
import PaymentContent from "./Content/PaymentContent";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "payment", label: "payment", icon: Settings },
    { id: "login", label: "Login", icon: ShieldCheck },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "analytics":
        return <AnalyticsContent />;
      case "users":
        return <UsersContent />;
      case "documents":
        return <DocumentsContent />;
      case "notifications":
        return <NotificationsContent />;
      case "settings":
        return <SettingsContent />;
      case "payment":
        return <PaymentContent />;
      case "login":
        return <SignIn />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-[#0e1726] to-[#0e1726] text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ borderColor: "#0e1726" }}
        >
          {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#0e1726] transition-colors"
          >
            {sidebarOpen ? (
              <ChevronsLeft size={24} />
            ) : (
              <ChevronsRight size={24} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                      activeMenu === item.id
                        ? "bg-[#805dca] shadow-lg"
                        : "hover:bg-[#1b2e4b]"
                    }`}
                  >
                    <Icon size={24} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#805dca]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#805dca] flex items-center justify-center font-bold">
              U
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-sm">User Name</p>
                <p className="text-xs text-[#4361ee]">user@email.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="hidden sm:block text-2xl font-bold text-gray-800 capitalize">
              {activeMenu}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
