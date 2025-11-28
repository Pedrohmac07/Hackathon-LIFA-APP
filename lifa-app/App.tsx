import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

// Importação das Telas (Screens)
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { Dashboard } from './src/screens/Dashboard';
import { CardsScreen } from './src/screens/CardScreens';
import { InsuranceScreen } from './src/screens/InsuranceScreen';
import { LoanScreen } from './src/screens/LoanScreen'; // <--- Importação da tela de Empréstimos

export default function App() {
  // Controle de Estado da Navegação
  // Define quais telas existem no app
  const [screen, setScreen] = useState<'splash' | 'auth' | 'app' | 'cards' | 'insurance' | 'loans'>('splash');

  // Dados do usuário logado
  const [userData, setUserData] = useState<{ id: number, nome: string } | null>(null);

  // --- Funções de Autenticação ---

  const handleLogin = (id: number, nome: string) => {
    setUserData({ id, nome });
    setScreen('app'); // Vai para o Dashboard
  };

  const handleLogout = () => {
    setUserData(null);
    setScreen('auth'); // Volta para o Login
  };

  return (
    <>
      {/* Barra de Status (Bateria, Hora, etc) com estilo Dark */}
      <StatusBar style="light" backgroundColor="#09090B" />

      {/* 1. TELA DE SPLASH (Animação Inicial) */}
      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('auth')} />
      )}

      {/* 2. TELA DE LOGIN/CADASTRO */}
      {screen === 'auth' && (
        <AuthScreen onLoginSuccess={handleLogin} />
      )}

      {/* 3. TELA PRINCIPAL (DASHBOARD) */}
      {screen === 'app' && userData && (
        <Dashboard
          userId={userData.id}
          userName={userData.nome}
          onLogout={handleLogout}
          // Funções de Navegação para o Grid de Serviços
          onNavigateToCards={() => setScreen('cards')}
          onNavigateToInsurance={() => setScreen('insurance')}
          onNavigateToLoans={() => setScreen('loans')}
        />
      )}

      {/* 4. TELA DE CARTÕES */}
      {screen === 'cards' && userData && (
        <CardsScreen
          userId={userData.id}
          onBack={() => setScreen('app')} // Volta para o Dashboard
        />
      )}

      {/* 5. TELA DE SEGUROS */}
      {screen === 'insurance' && userData && (
        <InsuranceScreen
          userId={userData.id}
          onBack={() => setScreen('app')}
        />
      )}

      {/* 6. TELA DE EMPRÉSTIMOS */}
      {screen === 'loans' && userData && (
        <LoanScreen
          userId={userData.id}
          onBack={() => setScreen('app')}
        />
      )}
    </>
  );
}
