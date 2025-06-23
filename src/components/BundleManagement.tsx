import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Edit, Trash2, Package } from 'lucide-react';

interface BundleManagementProps {
  onClose: () => void;
}

export function BundleManagement({ onClose }: BundleManagementProps) {
  const { bundles, addBundle, updateBundle, deleteBundle } = useApp();
  const [editingBundle, setEditingBundle] = useState<string | null>(null);
  const [newBundle, setNewBundle] = useState({ naam: '', beschrijving: '', prijs: 0 });
  const [editBundle, setEditBundle] = useState({ naam: '', beschrijving: '', prijs: 0 });

  const handleAddBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBundle.naam.trim()) {
      addBundle(newBundle);
      setNewBundle({ naam: '', beschrijving: '', prijs: 0 });
    }
  };

  const handleEditBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBundle && editBundle.naam.trim()) {
      updateBundle(editingBundle, editBundle);
      setEditingBundle(null);
      setEditBundle({ naam: '', beschrijving: '', prijs: 0 });
    }
  };

  const startEdit = (bundle: any) => {
    setEditingBundle(bundle.id);
    setEditBundle({
      naam: bundle.naam,
      beschrijving: bundle.beschrijving,
      prijs: bundle.prijs,
    });
  };

  const cancelEdit = () => {
    setEditingBundle(null);
    setEditBundle({ naam: '', beschrijving: '', prijs: 0 });
  };

  const handleDelete = (bundleId: string, bundleName: string) => {
    if (window.confirm(`Weet je zeker dat je de bundle "${bundleName}" wilt verwijderen?`)) {
      deleteBundle(bundleId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-emerald-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Bundle Beheer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Bundle */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-4">Nieuwe Bundle Toevoegen</h4>
            <form onSubmit={handleAddBundle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bundle Naam *
                  </label>
                  <input
                    type="text"
                    value={newBundle.naam}
                    onChange={(e) => setNewBundle(prev => ({ ...prev, naam: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Brons, Zilver, Goud..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Beschrijving
                  </label>
                  <input
                    type="text"
                    value={newBundle.beschrijving}
                    onChange={(e) => setNewBundle(prev => ({ ...prev, beschrijving: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Korte beschrijving..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prijs (€)
                  </label>
                  <input
                    type="number"
                    value={newBundle.prijs}
                    onChange={(e) => setNewBundle(prev => ({ ...prev, prijs: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Bundle Toevoegen
                </button>
              </div>
            </form>
          </div>

          {/* Existing Bundles */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Bestaande Bundles</h4>
            {bundles.length === 0 ? (
              <div className="text-center py-8 bg-slate-700 rounded-lg">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Nog geen bundles toegevoegd</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="bg-slate-700 rounded-lg p-4">
                    {editingBundle === bundle.id ? (
                      <form onSubmit={handleEditBundle} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <input
                              type="text"
                              value={editBundle.naam}
                              onChange={(e) => setEditBundle(prev => ({ ...prev, naam: e.target.value }))}
                              required
                              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={editBundle.beschrijving}
                              onChange={(e) => setEditBundle(prev => ({ ...prev, beschrijving: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={editBundle.prijs}
                              onChange={(e) => setEditBundle(prev => ({ ...prev, prijs: parseFloat(e.target.value) || 0 }))}
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-1 text-slate-300 hover:text-white border border-slate-600 rounded-md hover:bg-slate-600 transition-colors"
                          >
                            Annuleren
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                          >
                            Opslaan
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-medium">{bundle.naam}</h5>
                          {bundle.beschrijving && (
                            <p className="text-slate-400 text-sm">{bundle.beschrijving}</p>
                          )}
                          {bundle.prijs > 0 && (
                            <p className="text-emerald-400 text-sm font-medium">€{bundle.prijs}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(bundle)}
                            className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bundle.id, bundle.naam)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}