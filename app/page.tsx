'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '@/lib/api';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import PatientTable from '@/components/patients/PatientTable';
import AddPatientModal from '@/components/patients/AddPatientModal';

type TabType = 'all' | 'called' | 'never-called' | 'opd' | 'discharged';

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [token, setToken] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // ✅ Fetch patients using React Query
  // ✅ Fetch patients using React Query
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['patients', token],
  queryFn: async () => {
    if (!token) throw new Error('No authentication token');

    try {
      const response = await getPatients(token);
      console.log('✅ Patients loaded:', response);
      return response; // ✅ <-- FIXED
    } catch (err: any) {
      console.error('❌ Patient fetch failed:', err);
      toast.error('Failed to fetch patients');
      throw err;
    }
  },
  enabled: !!token,
  retry: false,
});

  const patients = data || [];

  // ✅ Filter patients based on tab
  const filteredPatients = patients.filter((p: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'called') return p.call_count > 0;
    if (activeTab === 'never-called') return p.call_count === 0;
    if (activeTab === 'discharged') return p.category === 'discharged';
    if (activeTab === 'opd') return p.category === 'opd';
    return true;
  });

  // ✅ Count for each tab
  const counts = {
    all: patients.length,
    opd: patients.filter((p: any) => p.category === 'opd').length,
    discharged: patients.filter((p: any) => p.category === 'discharged').length,
    called: patients.filter((p: any) => p.call_count > 0).length,
    neverCalled: patients.filter((p: any) => p.call_count === 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hospital Voice Agent Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              AI-powered patient follow-up system
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
          >
            Go to Account
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ✅ Add Patient Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Patients</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { key: 'all', label: 'All Patients', count: counts.all },
                { key: 'opd', label: 'OPD Patients', count: counts.opd },
                { key: 'discharged', label: 'Discharged Patients', count: counts.discharged },
                { key: 'called', label: 'Called Patients', count: counts.called },
                { key: 'never-called', label: 'Never Called', count: counts.neverCalled },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Patient Table or States */}
        <div className="bg-white shadow rounded-lg">
          {!token ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-600">Not authenticated. Please login.</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Loading patients...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">Error loading patients</p>
              <p className="text-sm text-gray-500 mb-4">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No patients found in this category</p>
              {activeTab !== 'all' ? (
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  View All Patients
                </button>
              ) : (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Your First Patient
                </button>
              )}
            </div>
          ) : (
            <PatientTable
              patients={filteredPatients}
              onRefresh={() => refetch()}
              token={token}
            />
          )}
        </div>
      </main>

      {/* ✅ Add Patient Modal */}
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
