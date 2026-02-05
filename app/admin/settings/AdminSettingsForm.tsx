'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { FareSettings } from '@/lib/fareCalculation';

interface AdminFareSettings extends FareSettings {
  id: number;
}

export default function AdminSettingsForm() {
  const [settings, setSettings] = useState<AdminFareSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof AdminFareSettings, value: number) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-turquoise-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fare Settings</h1>
          <p className="text-gray-600 mt-2">
            Adjust your pricing. Changes apply immediately to the website.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Ride Pricing */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🚗 Ride Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Base Fare ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.rideStandardBase || 0}
                  onChange={(e) => updateSetting('rideStandardBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private driver base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.ridePremiumBase || 0}
                  onChange={(e) => updateSetting('ridePremiumBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Distance (miles)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={settings?.freeDistance || 0}
                  onChange={(e) => updateSetting('freeDistance', parseFloat(e.target.value))}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Miles included in the base fare
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Mile Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.perMileRate || 0}
                  onChange={(e) => updateSetting('perMileRate', parseFloat(e.target.value))}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Charged per mile after free distance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Passenger Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.passengerFee || 0}
                  onChange={(e) => updateSetting('passengerFee', parseFloat(e.target.value))}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Per additional passenger (first is free)
                </p>
              </div>
            </div>
          </div>

          {/* Other Services */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📦 Other Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courier / Delivery Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.courierBase || 0}
                  onChange={(e) => updateSetting('courierBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Errand Services Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.errandBase || 0}
                  onChange={(e) => updateSetting('errandBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Shopping Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.shoppingBase || 0}
                  onChange={(e) => updateSetting('shoppingBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport of Goods Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings?.transportBase || 0}
                  onChange={(e) => updateSetting('transportBase', parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link 
              href="/admin"
              className="btn-outline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
