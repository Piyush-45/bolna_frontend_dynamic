'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createPatient } from '@/lib/api';
import QuestionsEditor from '../QuestionsEditor';


interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPatientModal({ isOpen, onClose, onSuccess }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    category: 'opd', // matches backend field
  });

  const [questions, setQuestions] = useState<string[]>([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated. Please login.");
      return;
    }

    // ✅ Validation
    if (!formData.name || !formData.phone) {
      toast.error("Name and phone are required.");
      return;
    }

    if (!/^\+91\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be in +91XXXXXXXXXX format.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Build the payload exactly how backend expects it
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        age: formData.age ? String(formData.age) : null, // backend expects string or null
        gender: formData.gender || null,
        category: formData.category || "opd", // backend field name
        custom_questions: questions.filter((q) => q.trim() !== ""),
      };

      console.log("📤 Sending patient payload:", payload);

      // ✅ Make API call
      const res = await createPatient(token, payload);
      console.log("✅ Created patient:", res);

      toast.success("✅ Patient added successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("❌ Error creating patient:", err.response?.data || err);
      toast.error(err.response?.data?.detail || "Error adding patient");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Add New Patient</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+919876543210"
              />
              <p className="text-xs text-gray-500 mt-1">Use +91XXXXXXXXXX format</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Type</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="opd">OPD</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            {/* Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Questions (optional)
              </label>
              <button
                type="button"
                onClick={() => setShowQuestionEditor(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
              >
                {questions.length > 0
                  ? `${questions.length} questions configured`
                  : 'Click to add custom questions'}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Question Editor */}
      {showQuestionEditor && (
        <QuestionsEditor
          patientId={0}
          patientName={formData.name || 'New Patient'}
          currentQuestions={questions}
          onSave={(newQuestions) => {
            setQuestions(newQuestions);
            setShowQuestionEditor(false);
          }}
          onClose={() => setShowQuestionEditor(false)}
        />
      )}
    </>
  );
}
