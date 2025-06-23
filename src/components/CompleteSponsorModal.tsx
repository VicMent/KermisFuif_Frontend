import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle } from 'lucide-react';

interface CompleteSponsorModalProps {
  toewijzingId: string;
  onClose: () => void;
}

export function CompleteSponsorModal({ toewijzingId, onClose }: CompleteSponsorModalProps) {
  const { completeSponsor, updateToewijzing, toewijzingen, sponsors, bundles } = useApp();
  const toewijzing = toewijzingen.find(t => t.id === toewijzingId);
  const sponsor = sponsors.find(s => s.id === toewijzing?.sponsorId);

  const [formData, setFormData] = useState({
    bedrag: toewijzing?.bedrag ?? 0,
    werkelijkBedrag: toewijzing?.werkelijkBedrag ?? 0,
    bundleTypes: toewijzing?.bundleTypes ?? [],
    logoKlaar: toewijzing?.logoKlaar ?? false,
    contantKlaar: toewijzing?.contantKlaar ?? false,
    vrijkaartenKlaar: toewijzing?.vrijkaartenKlaar ?? false,
    opmerkingen: toewijzing?.opmerkingen ?? '',
  });

  if (!toewijzing || !sponsor) return null;

  const isStarting = toewijzing.status === 'toegewezen';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isStarting) {
      updateToewijzing(toewijzingId, { status: 'bezig' });
      onClose();
    } else {
      completeSponsor(toewijzingId, {
        bedrag: formData.bedrag,
        bundleTypes: formData.bundleTypes,
        logoKlaar: formData.logoKlaar,
        contantKlaar: formData.contantKlaar,
        vrijkaartenKlaar: formData.vrijkaartenKlaar,
        opmerkingen: formData.opmerkingen,
        voltooideOp: new Date(),
        werkelijkBedrag: formData.werkelijkBedrag,
      } as any); // voeg werkelijkBedrag toe aan je context indien nodig
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'bedrag' || name === 'werkelijkBedrag'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleBundleChange = (bundleName: string) => {
    setFormData(prev => {
      const exists = prev.bundleTypes.includes(bundleName);
      return {
        ...prev,
        bundleTypes: exists
          ? prev.bundleTypes.filter(b => b !== bundleName)
          : [...prev.bundleTypes, bundleName],
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">
            {isStarting ? 'Start met Sponsor' : 'Sponsor Voltooien'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">{sponsor.naam}</h4>
            {sponsor.targetBedrag > 0 && (
              <p className="text-slate-400 text-sm">Target bedrag: €{sponsor.targetBedrag}</p>
            )}
          </div>

          {isStarting ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-6">
                Klik op "Starten" om te beginnen met deze sponsor. Je kunt later de details invullen.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-700 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                >
                  Starten
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Gesponsord bedrag (€) *
                  </label>
                  <input
                    type="number"
                    name="bedrag"
                    value={formData.bedrag}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Werkelijk ontvangen bedrag (€)
                  </label>
                  <input
                    type="number"
                    name="werkelijkBedrag"
                    value={formData.werkelijkBedrag}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bundles *
                  </label>
                  <div className="flex flex-col gap-2">
                    {bundles.map((bundle) => (
                      <label key={bundle.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.bundleTypes.includes(bundle.naam)}
                          onChange={() => handleBundleChange(bundle.naam)}
                          className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-white">{bundle.naam}</span>
                        {bundle.prijs > 0 && (
                          <span className="text-emerald-400 text-xs">€{bundle.prijs}</span>
                        )}
                        {bundle.beschrijving && (
                          <span className="text-slate-400 text-xs">{bundle.beschrijving}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="logoKlaar"
                      checked={formData.logoKlaar}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-slate-300">Logo is klaar</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="contantKlaar"
                      checked={formData.contantKlaar}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-slate-300">Contant ontvangen</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vrijkaartenKlaar"
                      checked={formData.vrijkaartenKlaar}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-slate-300">Vrijkaarten geregeld</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Opmerkingen
                  </label>
                  <textarea
                    name="opmerkingen"
                    value={formData.opmerkingen}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Eventuele opmerkingen over de samenwerking..."
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
                  Voltooien
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}