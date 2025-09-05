import { useState, useEffect, useRef } from 'react';
import { HomePage } from './components/HomePage';
import { AchievementsPage } from './components/AchievementsPageFixed';
import { TasksPage } from './components/TasksPage';
import { CasesPage } from './components/CasesPage';
import { ShopPageImageStyled } from './components/ShopPageImageStyled';
import { ProfilePage } from './components/ProfilePage';
import { BattlesPageExtended } from './components/BattlesPageExtended';
import { BattlesPageTest } from './components/BattlesPageTest';
import { BattlesPageMinimal } from './components/BattlesPageMinimal';
import { BackgroundFX } from './components/BackgroundFX';


import { SettingsModal } from './components/SettingsModal';
import { AdminPanel } from './components/AdminPanel';
import { Achievement } from './types/achievements';
import { ShopItem, Order } from './types/shop';
import { Task } from './types/tasks';
import { CaseType, UserCase } from './types/cases';
import { Notification } from './types/notifications';
import { Battle, BattleInvitation, User } from './types/battles';
import { mockShopItems, mockOrders, mockAchievements, mockTasks, mockCaseTypes, mockUserCases, mockNotifications, mockLeaderboard } from './data/mockData';
import { LeaderboardEntry } from './types/global';

// Утилитарная функция для мониторинга localStorage
const getLocalStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

