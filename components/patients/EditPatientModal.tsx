'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QuestionsEditor from '../QuestionsEditor';


interface Patient {
  id: string;
  name: string;
  phone: string;
  age?: string | null;
  gender?: string | null;
  category?: string | null;
  custom_questions?: string[];
}

interface EditPatientModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPatientModal({
  patient,
  isOpen,
  onClose,
  onSuccess,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    category: 'opd',
  });

  const [questions, setQuestions] = useState<string[]>([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🧠 Load patient data into modal
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        age: patient.age || '',
        gender: patient.gender || '',
        category: patient.category || 'opd',
      });
      setQuestions(patient.custom_questions || []);
    }
  }, [patient]);

  if (!isOpen) return null;

  // 🧩 Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Not authenticated. Please login.');
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required');
      return;
    }

    if (!/^\+91\d{10}$/.test(formData.phone)) {
      toast.error('Phone must be in format +91XXXXXXXXXX');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        age: formData.age || null,
        gender: formData.gender || null,
        category: formData.category,
        custom_questions: questions.filter((q) => q.trim() !== ''),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/patients/${patient.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to update patient');
      }

      toast.success('✅ Patient updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error updating patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Edit Patient</h3>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="+919876543210"
              />
              <p className="text-xs text-gray-500 mt-1">Use +91XXXXXXXXXX format</p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Type</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Question Editor */}
      {showQuestionEditor && (
        <QuestionsEditor
          patientId={patient.id}
          patientName={formData.name}
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
