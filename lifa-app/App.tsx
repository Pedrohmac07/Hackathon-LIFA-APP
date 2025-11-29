import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

// Importação das Telas (Screens)
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { Dashboard } from './src/screens/Dashboard';
import { CardsScreen } from './src/screens/CardScreens';
import { InsuranceScreen } from './src/screens/InsuranceScreen';
import { LoanScreen } from './src/screens/LoanScreen';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'auth' | 'app' | 'cards' | 'insurance' | 'loans'>('splash');
  const [userData, setUserData] = useState<{ id: number, nome: string } | null>(null);


  const handleLogin = (id: number, nome: string) => {
    setUserData({ id, nome });
    setScreen('app');
  };

  const handleLogout = () => {
    setUserData(null);
    setScreen('auth');
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#09090B" />

      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('auth')} />
      )}

      {screen === 'auth' && (
        <AuthScreen onLoginSuccess={handleLogin} />
      )}

      {screen === 'app' && userData && (
        <Dashboard
          userId={userData.id}
          userName={userData.nome}
          onLogout={handleLogout}
          onNavigateToCards={() => setScreen('cards')}
          onNavigateToInsurance={() => setScreen('insurance')}
          onNavigateToLoans={() => setScreen('loans')}
        />
      )}

      {screen === 'cards' && userData && (
        <CardsScreen
          userId={userData.id}
          onBack={() => setScreen('app')}
        />
      )}

      {screen === 'insurance' && userData && (
        <InsuranceScreen
          userId={userData.id}
          onBack={() => setScreen('app')}
        />
      )}

      {screen === 'loans' && userData && (
        <LoanScreen
          userId={userData.id}
          onBack={() => setScreen('app')}
        />
      )}
    </>
  );
}
