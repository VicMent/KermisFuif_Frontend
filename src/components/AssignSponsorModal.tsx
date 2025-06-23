import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus } from 'lucide-react';
import { Sponsor } from '../types';

interface AssignSponsorModalProps {
  sponsor: Sponsor;
  onClose: () => void;
}

export function AssignSponsorModal({ sponsor, onClose }: AssignSponsorModalProps) {
  const { users, assignSponsor, toewijzingen } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [logoKlaar, setLogoKlaar] = useState(false);
  const [contantKlaar, setContantKlaar] = useState(false);
  const [vrijkaartenKlaar, setVrijkaartenKlaar] = useState(false);
  const [bedrag, setBedrag] = useState<number>(0);
  const [werkelijkBedrag, setWerkelijkBedrag] = useState<number | undefined>(undefined);

  // Filter out admin users - all regular users are available since each sponsor can only be assigned once
  const availableUsers = users.filter(user => user.rol === 'gebruiker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      assignSponsor(
        sponsor.id,
        selectedUserId,
        bedrag,
        werkelijkBedrag,
        logoKlaar,
        contantKlaar,
        vrijkaartenKlaar
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Sponsor Toewijzen</h3>
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
            <p className="text-slate-400 text-sm">Wijs deze sponsor toe aan een gebruiker</p>
            <p className="text-emerald-400 text-sm mt-1">Target bedrag: €{sponsor.targetBedrag}</p>
          </div>

          {availableUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Geen beschikbare gebruikers om toe te wijzen</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Selecteer gebruiker:
                </label>
                <div className="space-y-2">
                  {availableUsers.map((user) => {
                    const userToewijzingen = toewijzingen.filter(t => t.gebruikerId === user.id);
                    const completedCount = userToewijzingen.filter(t => t.status === 'voltooid').length;
                    const totalAssigned = userToewijzingen.length;
                    
                    return (
                      <label
                        key={user.id}
                        className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-emerald-500 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="userId"
                          value={user.id}
                          checked={selectedUserId === user.id}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          selectedUserId === user.id 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-slate-400'
                        }`}>
                          {selectedUserId === user.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{user.naam}</div>
                          <div className="text-slate-400 text-sm">{user.username}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            {totalAssigned} toegewezen • {completedCount} voltooid
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Gesponsord bedrag</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-slate-700 text-white mb-2"
                  value={bedrag}
                  onChange={e => setBedrag(Number(e.target.value))}
                  required
                />
                <label className="block text-sm text-slate-400 mb-1">Werkelijk bedrag (optioneel)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded bg-slate-700 text-white mb-2"
                  value={werkelijkBedrag ?? ''}
                  onChange={e => setWerkelijkBedrag(e.target.value === '' ? undefined : Number(e.target.value))}
                  min={0}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-4">Status</h4>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" checked={logoKlaar} onChange={e => setLogoKlaar(e.target.checked)} />
                  <span className="text-slate-300">Logo is klaar</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" checked={contantKlaar} onChange={e => setContantKlaar(e.target.checked)} />
                  <span className="text-slate-300">Contant ontvangen</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={vrijkaartenKlaar} onChange={e => setVrijkaartenKlaar(e.target.checked)} />
                  <span className="text-slate-300">Vrijkaarten ontvangen</span>
                </label>
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
                  disabled={!selectedUserId}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Toewijzen
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}