import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';
import { Sponsor } from '../types';

interface SponsorFormProps {
  sponsor?: Sponsor;
  onClose: () => void;
}

export function SponsorForm({ sponsor, onClose }: SponsorFormProps) {
  const { addSponsor, updateSponsor } = useApp();
  const [formData, setFormData] = useState({
    naam: sponsor?.naam || '',
    contactpersoon: sponsor?.contactpersoon || '',
    email: sponsor?.email || '',
    telefoon: sponsor?.telefoon || '',
    adres: sponsor?.adres || '',
    beschrijving: sponsor?.beschrijving || '',
    targetBedrag: sponsor?.targetBedrag || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {   
    e.preventDefault();
    
    if (sponsor) {
      updateSponsor(sponsor.id, formData);
    } else {
      addSponsor(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetBedrag' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">
            {sponsor ? 'Sponsor Bewerken' : 'Nieuwe Sponsor'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                name="naam"
                value={formData.naam}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Naam van het bedrijf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contactpersoon
              </label>
              <input
                type="text"
                name="contactpersoon"
                value={formData.contactpersoon}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Naam contactpersoon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="contact@bedrijf.nl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                name="telefoon"
                value={formData.telefoon}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="06-12345678"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Adres
              </label>
              <input
                type="text"
                name="adres"
                value={formData.adres}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Straatnaam 123, Stad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Bedrag (€)
              </label>
              <input
                type="number"
                name="targetBedrag"
                value={formData.targetBedrag}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Beschrijving
              </label>
              <textarea
                name="beschrijving"
                value={formData.beschrijving}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Korte beschrijving van het bedrijf..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-700 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
            >
              {sponsor ? 'Bijwerken' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}