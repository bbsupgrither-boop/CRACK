import { useState } from 'react';
import { Crown, X } from './Icons';
import { Battle, BattleInvitation } from '../types/battles';

interface PublicBattle {
  id: string; // Изменяем на string чтобы соответствовать Battle.id
  originalId: string; // Добавляем поле для оригинального ID
  challenger: { name: string; status: 'winning' | 'losing' | 'neutral' };
  opponent: { name: string; status: 'winning' | 'losing' | 'neutral' };
  date: string;
  prize: number;
  status: 'active' | 'finished';
}

interface BattlesManagementProps {
  battles: Battle[];
  setBattles: (battles: Battle[]) => void;
  battleInvitations: BattleInvitation[];
  setBattleInvitations: (invitations: BattleInvitation[]) => void;
  onCompleteBattle: (battleId: string, winnerId: string) => void;
}

export function BattlesManagement({ 
  battles, 
  setBattles, 
  battleInvitations, 
  setBattleInvitations, 
  onCompleteBattle 
}: BattlesManagementProps) {
  // Преобразуем battles в формат для отображения
  const displayBattles: PublicBattle[] = battles.map((battle, index) => ({
    id: `display-${battle.id}-${index}`, // Уникальный display ID
    originalId: battle.id, // Сохраняем оригинальный ID
    challenger: { 
      name: battle.challengerName, 
      status: battle.winnerId === battle.challengerId ? 'winning' : 
              battle.winnerId === battle.opponentId ? 'losing' : 'neutral' 
    },
    opponent: { 
      name: battle.opponentName, 
      status: battle.winnerId === battle.opponentId ? 'winning' : 
              battle.winnerId === battle.challengerId ? 'losing' : 'neutral' 
    },
    date: battle.startedAt.toLocaleDateString('ru-RU'),
    prize: battle.stake,
    status: battle.status === 'completed' ? 'finished' : 'active'
  }));

  const handleSetWinner = (originalId: string, winner: 'challenger' | 'opponent') => {
    const battle = battles.find(b => b.id === originalId);
    if (!battle) return;

    const winnerId = winner === 'challenger' ? battle.challengerId : battle.opponentId;
    onCompleteBattle(battle.id, winnerId);
  };

  const handleDeleteBattle = (originalId: string) => {
    const battleToDelete = battles.find(b => b.id === originalId);
    if (battleToDelete) {
      setBattles(battles.filter(b => b.id !== battleToDelete.id));
    }
  };

  const activeBattles = displayBattles.filter(b => b.status === 'active');
  const finishedBattles = displayBattles.filter(b => b.status === 'finished');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-text">Управление баттлами</h2>
        <div className="text-sm text-text-muted">
          Просмотр и управление результатами баттлов
        </div>
      </div>

      {/* Активные баттлы */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-text mb-4">Активные баттлы ({activeBattles.length})</h3>
        
        {activeBattles.length > 0 ? (
          <div className="space-y-4">
            {activeBattles.map((battle, index) => (
              <div
                key={battle.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-surface-2 rounded-full text-sm font-medium">
                      {battle.challenger.name}
                    </span>
                    <span className="text-text-muted text-sm">VS</span>
                    <span className="px-3 py-1 bg-surface-2 rounded-full text-sm font-medium">
                      {battle.opponent.name}
                    </span>
                  </div>
                  <div className="text-sm text-text-muted">
                    Ставка: {battle.prize}g
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSetWinner(battle.originalId, 'challenger')}
                    className="flex items-center gap-1 px-3 py-1 bg-chart-2 text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                    title={`${battle.challenger.name} победил`}
                  >
                    <Crown className="w-3 h-3" />
                    {battle.challenger.name}
                  </button>
                  <button
                    onClick={() => handleSetWinner(battle.originalId, 'opponent')}
                    className="flex items-center gap-1 px-3 py-1 bg-chart-2 text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                    title={`${battle.opponent.name} победил`}
                  >
                    <Crown className="w-3 h-3" />
                    {battle.opponent.name}
                  </button>
                  <button
                    onClick={() => handleDeleteBattle(battle.originalId)}
                    className="p-1 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                    title="Удалить баттл"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">Нет активных баттлов</p>
        )}
      </div>

      {/* Завершенные баттлы */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-text mb-4">Завершенные баттлы ({finishedBattles.length})</h3>
        
        {finishedBattles.length > 0 ? (
          <div className="space-y-3">
            {finishedBattles.map((battle, index) => (
              <div
                key={battle.id}
                className="flex items-center justify-between p-3 bg-surface-2 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      battle.challenger.status === 'winning' 
                        ? 'bg-chart-2 text-white' 
                        : 'bg-destructive text-destructive-foreground'
                    }`}
                  >
                    {battle.challenger.name}
                  </span>
                  <span className="text-text-muted text-sm">VS</span>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      battle.opponent.status === 'winning' 
                        ? 'bg-chart-2 text-white' 
                        : 'bg-destructive text-destructive-foreground'
                    }`}
                  >
                    {battle.opponent.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-text-muted">
                    Ставка: {battle.prize}g
                  </div>
                  <div className="text-sm text-text-muted">
                    {battle.date}
                  </div>
                  <button
                    onClick={() => handleDeleteBattle(battle.originalId)}
                    className="p-1 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                    title="Удалить из истории"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">Нет завершенных баттлов</p>
        )}
      </div>
    </div>
  );
}