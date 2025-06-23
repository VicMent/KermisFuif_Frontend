import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { X, UserPlus } from 'lucide-react';

export function UserManagementModal({ onClose }: { onClose: () => void }) {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    username: '',
    naam: '',
    wachtwoord: '',
    rol: 'gebruiker' as 'admin' | 'gebruiker',
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      naam: user.naam,
      wachtwoord: user.wachtwoord,
      rol: user.rol,
    });
  };

  const handleSave = () => {
    if (editingUser) {
      updateUser(editingUser.id, { ...form });
      setEditingUser(null);
    } else {
      addUser({ ...form });
    }
    setForm({ username: '', naam: '', wachtwoord: '', rol: 'gebruiker' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      deleteUser(id);
      if (editingUser && editingUser.id === id) {
        setEditingUser(null);
        setForm({ username: '', naam: '', wachtwoord: '', rol: 'gebruiker' });
      }
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: '', naam: '', wachtwoord: '', rol: 'gebruiker' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="p-10 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <UserPlus className="h-7 w-7" /> Gebruikersbeheer
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white rounded-full p-2 transition-colors">
              <X className="h-7 w-7" />
            </button>
          </div>
          <div className="overflow-x-auto rounded">
            <table className="w-full text-left mb-6 text-base">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="py-3">Gebruikersnaam</th>
                  <th>Naam</th>
                  <th>Rol</th>
                  <th className="text-right">Acties</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-700 hover:bg-slate-700/40 transition">
                    <td className="py-2 text-white">{u.username}</td>
                    <td className="text-white">{u.naam}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-sm font-semibold ${
                        u.rol === 'admin'
                          ? 'bg-orange-600/20 text-orange-400'
                          : 'bg-emerald-600/20 text-emerald-400'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-400 hover:text-blue-300 mr-4 underline"
                      >
                        Bewerk
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-400 hover:text-red-300 underline"
                      >
                        Verwijder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-xl text-white mb-4 font-semibold">
              {editingUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker toevoegen'}
            </h3>
            <form
              onSubmit={e => { e.preventDefault(); handleSave(); }}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <div className="flex gap-4">
                <input
                  className="flex-1 p-3 rounded bg-slate-700 text-white placeholder-slate-400 text-lg"
                  placeholder="Gebruikersnaam"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                  disabled={!!editingUser}
                  autoComplete="off"
                />
                <input
                  className="flex-1 p-3 rounded bg-slate-700 text-white placeholder-slate-400 text-lg"
                  placeholder="Naam"
                  value={form.naam}
                  onChange={e => setForm(f => ({ ...f, naam: e.target.value }))}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-4">
                <input
                  className="flex-1 p-3 rounded bg-slate-700 text-white text-lg"
                  placeholder="Wachtwoord"
                  type="password"
                  value={form.wachtwoord}
                  onChange={e => setForm(f => ({ ...f, wachtwoord: e.target.value }))}
                  required
                  autoComplete="new-password"
                />
                <select
                  className="flex-1 p-3 rounded bg-slate-700 text-white text-lg"
                  value={form.rol}
                  onChange={e => setForm(f => ({ ...f, rol: e.target.value as 'admin' | 'gebruiker' }))}
                >
                  <option value="gebruiker">Gebruiker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                {editingUser && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 bg-slate-600 rounded text-white hover:bg-slate-700 transition text-lg"
                  >
                    Annuleren
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700 transition text-lg"
                >
                  {editingUser ? 'Opslaan' : 'Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}