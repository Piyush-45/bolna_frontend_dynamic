"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/lib/api";
import { Loader2, Plus, User, Settings, LogOut, Search } from "lucide-react";
import { toast } from "sonner";

import PatientTable from "@/components/patients/PatientTable";
import AddPatientModal from "@/components/patients/AddPatientModal";

type TabType = "all" | "called" | "never-called" | "opd" | "discharged";

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [token, setToken] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["patients", token],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");

      try {
        const response = await getPatients(token);
        console.log("✅ Patients loaded:", response);
        return response;
      } catch (err: any) {
        console.error("❌ Patient fetch failed:", err);
        toast.error("Failed to fetch patients");
        throw err;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const patients = data || [];

  // Filter patients based on tab and search
  const filteredPatients = patients.filter((p: any) => {
    const matchesSearch = searchQuery
      ? p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
      : true;

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "called") return p.call_count > 0;
    if (activeTab === "never-called") return p.call_count === 0;
    if (activeTab === "discharged") return p.category === "discharged";
    if (activeTab === "opd") return p.category === "opd";
    return true;
  });

  const counts = {
    all: patients.length,
    opd: patients.filter((p: any) => p.category === "opd").length,
    discharged: patients.filter((p: any) => p.category === "discharged").length,
    called: patients.filter((p: any) => p.call_count > 0).length,
    neverCalled: patients.filter((p: any) => p.call_count === 0).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Professional Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Patient Management
                </h1>
                <p className="text-xs text-slate-500">
                  AI Voice Agent Dashboard
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => (window.location.href = "/settings")}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Patients"
            value={counts.all}
            change="+12%"
            changeType="positive"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="OPD"
            value={counts.opd}
            gradient="from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="Discharged"
            value={counts.discharged}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Called"
            value={counts.called}
            gradient="from-amber-500 to-amber-600"
          />
          <StatCard
            title="Never Called"
            value={counts.neverCalled}
            gradient="from-rose-500 to-rose-600"
          />
        </div> */}

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Add Patient Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Tabs with Modern Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 mb-6">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Patient Records
              </h2>
              <span className="text-sm text-slate-500">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1 ? "patient" : "patients"}
              </span>
            </div>

            <nav className="flex space-x-1 bg-slate-50 p-1 rounded-xl">
              {[
                { key: "all", label: "All", count: counts.all },
                { key: "opd", label: "OPD", count: counts.opd },
                {
                  key: "discharged",
                  label: "Discharged",
                  count: counts.discharged,
                },
                { key: "called", label: "Called", count: counts.called },
                {
                  key: "never-called",
                  label: "Never Called",
                  count: counts.neverCalled,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.key
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-200/50 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {!token ? (
              <EmptyState
                icon={User}
                title="Authentication Required"
                description="Please login to view patient records"
                action={{
                  label: "Go to Login",
                  onClick: () => (window.location.href = "/login"),
                }}
              />
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-600 text-sm">Loading patients...</p>
              </div>
            ) : error ? (
              <EmptyState
                icon={LogOut}
                title="Error Loading Patients"
                description={
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred"
                }
                action={{
                  label: "Retry",
                  onClick: () => refetch(),
                }}
              />
            ) : filteredPatients.length === 0 ? (
              <EmptyState
                icon={User}
                title={
                  searchQuery ? "No matching patients" : "No patients found"
                }
                description={
                  searchQuery
                    ? "Try adjusting your search terms"
                    : activeTab !== "all"
                    ? "No patients in this category yet"
                    : "Get started by adding your first patient"
                }
                action={
                  searchQuery
                    ? {
                        label: "Clear Search",
                        onClick: () => setSearchQuery(""),
                      }
                    : activeTab !== "all"
                    ? {
                        label: "View All Patients",
                        onClick: () => setActiveTab("all"),
                      }
                    : {
                        label: "Add First Patient",
                        onClick: () => setShowAddModal(true),
                      }
                }
              />
            ) : (
              <PatientTable
                patients={filteredPatients}
                onRefresh={() => refetch()}
                token={token}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add Patient Modal */}
      {showAddModal && (
        <AddPatientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  changeType,
  gradient,
}: {
  title: string;
  value: number;
  change?: string;
  changeType?: "positive" | "negative";
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`} />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {change && (
          <span
            className={`text-xs font-medium ${
              changeType === "positive" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>
      <button
        onClick={action.onClick}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/30"
      >
        {action.label}
      </button>
    </div>
  );
}
