import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { CompleteSponsorModal } from './CompleteSponsorModal';
import { SponsorDetailsModal } from './SponsorDetailsModal';

export function UserDashboard() {
  const { currentUser, sponsors, toewijzingen } = useApp();
  const [completingToewijzing, setCompletingToewijzing] = useState<string | null>(null);
  const [viewingSponsor, setViewingSponsor] = useState<string | null>(null);

  const myToewijzingen = toewijzingen.filter(t => t.gebruikerId === currentUser?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'voltooid':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'bezig':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'voltooid':
        return 'Voltooid';
      case 'bezig':
        return 'Bezig';
      case 'toegewezen':
        return 'Toegewezen';
      default:
        return 'Onbekend';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'voltooid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'bezig':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'toegewezen':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Mijn Sponsors</h2>

      {myToewijzingen.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Geen sponsors toegewezen</h3>
          <p className="text-slate-400">Er zijn nog geen sponsors aan jou toegewezen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myToewijzingen.map((toewijzing) => {
            const sponsor = sponsors.find(s => s.id === toewijzing.sponsorId);
            if (!sponsor) return null;

            return (
              <div key={toewijzing.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-emerald-500 transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{sponsor.naam}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewingSponsor(sponsor.id)}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(toewijzing.status)}`}>
                      {getStatusIcon(toewijzing.status)}
                      <span className="ml-1">{getStatusText(toewijzing.status)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Target bedrag:</span>
                    <span className="text-emerald-400 font-medium">€{sponsor.targetBedrag}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Toegewezen op:</span>
                    <span className="text-slate-300">{toewijzing.toegewezenOp.toLocaleDateString('nl-NL')}</span>
                  </div>

                  {toewijzing.voltooideDetails && (
                    <div className="pt-3 border-t border-slate-700 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Gesponsord:</span>
                        <span className="text-emerald-400 font-medium">€{toewijzing.voltooideDetails.bedrag}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Bundle:</span>
                        <span className="text-slate-300">{toewijzing.voltooideDetails.bundleType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Logo:</span>
                        <span className={toewijzing.voltooideDetails.logoKlaar ? 'text-emerald-400' : 'text-yellow-400'}>
                          {toewijzing.voltooideDetails.logoKlaar ? 'Klaar' : 'In bewerking'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {toewijzing.status !== 'voltooid' && (
                  <button
                    onClick={() => setCompletingToewijzing(toewijzing.id)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    {toewijzing.status === 'bezig' ? 'Markeer als voltooid' : 'Start met sponsor'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {completingToewijzing && (
        <CompleteSponsorModal
          toewijzingId={completingToewijzing}
          onClose={() => setCompletingToewijzing(null)}
        />
      )}

      {viewingSponsor && (
        <SponsorDetailsModal
          sponsor={sponsors.find(s => s.id === viewingSponsor)!}
          onClose={() => setViewingSponsor(null)}
        />
      )}
    </div>
  );
}