import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export function AssignMultipleSponsorsModal({ onClose }: { onClose: () => void }) {
  const { users, sponsors, toewijzingen, assignSponsor } = useApp();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  // Alleen gebruikers
  const gebruikers = users.filter(u => u.rol === 'gebruiker');

  // Sponsors die nog niet toegewezen zijn
  const unassignedSponsors = sponsors.filter(s =>
    !toewijzingen.some(t => t.sponsorId === s.id && t.status !== 'afgewezen')
  );

  // Filter op zoekterm
  const filteredSponsors = search.trim()
    ? unassignedSponsors.filter(s =>
        s.naam.toLowerCase().includes(search.trim().toLowerCase())
      )
    : unassignedSponsors;

  const handleSponsorToggle = (sponsorId: string) => {
    setSelectedSponsors(prev =>
      prev.includes(sponsorId)
        ? prev.filter(id => id !== sponsorId)
        : [...prev, sponsorId]
    );
  };

  const handleAssign = () => {
    if (!selectedUser || selectedSponsors.length === 0) return;
    selectedSponsors.forEach(sponsorId => {
      assignSponsor(sponsorId, selectedUser, 0);
    });
    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-white">Meerdere sponsors toewijzen</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Gebruiker</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecteer een gebruiker</option>
            {gebruikers.map(u => (
              <option key={u.id} value={u.id}>
                {u.naam} ({u.username})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Beschikbare sponsors</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Zoek sponsor..."
            className="w-full mb-2 px-3 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="max-h-64 overflow-y-auto border border-slate-700 rounded">
            {filteredSponsors.length === 0 && (
              <div className="text-slate-400 p-4">Geen beschikbare sponsors</div>
            )}
            {filteredSponsors.map(s => (
              <label key={s.id} className="flex items-center px-4 py-2 hover:bg-slate-700 transition">
                <input
                  type="checkbox"
                  checked={selectedSponsors.includes(s.id)}
                  onChange={() => handleSponsorToggle(s.id)}
                  className="mr-3 w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                />
                <span className="text-white">{s.naam}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-700 transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedUser || selectedSponsors.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
          >
            Toewijzen
          </button>
        </div>
      </div>
    </div>
  );
}