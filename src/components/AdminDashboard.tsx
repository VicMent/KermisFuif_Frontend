import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Trash2, UserPlus, Eye, BarChart3, Package, XCircle, Gift } from 'lucide-react';
import { SponsorForm } from './SponsorForm';
import { AssignSponsorModal } from './AssignSponsorModal';
import { SponsorDetailsModal } from './SponsorDetailsModal';
import { AdminOverview } from './AdminOverview';
import { BundleManagement } from './BundleManagement';
import { UserManagementModal } from './UserManagementModal';
import { AssignMultipleSponsorsModal } from './AssignMultipleSponsorsModal';
import { Sponsor } from '../types';

export function AdminDashboard() {
  const { sponsors, deleteSponsor, toewijzingen, users, updateToewijzing, bundles } = useApp();
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [assigningSponsor, setAssigningSponsor] = useState<Sponsor | null>(null);
  const [viewingSponsor, setViewingSponsor] = useState<Sponsor | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [showBundleManagement, setShowBundleManagement] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAssignMultiple, setShowAssignMultiple] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(0);

  // Search, filter and user filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'assigned' | 'unassigned' | 'completed' | 'onvoltooid'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [bundleFilter, setBundleFilter] = useState<string>('all');

  const getSponsorAssignment = (sponsorId: string) => {
    return toewijzingen.find(
      t => t.sponsorId === sponsorId && t.status !== 'afgewezen'
    );
  };

  const handleDelete = (sponsor: Sponsor) => {
    if (window.confirm(`Weet je zeker dat je ${sponsor.naam} wilt verwijderen?`)) {
      deleteSponsor(sponsor.id);
    }
  };

  const canAssignSponsor = (sponsorId: string) => {
    return !toewijzingen.some(t => t.sponsorId === sponsorId);
  };

  const handleUnassign = (assignmentId: string) => {
    if (window.confirm('Weet je zeker dat je deze toewijzing wilt verwijderen?')) {
      updateToewijzing(assignmentId, {
        status: 'afgewezen',
        gebruikerId: '',
        bedrag: 0,
        werkelijkBedrag: undefined,
        logoKlaar: false,
        contantKlaar: false,
        vrijkaartenKlaar: false,
        opmerkingen: '',
        bundleTypes: [], // <-- bundels vergeten bij unassign!
      });
    }
  };

  // RESET functie: zet alle 'bezig' of 'voltooid' toewijzingen terug naar 'toegewezen'
  const handleResetAll = () => {
    toewijzingen.forEach(t => {
      if (t.status === 'bezig' || t.status === 'voltooid') {
        updateToewijzing(t.id, {
          status: 'toegewezen',
          bedrag: 0,
          werkelijkBedrag: undefined,
          bundleTypes: [],
          logoKlaar: false,
          contantKlaar: false,
          vrijkaartenKlaar: false,
          opmerkingen: '',
          voltooideOp: undefined,
        });
      }
    });
    setShowResetModal(false);
    setResetConfirm(0);
  };

  // Smart search and filter
  const filteredSponsors = useMemo(() => {
    let result = sponsors;

    // Filter
    if (filter === 'assigned') {
      result = result.filter(s => {
        const a = getSponsorAssignment(s.id);
        return !!a;
      });
    } else if (filter === 'unassigned') {
      result = result.filter(s => {
        const a = getSponsorAssignment(s.id);
        return !a;
      });
    } else if (filter === 'completed') {
      result = result.filter(s => {
        const a = getSponsorAssignment(s.id);
        return a?.status === 'voltooid';
      });
    } else if (filter === 'onvoltooid') {
      result = result.filter(s => {
        const a = getSponsorAssignment(s.id);
        return a && a.status !== 'voltooid';
      });
    }

    // User filter
    if (userFilter !== 'all') {
      result = result.filter(s => {
        const a = getSponsorAssignment(s.id);
        return a && a.gebruikerId === userFilter;
      });
    }

    // Bundle filter
    if (bundleFilter !== 'all') {
      result = result.filter(s => {
        const sponsorToewijzingen = toewijzingen.filter(t => t.sponsorId === s.id);
        return sponsorToewijzingen.some(t =>
          Array.isArray(t.bundleTypes) && t.bundleTypes.includes(bundleFilter)
        );
      });
    }

    // Search (case-insensitive, matches naam, contactpersoon, email)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(s =>
        s.naam.toLowerCase().includes(q) ||
        s.contactpersoon?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [sponsors, filter, search, toewijzingen, userFilter, bundleFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Sponsor Beheer</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBundleManagement(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            Bundles
          </button>
          <button
            onClick={() => setShowOverview(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overzicht
          </button>
          <button
            onClick={() => setShowSponsorForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Sponsor
          </button>
          <button
            onClick={() => setShowUserManagement(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nieuwe Gebruiker
          </button>
          <button
            onClick={() => setShowAssignMultiple(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sponsors Toewijzen
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            <XCircle className="h-4 w-4 mr-2" />
            RESET
          </button>
        </div>
      </div>

      {/* Searchbar, Filter, User Filter & Bundle Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Zoek op naam, contactpersoon of e-mail..."
          className="w-full md:w-72 px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded ${filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-emerald-700 transition`}
          >
            Alles
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-3 py-2 rounded ${filter === 'assigned' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-emerald-700 transition`}
          >
            Toegewezen
          </button>
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-3 py-2 rounded ${filter === 'unassigned' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-emerald-700 transition`}
          >
            Niet toegewezen
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-2 rounded ${filter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-emerald-700 transition`}
          >
            Voltooid
          </button>
          <button
            onClick={() => setFilter('onvoltooid')}
            className={`px-3 py-2 rounded ${filter === 'onvoltooid' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'} hover:bg-emerald-700 transition`}
          >
            Onvoltooid
          </button>
        </div>
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Alle gebruikers</option>
          {users
            .filter(u => u.rol === 'gebruiker')
            .map(u => (
              <option key={u.id} value={u.id}>
                {u.naam} ({u.username})
              </option>
            ))}
        </select>
        <select
          value={bundleFilter}
          onChange={e => setBundleFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Alle bundels</option>
          {bundles.map(bundle => (
            <option key={bundle.id} value={bundle.naam}>
              {bundle.naam}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSponsors.map((sponsor) => {
          const assignment = getSponsorAssignment(sponsor.id);
          const assignedUser = assignment ? users.find(u => u.id === assignment.gebruikerId) : null;

          // Verzamel unieke bundlenamen uit alle toewijzingen van deze sponsor
          const sponsorToewijzingen = toewijzingen.filter(t => t.sponsorId === sponsor.id);
          const allBundles = sponsorToewijzingen
            .flatMap(t => Array.isArray(t.bundleTypes) ? t.bundleTypes : [])
            .filter(Boolean);
          const uniqueBundles = Array.from(new Set(allBundles));

          return (
            <div key={sponsor.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-emerald-500 transition-colors duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{sponsor.naam}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingSponsor(sponsor)}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingSponsor(sponsor)}
                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {assignment ? (
                    <button
                      onClick={() => handleUnassign(assignment.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      title="Toewijzing verwijderen"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setAssigningSponsor(sponsor)}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Gebruiker toewijzen"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(sponsor)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Bundles overzicht */}
              {uniqueBundles.length > 0 && (
                <div className="flex items-center flex-wrap mb-2">
                  <Gift className="h-4 w-4 text-emerald-400 mr-2" />
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

              <div className="space-y-2">
                {assignment ? (
                  <div className="pt-3 border-t border-slate-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Toegewezen aan:</span>
                      <span className="text-blue-400">{assignedUser?.naam}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        assignment.status === 'voltooid' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : assignment.status === 'bezig'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Gesponsord:</span>
                      <span className="text-emerald-400 font-medium">€{assignment.bedrag}</span>
                    </div>
                    {assignment.werkelijkBedrag !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Werkelijk bedrag:</span>
                        <span className="text-emerald-400 font-medium">€{assignment.werkelijkBedrag}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 text-xs text-slate-400">
                      <span>Logo: {assignment.logoKlaar ? '✅' : '❌'}</span>
                      <span>Contant: {assignment.contantKlaar ? '✅' : '❌'}</span>
                      <span>Vrijkaarten: {assignment.vrijkaartenKlaar ? '✅' : '❌'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">Nog niet toegewezen</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showSponsorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <SponsorForm
              onClose={() => setShowSponsorForm(false)}
            />
          </div>
        </div>
      )}

      {editingSponsor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <SponsorForm
              sponsor={editingSponsor}
              onClose={() => setEditingSponsor(null)}
            />
          </div>
        </div>
      )}

      {assigningSponsor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <AssignSponsorModal
              sponsor={assigningSponsor}
              onClose={() => setAssigningSponsor(null)}
            />
          </div>
        </div>
      )}

      {viewingSponsor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <SponsorDetailsModal
              sponsor={viewingSponsor}
              onClose={() => setViewingSponsor(null)}
            />
          </div>
        </div>
      )}

      {showOverview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <AdminOverview
              onClose={() => setShowOverview(false)}
            />
          </div>
        </div>
      )}

      {showBundleManagement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <BundleManagement
              onClose={() => setShowBundleManagement(false)}
            />
          </div>
        </div>
      )}

      {showUserManagement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <UserManagementModal
              onClose={() => setShowUserManagement(false)}
            />
          </div>
        </div>
      )}

      {showAssignMultiple && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
            <AssignMultipleSponsorsModal
              onClose={() => setShowAssignMultiple(false)}
            />
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Bevestig RESET</h3>
            <p className="text-slate-300 mb-6">
              Weet je zeker dat je <span className="text-red-400 font-bold">ALLE sponsors die bezig of voltooid zijn</span> wilt resetten naar de status <span className="font-bold text-emerald-400">toegewezen</span>? <br />
              Alle ingevulde info zoals bedrag en bundels wordt verwijderd. <br />
              <span className="font-bold">Deze actie kan niet ongedaan worden gemaakt!</span>
            </p>
            <div className="mb-6">
              <label className="block text-slate-400 mb-2">Schuif helemaal naar rechts om te bevestigen:</label>
              {/* Simpele slider, je mag ook een andere slider gebruiken */}
              <input
                type="range"
                min={0}
                max={100}
                value={resetConfirm}
                onChange={e => setResetConfirm(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Niet resetten</span>
                <span>Bevestig reset</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirm(0);
                }}
                className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-700 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleResetAll}
                disabled={resetConfirm < 100}
                className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md transition-all duration-200 ${resetConfirm < 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                RESET alles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}