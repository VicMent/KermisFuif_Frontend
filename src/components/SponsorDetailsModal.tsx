import React from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Phone, Mail, Calendar, Euro, Gift } from 'lucide-react';
import { Sponsor } from '../types';

interface SponsorDetailsModalProps {
  sponsor: Sponsor;
  onClose: () => void;
}

export function SponsorDetailsModal({ sponsor, onClose }: SponsorDetailsModalProps) {
  const { toewijzingen, users } = useApp();

  const sponsorToewijzingen = toewijzingen.filter(t => t.sponsorId === sponsor.id);
  const totalEarned = sponsorToewijzingen
    .filter(t => t.status === 'voltooid' && typeof t.werkelijkBedrag === 'number')
    .reduce((sum, t) => sum + (t.werkelijkBedrag ?? t.bedrag ?? 0), 0);

  // Verzamel unieke bundlenamen uit alle toewijzingen
  const allBundles = sponsorToewijzingen
    .flatMap(t => Array.isArray(t.bundleTypes) ? t.bundleTypes : [])
    .filter(Boolean);
  const uniqueBundles = Array.from(new Set(allBundles));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Sponsor Details</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{sponsor.naam}</h4>
                <p className="text-slate-400">{sponsor.beschrijving}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <Mail className="h-4 w-4 mr-3 text-emerald-400" />
                  <div>
                    <div className="font-medium">{sponsor.contactpersoon}</div>
                    <div className="text-sm text-slate-400">{sponsor.email}</div>
                  </div>
                </div>

                {sponsor.telefoon && (
                  <div className="flex items-center text-slate-300">
                    <Phone className="h-4 w-4 mr-3 text-emerald-400" />
                    <span>{sponsor.telefoon}</span>
                  </div>
                )}

                {sponsor.adres && (
                  <div className="flex items-center text-slate-300">
                    <MapPin className="h-4 w-4 mr-3 text-emerald-400" />
                    <span>{sponsor.adres}</span>
                  </div>
                )}

                <div className="flex items-center text-slate-300">
                  <Calendar className="h-4 w-4 mr-3 text-emerald-400" />
                  <span>Toegevoegd op {sponsor.aangemaakt.toLocaleDateString('nl-NL')}</span>
                </div>

                <div className="flex items-center text-slate-300">
                  <Euro className="h-4 w-4 mr-3 text-emerald-400" />
                  <span>Target bedrag: €{sponsor.targetBedrag}</span>
                </div>

                {/* Bundles overzicht */}
                {uniqueBundles.length > 0 && (
                  <div className="flex items-center text-slate-300 mt-2 flex-wrap">
                    <Gift className="h-4 w-4 mr-2 text-emerald-400" />
                    <span className="font-medium mr-2">Bundles:</span>
                    {uniqueBundles.map(bundle => (
                      <span
                        key={bundle}
                        className="bg-emerald-700/30 text-emerald-300 px-2 py-1 rounded-full text-xs mr-2 mb-1"
                      >
                        {bundle}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Statistics and Assignments */}
            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-white mb-4">Statistieken</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{sponsorToewijzingen.length}</div>
                    <div className="text-sm text-slate-400">Toegewezen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {sponsorToewijzingen.filter(t => t.status === 'voltooid').length}
                    </div>
                    <div className="text-sm text-slate-400">Voltooid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">€{totalEarned}</div>
                    <div className="text-sm text-slate-400">Verworven</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {sponsor.targetBedrag > 0
                        ? Math.round((totalEarned / sponsor.targetBedrag) * 100)
                        : 0
                      }%
                    </div>
                    <div className="text-sm text-slate-400">Van target</div>
                  </div>
                </div>
              </div>

              {sponsorToewijzingen.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-white mb-4">Toewijzingen</h5>
                  <div className="space-y-3">
                    {sponsorToewijzingen.map((toewijzing) => {
                      const user = users.find(u => u.id === toewijzing.gebruikerId);
                      return (
                        <div key={toewijzing.id} className="bg-slate-700 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-white font-medium">{user?.naam} <span className="text-slate-400 text-xs">({user?.username})</span></span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              toewijzing.status === 'voltooid' 
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : toewijzing.status === 'bezig'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {toewijzing.status.charAt(0).toUpperCase() + toewijzing.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            Toegewezen: {toewijzing.toegewezenOp.toLocaleDateString('nl-NL')}
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="text-emerald-400">
                              Gesponsord: €{toewijzing.bedrag}
                            </span>
                            {typeof toewijzing.werkelijkBedrag === 'number' && (
                              <span className="text-emerald-400">
                                Werkelijk: €{toewijzing.werkelijkBedrag}
                              </span>
                            )}
                            <div className='flex gap-2 text-slate-400'>
                              <span className='text-white'>Logo: {toewijzing.logoKlaar ? '✅' : '❌'}</span>
                              <span className='text-white'>Contant: {toewijzing.contantKlaar ? '✅' : '❌'}</span>
                              <span className='text-white'>Vrijkaarten: {toewijzing.vrijkaartenKlaar ? '✅' : '❌'}</span>
                            </div>
                            {/* Bundles per toewijzing */}
                            {Array.isArray(toewijzing.bundleTypes) && toewijzing.bundleTypes.length > 0 && (
                              <div className="flex gap-1 flex-wrap items-center">
                                <Gift className="h-4 w-4 text-emerald-400" />
                                {toewijzing.bundleTypes.map(bundle => (
                                  <span
                                    key={bundle}
                                    className="bg-emerald-700/30 text-emerald-300 px-2 py-1 rounded-full text-xs mr-1"
                                  >
                                    {bundle}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {toewijzing.opmerkingen && (
                            <div className="text-slate-400 mt-2 italic">
                              "{toewijzing.opmerkingen}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}