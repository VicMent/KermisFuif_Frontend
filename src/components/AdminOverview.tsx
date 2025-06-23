import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface AdminOverviewProps {
  onClose: () => void;
}

export function AdminOverview({ onClose }: AdminOverviewProps) {
  const { sponsors, toewijzingen, users } = useApp();

  // General statistics
  const totalSponsors = sponsors.length;
  const assignedSponsors = toewijzingen.filter(t => t.status !== 'afgewezen').length;
  const completedSponsors = toewijzingen.filter(t => t.status === 'voltooid').length;
  const inProgressSponsors = toewijzingen.filter(t => t.status === 'bezig').length;
  const unassignedSponsors = totalSponsors - assignedSponsors;

  // Total amounts
  const totalTargetAmount = sponsors.reduce((sum, sponsor) => sum + sponsor.targetBedrag, 0);
  const totalEarnedAmount = toewijzingen
    .filter(t => t.status === 'voltooid')
    .reduce((sum, t) => sum + (typeof t.werkelijkBedrag === 'number' ? t.werkelijkBedrag : t.bedrag), 0);

  // User statistics
  const userStats = users
    .filter(user => user.rol === 'gebruiker')
    .map(user => {
      const userToewijzingen = toewijzingen.filter(t => t.gebruikerId === user.id && t.status !== 'afgewezen');
      const completedCount = userToewijzingen.filter(t => t.status === 'voltooid').length;
      const inProgressCount = userToewijzingen.filter(t => t.status === 'bezig').length;
      const totalAssigned = userToewijzingen.length;
      const totalEarned = userToewijzingen
        .filter(t => t.status === 'voltooid')
        .reduce((sum, t) => sum + (typeof t.werkelijkBedrag === 'number' ? t.werkelijkBedrag : t.bedrag), 0);

      return {
        user,
        totalAssigned,
        completedCount,
        inProgressCount,
        totalEarned,
        completionRate: totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0,
      };
    })
    .sort((a, b) => b.completedCount - a.completedCount);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-6xl w-full bg-slate-800 rounded-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h3 className="text-2xl font-semibold text-white">Sponsor Overzicht</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* General Statistics */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Algemene Statistieken</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Totaal Sponsors</p>
                    <p className="text-2xl font-bold text-white">{totalSponsors}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Toegewezen</p>
                    <p className="text-2xl font-bold text-blue-400">{assignedSponsors}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Voltooid</p>
                    <p className="text-2xl font-bold text-emerald-400">{completedSponsors}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Bezig</p>
                    <p className="text-2xl font-bold text-yellow-400">{inProgressSponsors}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Niet Toegewezen</p>
                    <p className="text-2xl font-bold text-slate-300">{unassignedSponsors}</p>
                  </div>
                  <div className="text-slate-400">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Target Totaal</p>
                    <p className="text-2xl font-bold text-emerald-400">€{totalTargetAmount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Verworven Totaal</p>
                    <p className="text-2xl font-bold text-emerald-400">€{totalEarnedAmount}</p>
                  </div>
                  <div className="text-emerald-400">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Performance */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Gebruiker Prestaties</h4>
            <div className="bg-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Gebruiker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Toegewezen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Voltooid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Bezig
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Verworven
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Voltooiingspercentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {userStats.map((stat) => (
                      <tr key={stat.user.id} className="hover:bg-slate-600 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{stat.user.naam}</div>
                            <div className="text-sm text-slate-400">{stat.user.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-blue-400 font-medium">{stat.totalAssigned}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-emerald-400 font-medium">{stat.completedCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-yellow-400 font-medium">{stat.inProgressCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-emerald-400 font-medium">€{stat.totalEarned}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-slate-600 rounded-full h-2 mr-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stat.completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{stat.completionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {userStats.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          Geen gebruikers gevonden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-emerald-400 mb-2">Voltooiingspercentage</h5>
              <div className="text-3xl font-bold text-white mb-2">
                {assignedSponsors > 0 ? Math.round((completedSponsors / assignedSponsors) * 100) : 0}%
              </div>
              <p className="text-slate-400 text-sm">
                {completedSponsors} van {assignedSponsors} toegewezen sponsors voltooid
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-blue-400 mb-2">Gemiddeld per Gebruiker</h5>
              <div className="text-3xl font-bold text-white mb-2">
                {userStats.length > 0 ? Math.round((completedSponsors / userStats.length) * 10) / 10 : 0}
              </div>
              <p className="text-slate-400 text-sm">
                Voltooide sponsors per actieve gebruiker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}