// Функция для очистки localStorage при переполнении
const cleanupLocalStorage = () => {
  const keysToRemove = [
    'oldCases', 'tempCases', 'backup_cases', 'cache_', 'temp_'
  ];
  
  keysToRemove.forEach(keyPattern => {
    Object.keys(localStorage).forEach(key => {
      if (key.includes(keyPattern)) {
        localStorage.removeItem(key);
        console.log(`Удален ключ: ${key}`);
      }
    });
  });
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // По умолчанию тёмная тема
  const [hasAdminAccess, setHasAdminAccess] = useState(false); // Админ доступ отключен по умолчанию
  
  // Глобальное состояние достижений
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  
  // Глобальное состояние товаров
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  
  // Глобальное состояние заказов
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // Глобальное состояние задач
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  // Глобальное состояние кейсов
  const [cases, setCases] = useState<CaseType[]>([]);
  
  // Глобальное состояние пользовательских кейсов
  const [userCases, setUserCases] = useState<UserCase[]>(mockUserCases);
  
  // Глобальное состояние фото профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Глобальное состояние персональных баттлов
  const [personalBattles, setPersonalBattles] = useState<any[]>([]);
  
  // Глобальное состояние уведомлений
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Глобальное состояние лидерборда
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  
  // Глобальное состояние системы баттлов
  const [battles, setBattles] = useState<Battle[]>([
    {
      id: 'battle1',
      challengerId: 'user1',
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 150,
      status: 'completed',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 минут
      winnerId: 'user1',
      winnerName: 'Анна Иванова',
      loserId: 'current-user',
      loserName: 'Вы'
    },
    {
      id: 'battle2',
      challengerId: 'current-user',
      challengerName: 'Вы',
      opponentId: 'user3',
      opponentName: 'Мария Сидорова',
      stake: 200,
      status: 'completed',
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // +45 минут
      winnerId: 'current-user',
      winnerName: 'Вы',
      loserId: 'user3',
      loserName: 'Мария Сидорова'
    },
    {
      id: 'battle3',
      challengerId: 'user4',
      challengerName: 'Алексей Козлов',
      opponentId: 'user2',
      opponentName: 'Петр Петров',
      stake: 100,
      status: 'completed',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // +20 минут
      winnerId: 'user4',
      winnerName: 'Алексей Козлов',
      loserId: 'user2',
      loserName: 'Петр Петров'
    },
    {
      id: 'battle4',
      challengerId: 'user5',
      challengerName: 'Елена Морозова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 75,
      status: 'active',
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 часа назад
    }
  ]);
  const [battleInvitations, setBattleInvitations] = useState<BattleInvitation[]>([
    {
      id: 'invitation1',
      challengerId: 'user3',
      challengerName: 'Мария Сидорова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 120,
      message: 'Вызываю на реванш!',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000), // истекает через 23.5 часа
      status: 'pending'
    },
    {
      id: 'invitation2',
      challengerId: 'user1',
      challengerName: 'Анна Иванова',
      opponentId: 'current-user',
      opponentName: 'Вы',
      stake: 180,
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 минут назад
      expiresAt: new Date(Date.now() + 23.8 * 60 * 60 * 1000), // истекает через 23.8 часа
      status: 'pending'
    }
  ]);
  const [users, setUsers] = useState<User[]>([
    { id: 'user1', name: 'Анна Иванова', level: 15, rating: 1250, isOnline: true },
    { id: 'user2', name: 'Петр Петров', level: 12, rating: 980, isOnline: false },
    { id: 'user3', name: 'Мария Сидорова', level: 18, rating: 1450, isOnline: true },
    { id: 'user4', name: 'Алексей Козлов', level: 14, rating: 1120, isOnline: true },
    { id: 'user5', name: 'Елена Морозова', level: 16, rating: 1380, isOnline: false },
    { id: 'current-user', name: 'Вы', level: 10, rating: 950, isOnline: true }
  ]);
  
  // Флаг для отслеживания первой загрузки
  const casesInitialized = useRef(false);

  const handleNavigate = (page: string) => {
    // Предотвращаем случайные переходы при обработке секретного кода
    if (page !== 'admin') {
      setCurrentPage(page);
    }
  };

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleOpenAdminPanel = () => {
    setCurrentPage('admin');
  };

  const handleAdminNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Функции для управления уведомлениями
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Функции для управления баттлами
  const createBattleInvitation = (invitation: Omit<BattleInvitation, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => {
    const newInvitation: BattleInvitation = {
      ...invitation,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 часа
      status: 'pending'
    };
    
    setBattleInvitations(prev => [newInvitation, ...prev]);
    
    // Отправляем уведомление получателю
    addNotification({
      type: 'battle',
      title: 'Новый вызов на баттл!',
      message: `${invitation.challengerName} вызывает вас на баттл. Ставка: ${invitation.stake} коинов.`,
      priority: 'high',
      data: { invitationId: newInvitation.id, stake: invitation.stake }
    });

    console.log('Создано приглашение на баттл:', newInvitation);
  };

  const acceptBattleInvitation = (invitationId: string) => {
    const invitation = battleInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Обновляем статус приглашения
    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'accepted' as const }
          : inv
      )
    );

    // Создаем активный баттл
    const newBattle: Battle = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      challengerId: invitation.challengerId,
      challengerName: invitation.challengerName,
      opponentId: invitation.opponentId,
      opponentName: invitation.opponentName,
      stake: invitation.stake,
      status: 'active',
      startedAt: new Date()
    };

    setBattles(prev => [newBattle, ...prev]);

    // Уведомляем инициатора
    addNotification({
      type: 'battle',
      title: 'Вызов принят!',
      message: `${invitation.opponentName} принял ваш вызов на баттл. Ставка: ${invitation.stake} коинов.`,
      priority: 'medium',
      data: { battleId: newBattle.id }
    });

    console.log('Баттл создан:', newBattle);
  };

  const declineBattleInvitation = (invitationId: string) => {
    const invitation = battleInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    setBattleInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: 'declined' as const }
          : inv
      )
    );

    // Уведомляем инициатора
    addNotification({
      type: 'battle',
      title: 'Вызов отклонен',
      message: `${invitation.opponentName} отклонил ваш вызов на баттл.`,
      priority: 'low',
      data: { invitationId }
    });
  };

  const completeBattle = (battleId: string, winnerId: string) => {
    const battle = battles.find(b => b.id === battleId);
    if (!battle) return;

    const winnerName = winnerId === battle.challengerId ? battle.challengerName : battle.opponentName;
    const loserName = winnerId === battle.challengerId ? battle.opponentName : battle.challengerName;

    setBattles(prev => 
      prev.map(b => 
        b.id === battleId 
          ? { 
              ...b, 
              status: 'completed' as const,
              completedAt: new Date(),
              winnerId,
              winnerName,
              loserId: winnerId === battle.challengerId ? battle.opponentId : battle.challengerId,
              loserName
            }
          : b
      )
    );

    // Уведомляем участников
    addNotification({
      type: 'battle',
      title: 'Баттл завершен!',
      message: `Победитель: ${winnerName}. Ставка: ${battle.stake} коинов.`,
      priority: 'medium',
      data: { battleId, winnerId, stake: battle.stake }
    });
  };

  const handleToggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Применяем темную тему к документу и добавляем viewport meta tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Добавляем viewport meta tag для корректного отображения на мобильных устройствах
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }, [isDarkMode]);

  // Загружаем сохранённую тему при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true); // По умолчанию тёмная тема
    }

    // Мониторинг размера localStorage при загрузке
    const totalSize = getLocalStorageSize();
    console.log(`Общий размер localStorage: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Если размер больше 8MB, выполняем очистку
    if (totalSize > 8 * 1024 * 1024) {
      console.warn('localStorage близок к переполнению, выполняем очистку');
      cleanupLocalStorage();
    }
  }, []);

  // Загружаем кейсы при инициализации
  useEffect(() => {
    const savedCases = localStorage.getItem('cases');
    if (savedCases) {
      try {
        const parsedCases = JSON.parse(savedCases);
        
        // Мержим сохране��ные кейсы с mock данными
        // Это позволяет сохранить изменения, но восстановить изображения из mock данных
        const mergedCases = parsedCases.map((savedCase: any) => {
          const mockCase = mockCaseTypes.find(mock => mock.id === savedCase.id);
          if (mockCase) {
            return {
              ...savedCase,
              // Восстанавливаем изображение из mock данных если оно не было сохранено
              image: savedCase.image || mockCase.image,
              // Восстанавливаем изображения призов из mock данных
              prizes: savedCase.prizes.map((savedPrize: any) => {
                const mockPrize = mockCase.prizes.find(mp => mp.id === savedPrize.id);
                return {
                  ...savedPrize,
                  image: savedPrize.image || (mockPrize ? mockPrize.image : savedPrize.image)
                };
              })
            };
          }
          return savedCase;
        });
        
        setCases(mergedCases);
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
        setCases(mockCaseTypes);
      }
    } else {
      // Если нет сохраненных кейсов, используем mock данные
      setCases(mockCaseTypes);
    }
    casesInitialized.current = true;
  }, []);

  // Сохраняем кейсы при изменении (но не при первой загрузке)
  useEffect(() => {
    if (casesInitialized.current && cases.length > 0) {
      try {
        // Создаем упрощенную версию кейсов для сохранения (без base64 изображений)
        const casesToSave = cases.map(caseItem => {
          // Если изображение - это base64, не сохраняем его
          const isBase64Image = caseItem.image && caseItem.image.startsWith('data:');
          
          return {
            ...caseItem,
            // Сохраняем изображение только если это не base64
            image: isBase64Image ? null : caseItem.image,
            // Упрощаем призы - убираем base64 изображения
            prizes: caseItem.prizes.map(prize => ({
              ...prize,
              image: prize.image && prize.image.startsWith('data:') ? null : prize.image
            }))
          };
        });

        const dataToSave = JSON.stringify(casesToSave);
        
        // Проверяем размер данных перед сохранением
        const dataSize = new Blob([dataToSave]).size;
        console.log(`Размер данных кейсов: ${(dataSize / 1024).toFixed(2)} KB`);
        
        // Если данные больше 4MB, не сохраняем
        if (dataSize > 4 * 1024 * 1024) {
          console.warn('Данные кейсов слишком большие для localStorage');
          return;
        }

        localStorage.setItem('cases', dataToSave);
      } catch (error) {
        console.error('Ошибка при сохранении кейсов:', error);
        
        // В случае ошибки QuotaExceededError пытаемся очистить старые данные
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage переполнен, очищаем старые данные кейсов');
          try {
            localStorage.removeItem('cases');
            // Также можем очистить другие ненужные данные
            const keysToCheck = ['oldCases', 'tempCases', 'backup_cases'];
            keysToCheck.forEach(key => {
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`Удален ключ: ${key}`);
              }
            });
          } catch (cleanupError) {
            console.error('Ошибка при очистке localStorage:', cleanupError);
          }
        }
      }
    }
  }, [cases]);

  // Загружаем и сохраняем пользовательские кейсы
  useEffect(() => {
    const savedUserCases = localStorage.getItem('userCases');
    if (savedUserCases) {
      try {
        const parsedCases = JSON.parse(savedUserCases, (key, value) => {
          // Восстанавливаем Date объекты
          if (key === 'obtainedAt') {
            return new Date(value);
          }
          return value;
        });
        setUserCases(parsedCases);
      } catch (error) {
        console.error('Ошибка при загрузке пользовательских кейсов:', error);
      }
    }
  }, []);

  // Загружаем и сохраняем персональные баттлы
  useEffect(() => {
    const savedBattles = localStorage.getItem('personalBattles');
    if (savedBattles) {
      try {
        const parsedBattles = JSON.parse(savedBattles, (key, value) => {
          // Восстанавливаем Date объекты
          if (key === 'endDate' || key === 'created') {
            return new Date(value);
          }
          return value;
        });
        setPersonalBattles(parsedBattles);
      } catch (error) {
        console.error('Ошибка при загрузке персонал����ных баттлов:', error);
      }
    }
  }, []);

  // Сохраняем персональные баттлы при изменении
  useEffect(() => {
    if (personalBattles.length > 0 || localStorage.getItem('personalBattles')) {
      try {
        localStorage.setItem('personalBattles', JSON.stringify(personalBattles));
      } catch (error) {
        console.error('Ошибка при сохранении персональных баттлов:', error);
      }
    }
  }, [personalBattles]);

  // Загружаем уведомления при инициализации
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications, (key, value) => {
          if (key === 'timestamp') {
            return new Date(value);
          }
          return value;
        });
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    }

    // Добавляем приветственное уведомление при первом запуске
    const hasWelcomeNotification = localStorage.getItem('hasWelcomeNotification');
    if (!hasWelcomeNotification) {
      setTimeout(() => {
        const welcomeNotification: Notification = {
          id: 'welcome_' + Date.now().toString(),
          type: 'system',
          title: 'Добро пожаловать в GRITHER!',
          message: 'Здесь вы будете получать уведомления о новых задачах, достижениях, баттлах и многом другом.',
          priority: 'medium',
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [welcomeNotification, ...prev]);
        localStorage.setItem('hasWelcomeNotification', 'true');
      }, 2000);
    }
  }, []);

  // Сохраняем уведомления при изменении
  useEffect(() => {
    if (notifications.length > 0 || localStorage.getItem('notifications')) {
      try {
        // Ограничиваем количество сохраняемых уведомлений (последние 100)
        const notificationsToSave = notifications.slice(0, 100);
        localStorage.setItem('notifications', JSON.stringify(notificationsToSave));
      } catch (error) {
        console.error('Ошибка при сохранении уведомлений:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          // В случае переполнения оставляем только последние 50 уведомлений
          try {
            const trimmedNotifications = notifications.slice(0, 50);
            localStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
            setNotifications(trimmedNotifications);
          } catch (trimError) {
            console.error('Не удалось сохранить даже урезанные уведомления:', trimError);
            localStorage.removeItem('notifications');
          }
        }
      }
    }
  }, [notifications]);

  // Сохраняем пользовательские кейсы при изменении
  useEffect(() => {
    if (userCases.length > 0 || localStorage.getItem('userCases')) {
      try {
        const dataToSave = JSON.stringify(userCases);
        const dataSize = new Blob([dataToSave]).size;
        
        // Проверяем размер данных пользовательских кейсов
        if (dataSize > 2 * 1024 * 1024) { // 2MB лимит
          console.warn('Данные пользовательских кейсов слишком большие');
          
          // Оставляем только последние 50 кейсов
          const trimmedUserCases = userCases.slice(-50);
          localStorage.setItem('userCases', JSON.stringify(trimmedUserCases));
          
          // Обновляем состояние
          if (trimmedUserCases.length !== userCases.length) {
            setUserCases(trimmedUserCases);
          }
        } else {
          localStorage.setItem('userCases', dataToSave);
        }
      } catch (error) {
        console.error('Ошибка при сохранении пользовательских кейсов:', error);
        
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          // В случае переполнения оставляем только последние 20 кейсов
          try {
            const trimmedUserCases = userCases.slice(-20);
            localStorage.setItem('userCases', JSON.stringify(trimmedUserCases));
            setUserCases(trimmedUserCases);
            console.log('Сохранены только последние 20 пользовательских кейсов');
          } catch (trimError) {
            console.error('Не удалось сохранить даже урезанные данные:', trimError);
            localStorage.removeItem('userCases');
          }
        }
      }
    }
  }, [userCases]);

  // Секретная комбинация для админ панели
  useEffect(() => {
    let sequence = '';
    const secretCode = 'admin';
    let isProcessingSecret = false;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Предотвращаем обработку если уже обрабатываем секретный код
      if (isProcessingSecret) return;
      
      sequence += e.key.toLowerCase();
      if (sequence.length > secretCode.length) {
        sequence = sequence.slice(-secretCode.length);
      }
      if (sequence === secretCode) {
        isProcessingSecret = true;
        setCurrentPage('admin');
        sequence = '';
        // Сбрасываем флаг через небольшое время
        setTimeout(() => {
          isProcessingSecret = false;
        }, 1000);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'achievements':
        return <AchievementsPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          achievements={achievements}
          setAchievements={setAchievements}
          profilePhoto={profilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
        />;
      case 'tasks':
        return <TasksPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          tasks={tasks}
          setTasks={setTasks}
          theme={isDarkMode ? 'dark' : 'light'}
        />;
      case 'cases':
        return <CasesPage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          cases={cases}
          setCases={setCases}
          userCases={userCases}
          setUserCases={setUserCases}
        />;
      case 'shop':
        return <ShopPageImageStyled 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          shopItems={shopItems}
          setShopItems={setShopItems}
          orders={orders}
          setOrders={setOrders}
          theme={isDarkMode ? 'dark' : 'light'}
        />;
      case 'profile':
        return <ProfilePage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          setProfilePhoto={setProfilePhoto}
          theme={isDarkMode ? 'dark' : 'light'}
          battles={battles}
          battleInvitations={battleInvitations}
          personalBattles={personalBattles}
        />;
      case 'battles':
        return <BattlesPageExtended 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
        />;

      case 'admin':
        return <AdminPanel 
          onNavigate={handleAdminNavigate}
          achievements={achievements}
          setAchievements={setAchievements}
          shopItems={shopItems}
          setShopItems={setShopItems}
          orders={orders}
          setOrders={setOrders}
          tasks={tasks}
          setTasks={setTasks}
          cases={cases}
          setCases={setCases}
          userCases={userCases}
          setUserCases={setUserCases}
          onToggleDarkMode={handleToggleDarkMode}
          battles={battles}
          setBattles={setBattles}
          battleInvitations={battleInvitations}
          setBattleInvitations={setBattleInvitations}
          onCompleteBattle={completeBattle}
        />;
      case 'home':
      default:
        return <HomePage 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          onOpenSettings={handleOpenSettings}
          achievements={achievements}
          profilePhoto={profilePhoto}
          personalBattles={personalBattles}
          setPersonalBattles={setPersonalBattles}
          theme={isDarkMode ? 'dark' : 'light'}
          notifications={notifications}
          onMarkNotificationAsRead={markNotificationAsRead}
          onMarkAllNotificationsAsRead={markAllNotificationsAsRead}
          onRemoveNotification={removeNotification}
          onClearAllNotifications={clearAllNotifications}
          addNotification={addNotification}
          battles={battles}
          battleInvitations={battleInvitations}
          users={users}
          leaderboard={leaderboard}
          onCreateBattleInvitation={createBattleInvitation}
          onAcceptBattleInvitation={acceptBattleInvitation}
          onDeclineBattleInvitation={declineBattleInvitation}
          onCompleteBattle={completeBattle}
        />;
    }
  };

  return (
    <>
      {/* BackgroundFX - самый нижний слой для светлой темы */}
      <BackgroundFX 
        variant="spotlight+grain+vignette" 
        theme={isDarkMode ? 'dark' : 'light'}
      />
      
      {/* Основное содержимое страниц - выше BackgroundFX */}
      <div 
        className="page-content"
        style={{ 
          position: 'relative', 
          zIndex: 10,
          minHeight: '100vh'
        }}
      >
        {renderCurrentPage()}
      </div>
      
      {/* Модальные окна - самый верхний слой */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAdminPanel={handleOpenAdminPanel}
        hasAdminAccess={hasAdminAccess}
        setHasAdminAccess={setHasAdminAccess}
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </>
  );
}